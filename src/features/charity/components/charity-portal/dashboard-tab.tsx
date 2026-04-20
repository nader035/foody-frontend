import { Bell, Check, Heart, Truck } from "lucide-react";
import type { DonationView } from "./types";
import { formatDateTime, statusColor } from "./utils";

interface DashboardTabProps {
  pendingDonations: DonationView[];
  completedDonations: DonationView[];
  totalReceivedMeals: number;
  unreadCount: number;
  onOpenDonations: () => void;
}

export function DashboardTab({
  pendingDonations,
  completedDonations,
  totalReceivedMeals,
  unreadCount,
  onOpenDonations,
}: DashboardTabProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Pending Pickups",
            value: pendingDonations.length,
            icon: Truck,
          },
          {
            label: "Completed",
            value: completedDonations.filter((d) => d.status === "completed")
              .length,
            icon: Check,
          },
          {
            label: "Total Meals",
            value: totalReceivedMeals,
            icon: Heart,
          },
          { label: "Unread Alerts", value: unreadCount, icon: Bell },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
          >
            <div className="w-10 h-10 bg-[#25A05F]/10 rounded-xl flex items-center justify-center mb-2">
              <card.icon size={18} className="text-[#25A05F]" />
            </div>
            <p className="text-2xl text-[#0E3442]" style={{ fontWeight: 700 }}>
              {card.value}
            </p>
            <p className="text-xs text-gray-400">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <h3 className="text-[#0E3442]" style={{ fontWeight: 700 }}>
            Latest Donations
          </h3>
          <button
            onClick={onOpenDonations}
            className="text-sm text-[#25A05F]"
            style={{ fontWeight: 600 }}
          >
            Open Donations
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {pendingDonations.slice(0, 5).map((donation) => (
            <div
              key={donation._id}
              className="px-5 py-3 text-sm flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-[#0E3442]" style={{ fontWeight: 600 }}>
                  {donation.mealTitle} x{donation.quantity}
                </p>
                <p className="text-gray-500 text-xs">
                  {donation.branchName} •{" "}
                  {formatDateTime(
                    donation.scheduledPickupAt || donation.createdAt,
                  )}
                </p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs ${statusColor(donation.status)}`}
                style={{ fontWeight: 600 }}
              >
                {donation.status.replace("_", " ")}
              </span>
            </div>
          ))}
          {pendingDonations.length === 0 && (
            <p className="px-5 py-6 text-sm text-gray-500">
              No pending donations.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
