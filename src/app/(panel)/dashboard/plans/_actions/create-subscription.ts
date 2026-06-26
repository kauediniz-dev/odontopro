"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { stripe } from "@/utils/stripe";
import { Plan } from "@prisma/client";

interface SubscriptionProps {
  type: Plan;
}

export async function createSubscription({ type }: SubscriptionProps) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    // ✅ Validar userId
    if (!userId) {
      return {
        sessionId: "",
        error: "Usuário não autenticado.",
      };
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    // ✅ Validar usuário
    if (!findUser) {
      return {
        sessionId: "",
        error: "Usuário não encontrado.",
      };
    }

    // ✅ Validar email
    if (!findUser.email) {
      return {
        sessionId: "",
        error: "Usuário não possui um email cadastrado.",
      };
    }

    // ✅ Validar variáveis de ambiente
    const priceId =
      type === "BASIC"
        ? process.env.STRIPE_PLAN_BASIC
        : process.env.STRIPE_PLAN_PROFISSIONAL;

    if (!priceId) {
      return {
        sessionId: "",
        error: `Plano ${type} não configurado.`,
      };
    }

    if (!process.env.STRIPE_SUCCESS_URL || !process.env.STRIPE_CANCEL_URL) {
      return {
        sessionId: "",
        error: "URLs de redirecionamento não configuradas.",
      };
    }

    let customerId = findUser.stripe_customer_id;

    // ✅ Criar customer se não existir
    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: findUser.email,
        metadata: {
          userId: userId,
        },
      });

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          stripe_customer_id: stripeCustomer.id,
        },
      });

      customerId = stripeCustomer.id;
    }

    // ✅ Criar checkout session
    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        type: type,
      },
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    return {
      sessionId: stripeCheckoutSession.id,
      url: stripeCheckoutSession.url,
    };
  } catch (err) {
    console.error("[createSubscription] Error:", err);
    return {
      sessionId: "",
      error: "Falha ao ativar plano. Tente novamente.",
    };
  }
}
