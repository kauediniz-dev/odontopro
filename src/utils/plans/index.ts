export type PlanDetailsProps = {
  maxServices: number;
};

export type PlanProps = {
  BASIC: PlanDetailsProps;
  PRO: PlanDetailsProps;
};

export const PLANS: PlanProps = {
  BASIC: {
    maxServices: 3,
  },
  PRO: {
    maxServices: 50,
  },
};

export const subscriptionPlans = [
  {
    id: "BASIC",
    name: "Basic",
    description: "Ideal para clinicas menores",
    oldPrice: "R$ 97,99",
    price: "R$ 29,99",
    features: [
      `Até ${PLANS["BASIC"].maxServices} serviços`,
      "Agendamentos ilimitado",
      "Suporte",
      "Relatótios",
    ],
  },
  {
    id: "PRO",
    name: "Profissional",
    description: "Perfeito para clinicas GRANDES",
    oldPrice: "R$ 197,99",
    price: "R$ 97,99",
    features: [
      `Até ${PLANS["PRO"].maxServices} serviços`,
      "Agendamentos ilimitado",
      "Suporte prioritario",
      "Relatótios avançados",
    ],
  },
];
