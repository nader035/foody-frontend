import type { DonationView } from "./types";
import { formatDateTime, statusColor } from "./utils";

interface HistoryTabProps {
  completedDonations: DonationView[];
}

export function HistoryTab({ completedDonations }: HistoryTabProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#F5F7FA] border-b border-gray-100">
            <th
              className="text-left text-gray-500 px-5 py-3"
              style={{ fontWeight: 600 }}
            >
              Meal
            </th>
            <th
              className="text-left text-gray-500 px-5 py-3"
              style={{ fontWeight: 600 }}
            >
              Branch
            </th>
            <th
              className="text-right text-gray-500 px-5 py-3"
              style={{ fontWeight: 600 }}
            >
              Qty
            </th>
            <th
              className="text-right text-gray-500 px-5 py-3"
              style={{ fontWeight: 600 }}
            >
              Updated
            </th>
            <th
              className="text-right text-gray-500 px-5 py-3"
              style={{ fontWeight: 600 }}
            >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {completedDonations.map((donation) => (
            <tr key={donation._id} className="border-b border-gray-50">
              <td
                className="px-5 py-3 text-[#0E3442]"
                style={{ fontWeight: 600 }}
              >
                {donation.mealTitle}
              </td>
              <td className="px-5 py-3 text-gray-500">{donation.branchName}</td>
              <td className="px-5 py-3 text-right">{donation.quantity}</td>
              <td className="px-5 py-3 text-right text-gray-400">
                {formatDateTime(donation.updatedAt)}
              </td>
              <td className="px-5 py-3 text-right">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs ${statusColor(donation.status)}`}
                  style={{ fontWeight: 600 }}
                >
                  {donation.status.replace("_", " ")}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {completedDonations.length === 0 && (
        <p className="px-5 py-6 text-sm text-gray-500">
          No donation history yet.
        </p>
      )}
    </div>
  );
}
