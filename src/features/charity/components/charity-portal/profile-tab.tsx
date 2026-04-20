interface ProfileTabProps {
  fullName: string;
  phone: string;
  organizationName: string;
  organizationAddress: string;
  organizationWebsite: string;
  onFullNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  onOrganizationNameChange: (value: string) => void;
  onOrganizationAddressChange: (value: string) => void;
  onOrganizationWebsiteChange: (value: string) => void;
  onSaveProfile: () => void;
}

export function ProfileTab({
  fullName,
  phone,
  organizationName,
  organizationAddress,
  organizationWebsite,
  onFullNameChange,
  onPhoneChange,
  onOrganizationNameChange,
  onOrganizationAddressChange,
  onOrganizationWebsiteChange,
  onSaveProfile,
}: ProfileTabProps) {
  return (
    <div className="max-w-3xl bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
      <h3 className="text-[#0E3442] mb-4" style={{ fontWeight: 700 }}>
        Organization Profile
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          value={fullName}
          onChange={(e) => onFullNameChange(e.target.value)}
          placeholder="Contact Name"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
        />
        <input
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="Phone"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
        />
        <input
          value={organizationName}
          onChange={(e) => onOrganizationNameChange(e.target.value)}
          placeholder="Organization Name"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
        />
        <input
          value={organizationWebsite}
          onChange={(e) => onOrganizationWebsiteChange(e.target.value)}
          placeholder="Organization Website"
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
        />
        <textarea
          value={organizationAddress}
          onChange={(e) => onOrganizationAddressChange(e.target.value)}
          placeholder="Organization Address"
          className="md:col-span-2 w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F] resize-none"
          rows={3}
        />
      </div>
      <button
        onClick={onSaveProfile}
        className="mt-4 bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-5 py-2.5 rounded-xl text-sm"
        style={{ fontWeight: 600 }}
      >
        Save Profile
      </button>
    </div>
  );
}
