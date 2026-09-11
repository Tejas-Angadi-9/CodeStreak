import type { IWelcomeFeatureList } from "../interfaces/welcome.interface";

export const welcomeFeaturesList: IWelcomeFeatureList[] = [
  {
    id: 1,
    icon: <span className="text-xl">🔥</span>,
    title: "Track your daily streak",
  },
  {
    id: 2,
    icon: <span className="text-xl">👥</span>,
    title: "Stay accountable with friends",
  },

  {
    id: 3,
    icon: <span className="text-xl">⚡</span>,
    title: "Sync from LeetCode automatically",
  },
  {
    id: 4,
    icon: <span className="text-xl">🏆</span>,
    title: "Earn badges and milestones",
  },
];
