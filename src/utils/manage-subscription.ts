import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { stripe } from "@/utils/stripe";
import { Plan } from "@prisma/client";

/**
 *Salvar, atualizar ou deletar informações das assinaturas (subscription) no banco de
 *dados, sincronizando com o stripe
 *
 * @async
 * @function menageSubscription
 * @param {string} subscriptionId - O ID da assinatura no Stripe.
 * @param {string} customerId - O ID do cliente no Stripe.
 * @param {boolean} createAction - Indica se deve criar uma nova assinatura.
 * @param {boolean} deleteAction - Indica se deve deletar uma assinatura.
 * @param {Plan} type - O plano de assinatura.
 * @returns {Promise<Response | void>} - Uma Promise que resolve para uma resposta.
 */
export async function menageSubscription(
  subscriptionId: string,
  customerId: string,
  createAction = false,
  deleteAction = false,
  type?: Plan,
) {
  //Buscar do banco o usuario com esse customerId
  // Salvar os dados da assinatura feitos no banco

  const findUser = await prisma.user.findFirst({
    where: {
      stripe_customer_id: customerId,
    },
  });

  if (!findUser) {
    return Response.json(
      { error: "Falha ao realizar a assinatura" },
      { status: 400 },
    );
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Mapear status do Stripe para o enum
  const mapStripeStatusToEnum = (
    stripeStatus: Stripe.Subscription.Status,
  ): "ATIVO" | "INATIVO" => {
    return stripeStatus === "active" || stripeStatus === "trialing"
      ? "ATIVO"
      : "INATIVO";
  };

  const subscriptionData = {
    // DADOS DA ASSINATURA NO BANCO DE DADOS
    id: subscription.id,
    userId: findUser.id,
    status: mapStripeStatusToEnum(subscription.status),
    priceId: subscription.items.data[0].price.id,
    plano: type ?? "BASIC",
  };

  if (subscriptionId && deleteAction) {
    await prisma.subscription.delete({
      where: {
        id: subscriptionId,
      },
    });

    return;
  }

  if (createAction) {
    try {
      await prisma.subscription.create({
        data: subscriptionData,
      });
    } catch (err) {
      console.log("Erro ao salvar no banco de dados");
      console.log(err);
    }
  } else {
    try {
      const findSubscription = await prisma.subscription.findFirst({
        where: {
          id: subscriptionId,
        },
      });

      if (!findSubscription) {
        return Response.json(
          { error: "Falha ao realizar a assinatura" },
          { status: 400 },
        );
      }

      await prisma.subscription.update({
        where: {
          id: findSubscription.id,
        },
        data: {
          status: mapStripeStatusToEnum(subscription.status),
          priceId: subscription.items.data[0].price.id,
          plano: type ?? "BASIC",
        },
      });
    } catch (err) {
      console.log("Erro ao atualizar no banco de dados");
      console.log(err);
    }
  }
}
