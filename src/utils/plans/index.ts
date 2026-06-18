export type PlanDetailsProps = {
  maxServices: number;
};

export type PlanProps = {
  BASIC: PlanDetailsProps;
  PROFESSIONAL: PlanDetailsProps;
};

export const PLANS: PlanProps = {
  BASIC: {
    maxServices: 3,
  },
  PROFESSIONAL: {
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
      `até ${PLANS["BASIC"].maxServices} serviços`,
      "Agendamentos ilimitado",
      "Suporte",
      "Relatótios",
    ],
  },
  {
    id: "PROFESSIONAL",
    name: "Profissional",
    description: "Perfeito para clinicas GRANDES",
    oldPrice: "R$ 197,99",
    price: "R$ 97,99",
    features: [
      `até ${PLANS["PROFESSIONAL"].maxServices} serviços`,
      "Agendamentos ilimitado",
      "Suporte prioritario",
      "Relatótios avançados",
    ],
  },
];
