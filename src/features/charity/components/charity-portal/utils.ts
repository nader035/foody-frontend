export function formatDateTime(value?: string | null) {
  if (!value) {
    return "Not scheduled";
  }

  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function statusColor(status: string) {
  if (["completed", "picked_up"].includes(status)) {
    return "bg-[#25A05F]/10 text-[#25A05F]";
  }
  if (status === "cancelled" || status === "no_show") {
    return "bg-red-100 text-red-600";
  }
  return "bg-yellow-100 text-yellow-700";
}

export function nextStatusAction(status: string) {
  if (status === "matched") {
    return { label: "Confirm Pickup", value: "confirmed" as const };
  }
  if (status === "confirmed") {
    return { label: "Mark Picked Up", value: "picked_up" as const };
  }
  if (status === "picked_up") {
    return { label: "Mark Completed", value: "completed" as const };
  }
  return null;
}
