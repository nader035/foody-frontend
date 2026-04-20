import type { Donation } from "@/lib/api-client";

export type Tab =
  | "dashboard"
  | "donations"
  | "history"
  | "notifications"
  | "profile"
  | "settings";

export interface DonationView extends Donation {
  mealTitle: string;
  branchName: string;
}

export interface NotificationItem {
  id: string;
  text: string;
  time: string;
  unread: boolean;
}
