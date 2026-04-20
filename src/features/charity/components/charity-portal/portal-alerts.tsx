import { AlertTriangle, Check } from "lucide-react";

interface PortalAlertsProps {
  errorMessage: string;
  successMessage: string;
}

export function PortalAlerts({
  errorMessage,
  successMessage,
}: PortalAlertsProps) {
  return (
    <>
      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle size={14} /> {errorMessage}
        </div>
      )}
      {successMessage && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
          <Check size={14} /> {successMessage}
        </div>
      )}
    </>
  );
}
