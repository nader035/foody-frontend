export type SolutionIcon = "utensils" | "heart" | "shoppingBag";

export type SolutionItem = {
  id: string;
  icon: SolutionIcon;
  title: string;
  subtitle: string;
  desc: string;
  benefits: string[];
  stat: { v: string; l: string };
  color: string;
};

export const solutions: SolutionItem[] = [
  {
    id: "restaurants",
    icon: "utensils",
    title: "For Restaurant Chains",
    subtitle: "Recover food costs and build your CSR profile",
    desc: "Foody helps multi-branch restaurant chains recover part of food costs through discounted meal sales, while building a documented record of community responsibility through organized donations.",
    benefits: [
      "Recover revenue from surplus instead of waste",
      "Documented CSR record for stakeholders",
      "Real-time visibility across all branches",
      "Automated surplus distribution policies",
      "Detailed impact reports for ESG compliance",
    ],
    stat: { v: "30%", l: "average daily waste typically goes to landfill" },
    color: "#155433",
  },
  {
    id: "charities",
    icon: "heart",
    title: "For Charity Organizations",
    subtitle: "Organized and reliable donation channel",
    desc: "NGOs and food banks partnered with restaurants gain access to an organized, reliable donation channel with instant notifications, precise pickup scheduling, and complete audit trails.",
    benefits: [
      "Instant alerts when donations are available",
      "One-tap pickup confirmation",
      "Precise scheduling for collection times",
      "Complete donation history and receipts",
      "Multiple restaurant partners in one dashboard",
    ],
    stat: { v: "48", l: "meals donated daily through our platform" },
    color: "#25A05F",
  },
  {
    id: "customers",
    icon: "shoppingBag",
    title: "For Individual Customers",
    subtitle: "Fresh quality meals at affordable prices",
    desc: "People who care about price and quality and are located near branches can access fresh, high-quality meals at affordable prices, available instantly during hours close to closing time.",
    benefits: [
      "Up to 50% off restaurant-quality meals",
      "Fresh food prepared the same day",
      "Browse nearby surplus listings in real-time",
      "Countdown timers show availability windows",
      "Reduce food waste while saving money",
    ],
    stat: { v: "50%", l: "average savings on every meal" },
    color: "#0E3442",
  },
];
