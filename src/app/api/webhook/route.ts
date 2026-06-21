import { stripe } from "@/utils/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { menageSubscription } from "@/utils/manage-subscription";
import { Plan } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const POST = async (req: Request) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.error();
  }

  const text = await req.text();
  const event = stripe.webhooks.constructEvent(
    text,
    signature,
    process.env.STRIPE_SECRET_WEBHOOK_KEY as string,
  );

  switch (event.type) {
    case "customer.subscription.deleted":
      const payment = event.data.object as Stripe.Subscription;

      await menageSubscription(
        // Ir no banco de dados e deletar a assinatura
        payment.id,
        payment.customer.toString(),
        false,
        true,
      );

      // Ir no banco de dados e deletar a assinatura
      break;
    case "customer.subscription.updated":
      const paymentIntent = event.data.object as Stripe.Subscription;

      await menageSubscription(
        // Ir no banco de dados e atualizar a assinatura
        paymentIntent.id,
        paymentIntent.customer.toString(),
        false,
      );
      // Ir no banco de dados e atualizar a assinatura
      break;
    case "checkout.session.completed":
      const checkoutSession = event.data.object as Stripe.Checkout.Session;

      const type = checkoutSession?.metadata?.type
        ? checkoutSession?.metadata?.type
        : "BASIC";

      // Ir no banco de dados e criar um checkout session
      if (checkoutSession.subscription && checkoutSession.customer) {
        await menageSubscription(
          checkoutSession.subscription.toString(),
          checkoutSession.customer.toString(),
          true,
          false,
          type as Plan,
        );
      }
      break;
    default:
  }
  revalidatePath("/dashboard/plans");

  return NextResponse.json({ received: true });
};
