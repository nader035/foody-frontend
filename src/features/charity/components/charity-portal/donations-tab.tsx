import type { DonationView } from "./types";
import { nextStatusAction, statusColor } from "./utils";

interface DonationsTabProps {
  pendingDonations: DonationView[];
  updatingId: string | null;
  onStatusUpdate: (
    donationId: string,
    status: "confirmed" | "picked_up" | "completed",
  ) => void;
}

export function DonationsTab({
  pendingDonations,
  updatingId,
  onStatusUpdate,
}: DonationsTabProps) {
  return (
    <div className="space-y-3 max-w-4xl">
      {pendingDonations.map((donation) => {
        const action = nextStatusAction(donation.status);
        return (
          <div
            key={donation._id}
            className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
          >
            <div className="flex justify-between gap-4">
              <div>
                <p className="text-[#0E3442]" style={{ fontWeight: 700 }}>
                  {donation.mealTitle}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {donation.branchName} • Qty {donation.quantity}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Pickup Code: {donation.pickupCode || "N/A"}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs ${statusColor(donation.status)}`}
                  style={{ fontWeight: 600 }}
                >
                  {donation.status.replace("_", " ")}
                </span>
                {action && (
                  <button
                    onClick={() => onStatusUpdate(donation._id, action.value)}
                    disabled={updatingId === donation._id}
                    className="block mt-3 bg-[#25A05F] hover:bg-[#1e8a4f] disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm"
                    style={{ fontWeight: 600 }}
                  >
                    {updatingId === donation._id ? "Updating..." : action.label}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {pendingDonations.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 text-sm text-gray-500 shadow-sm">
          No active donations to process.
        </div>
      )}
    </div>
  );
}
