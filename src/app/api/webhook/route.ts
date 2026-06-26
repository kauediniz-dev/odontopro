import { stripe } from "@/utils/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { menageSubscription } from "@/utils/manage-subscription";
import { Plan } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const POST = async (req: Request) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Signature missing" }, { status: 400 });
  }

  try {
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
          payment.id,
          payment.customer as string, // ← removeu .toString()
          false,
          true,
        );
        break;

      case "customer.subscription.updated":
        const paymentIntent = event.data.object as Stripe.Subscription;
        await menageSubscription(
          paymentIntent.id,
          paymentIntent.customer as string, // ← removeu .toString()
          false,
        );
        break;

      case "checkout.session.completed":
        const checkoutSession = event.data.object as Stripe.Checkout.Session;

        if (checkoutSession.subscription && checkoutSession.customer) {
          const type = (checkoutSession?.metadata?.type || "BASIC") as Plan;

          await menageSubscription(
            checkoutSession.subscription as string, // ← removeu .toString()
            checkoutSession.customer as string,
            true,
            false,
            type,
          );
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    revalidatePath("/dashboard/plans");
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
};
