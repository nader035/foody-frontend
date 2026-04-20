interface SettingsTabProps {
  emailNotif: boolean;
  smsNotif: boolean;
  autoRefresh: boolean;
  onEmailNotifChange: (value: boolean) => void;
  onSmsNotifChange: (value: boolean) => void;
  onAutoRefreshChange: (value: boolean) => void;
}

interface ToggleSetting {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

export function SettingsTab({
  emailNotif,
  smsNotif,
  autoRefresh,
  onEmailNotifChange,
  onSmsNotifChange,
  onAutoRefreshChange,
}: SettingsTabProps) {
  const settings: ToggleSetting[] = [
    {
      label: "Email notifications",
      value: emailNotif,
      onChange: onEmailNotifChange,
    },
    {
      label: "SMS notifications",
      value: smsNotif,
      onChange: onSmsNotifChange,
    },
    {
      label: "Auto-refresh every 30s",
      value: autoRefresh,
      onChange: onAutoRefreshChange,
    },
  ];

  return (
    <div className="max-w-2xl bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
      <h3 className="text-[#0E3442]" style={{ fontWeight: 700 }}>
        Notification Settings
      </h3>
      {settings.map((setting) => (
        <div
          key={setting.label}
          className="flex items-center justify-between border-b border-gray-100 pb-3"
        >
          <p className="text-sm text-gray-600">{setting.label}</p>
          <button
            onClick={() => setting.onChange(!setting.value)}
            className={`h-6 w-11 rounded-full p-0.5 ${
              setting.value ? "bg-[#25A05F]" : "bg-gray-200"
            }`}
          >
            <span
              className={`block h-5 w-5 rounded-full bg-white transition-transform ${
                setting.value ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );
}
