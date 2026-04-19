interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: string;
  features: string[];
  recommended?: boolean;
  cta: string;
}

export const plans: Plan[] = [
  {
    id: "plan_starter",
    name: "Starter",
    description: "Perfect for individuals and small projects",
    price: 1000,
    period: "/month",
    cta: "Get Started",
    features: [
      "Up to 10,000 API calls/month",
      "5 GB storage",
      "Email support",
      "Basic analytics",
      "Community forum access",
    ],
  },
  {
    id: "plan_professional",
    name: "Professional",
    description: "Ideal for growing teams and businesses",
    price: 2000,
    period: "/month",
    cta: "Choose Plan",
    recommended: true,
    features: [
      "Up to 100,000 API calls/month",
      "100 GB storage",
      "Priority email & chat support",
      "Advanced analytics",
      "Custom integrations",
      "Team management (up to 5 members)",
      "SSL certificate included",
    ],
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    description: "For large-scale operations",
    price: 3000,
    period: "/month",
    cta: "Contact Sales",
    features: [
      "Unlimited API calls",
      "Unlimited storage",
      "24/7 dedicated support",
      "Advanced analytics & reporting",
      "Custom integrations",
      "Unlimited team members",
      "SLA guarantee (99.9% uptime)",
      "Advanced security features",
      "Custom domain support",
    ],
  },
];
