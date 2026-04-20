import type { NotificationItem } from "./types";

interface NotificationsTabProps {
  notifications: NotificationItem[];
}

export function NotificationsTab({ notifications }: NotificationsTabProps) {
  return (
    <div className="space-y-3 max-w-3xl">
      {notifications.map((item) => (
        <div
          key={item.id}
          className={`bg-white rounded-xl border p-4 shadow-sm ${
            item.unread
              ? "border-[#25A05F]/40 bg-[#25A05F]/5"
              : "border-gray-100"
          }`}
        >
          <p
            className="text-sm text-[#0E3442]"
            style={{ fontWeight: item.unread ? 600 : 500 }}
          >
            {item.text}
          </p>
          <p className="text-xs text-gray-400 mt-1">{item.time}</p>
        </div>
      ))}
      {notifications.length === 0 && (
        <p className="text-sm text-gray-500">No notifications.</p>
      )}
    </div>
  );
}
