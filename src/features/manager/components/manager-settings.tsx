"use client";
import { useCallback, useEffect, useState } from "react";
import {
  Settings,
  Bell,
  Users,
  Palette,
  Globe,
  Save,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  AlertTriangle,
  Check,
  RefreshCw,
} from "lucide-react";
import {
  apiListBranches,
  apiUpdateBranch,
  apiGetMe,
  apiUpdateMe,
  type Branch,
  type UserProfile,
} from "@/lib/api-client";

export function ManagerSettings() {
  const [activeTab, setActiveTab] = useState("distribution");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Branch settings (applied to first branch or all branches)
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");

  // Distribution settings (from selected branch)
  const [donationPct, setDonationPct] = useState(30);
  const [discountPct, setDiscountPct] = useState(50);
  const [autoAssign, setAutoAssign] = useState(true);
  const [publicListing, setPublicListing] = useState(true);

  // Notification settings (local UI state — no backend endpoint for these yet)
  const [autoNotify, setAutoNotify] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  // Profile
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [restaurantName, setRestaurantName] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [branchResult, me] = await Promise.all([
        apiListBranches({ limit: 100, includeInactive: false }),
        apiGetMe(),
      ]);

      setBranches(branchResult.items);
      setProfile(me);
      setRestaurantName(me.restaurantName || "");

      const firstBranch = branchResult.items[0];
      if (firstBranch) {
        setSelectedBranchId(firstBranch._id);
        setDonationPct(firstBranch.settings?.donationSplitPercentage ?? 30);
        setDiscountPct(firstBranch.settings?.discountPercentage ?? 50);
        setAutoAssign(firstBranch.settings?.autoAssignToCharity ?? true);
        setPublicListing(firstBranch.settings?.publicListingEnabled ?? true);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load settings",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // When selected branch changes, update sliders
  useEffect(() => {
    const branch = branches.find((b) => b._id === selectedBranchId);
    if (branch) {
      setDonationPct(branch.settings?.donationSplitPercentage ?? 30);
      setDiscountPct(branch.settings?.discountPercentage ?? 50);
      setAutoAssign(branch.settings?.autoAssignToCharity ?? true);
      setPublicListing(branch.settings?.publicListingEnabled ?? true);
    }
  }, [selectedBranchId, branches]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      const updates: Promise<unknown>[] = [];

      // Save branch distribution settings
      if (selectedBranchId) {
        updates.push(
          apiUpdateBranch(selectedBranchId, {
            settings: {
              donationSplitPercentage: donationPct,
              discountPercentage: discountPct,
              autoAssignToCharity: autoAssign,
              publicListingEnabled: publicListing,
            },
          }),
        );
      }

      // Save profile restaurant name if changed
      if (profile && restaurantName !== profile.restaurantName) {
        updates.push(
          apiUpdateMe({ restaurantName: restaurantName || undefined }),
        );
      }

      await Promise.all(updates);

      // Refresh branches to get updated settings
      const branchResult = await apiListBranches({
        limit: 100,
        includeInactive: false,
      });
      setBranches(branchResult.items);

      setSaved(true);
      setSuccessMessage("Settings saved successfully");
      setTimeout(() => {
        setSaved(false);
        setSuccessMessage("");
      }, 3000);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to save settings",
      );
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "distribution", label: "Distribution", icon: Settings },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "team", label: "Team & Access", icon: Users },
    { id: "branding", label: "Branding", icon: Palette },
    { id: "general", label: "General", icon: Globe },
  ];

  const renderToggle = ({
    on,
    toggle,
  }: {
    on: boolean;
    toggle: () => void;
  }) => (
    <button onClick={toggle} className="shrink-0">
      {on ? (
        <ToggleRight size={28} className="text-[#25A05F]" />
      ) : (
        <ToggleLeft size={28} className="text-gray-300" />
      )}
    </button>
  );

  const selectedBranch = branches.find((b) => b._id === selectedBranchId);

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#0E3442] text-2xl" style={{ fontWeight: 700 }}>
            Settings
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Configure your Foody platform preferences
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="bg-white border border-gray-200 text-gray-500 px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:bg-gray-50 shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading}
            className={`px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-all shadow-sm disabled:opacity-60 ${saved ? "bg-[#25A05F]/10 text-[#25A05F]" : "bg-[#25A05F] hover:bg-[#1e8a4f] text-white"}`}
            style={{ fontWeight: 600 }}
          >
            {saving ? (
              <>
                <RefreshCw size={14} className="animate-spin" /> Saving...
              </>
            ) : saved ? (
              <>
                <Save size={14} /> Saved!
              </>
            ) : (
              <>
                <Save size={14} /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>

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

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="space-y-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all ${activeTab === t.id ? "bg-[#25A05F]/10 text-[#25A05F]" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"}`}
              style={{ fontWeight: activeTab === t.id ? 600 : 500 }}
            >
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </div>

        <div className="xl:col-span-3 space-y-6">
          {activeTab === "distribution" && (
            <>
              {/* Branch Selector */}
              {branches.length > 1 && (
                <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                  <h3
                    className="text-[#0E3442] mb-3"
                    style={{ fontWeight: 600 }}
                  >
                    Apply Settings To
                  </h3>
                  <select
                    value={selectedBranchId}
                    onChange={(e) => setSelectedBranchId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-[#0E3442] focus:outline-none focus:border-[#25A05F]"
                  >
                    {branches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                  {selectedBranch && (
                    <p className="text-gray-400 text-xs mt-2">
                      Current: Donation{" "}
                      {selectedBranch.settings?.donationSplitPercentage ?? 30}%
                      · Discount{" "}
                      {selectedBranch.settings?.discountPercentage ?? 50}%
                    </p>
                  )}
                </div>
              )}

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-[#0E3442] mb-1" style={{ fontWeight: 600 }}>
                  Surplus Distribution Rules
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Configure how surplus meals are split between donations and
                  discounted sales
                </p>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(2)].map((_, i) => (
                      <div
                        key={i}
                        className="h-16 bg-gray-100 animate-pulse rounded-xl"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {[
                      {
                        label: "Donation Percentage",
                        desc: "Portion of surplus allocated to charities",
                        val: donationPct,
                        set: setDonationPct,
                        min: 0,
                        max: 100,
                      },
                      {
                        label: "Discount Rate",
                        desc: "Discount applied to surplus meals for customers",
                        val: discountPct,
                        set: setDiscountPct,
                        min: 10,
                        max: 90,
                      },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span
                              className="text-[#0E3442] text-sm"
                              style={{ fontWeight: 600 }}
                            >
                              {s.label}
                            </span>
                            <p className="text-gray-400 text-xs mt-0.5">
                              {s.desc}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="relative">
                              <input
                                type="number"
                                min={s.min}
                                max={s.max}
                                value={s.val}
                                onChange={(e) => {
                                  const v = Math.max(
                                    s.min,
                                    Math.min(
                                      s.max,
                                      Number(e.target.value) || s.min,
                                    ),
                                  );
                                  s.set(v);
                                }}
                                className="w-16 bg-[#F5F7FA] border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-[#0E3442] text-center focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                style={{ fontWeight: 700 }}
                              />
                            </div>
                            <span
                              className="text-[#25A05F] text-sm"
                              style={{ fontWeight: 700 }}
                            >
                              %
                            </span>
                          </div>
                        </div>
                        <div className="relative pt-1 pb-1">
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#25A05F] to-[#1e8a4f] rounded-full transition-all duration-150"
                              style={{
                                width: `${((s.val - s.min) / (s.max - s.min)) * 100}%`,
                              }}
                            />
                          </div>
                          <input
                            type="range"
                            min={s.min}
                            max={s.max}
                            value={s.val}
                            onChange={(e) => s.set(Number(e.target.value))}
                            className="absolute inset-0 w-full opacity-0 cursor-pointer"
                            style={{ height: "16px", marginTop: "0px" }}
                          />
                          <div
                            className="absolute top-0 w-5 h-5 bg-white border-2 border-[#25A05F] rounded-full shadow-md pointer-events-none transition-all duration-150"
                            style={{
                              left: `calc(${((s.val - s.min) / (s.max - s.min)) * 100}% - 10px)`,
                              top: "-2px",
                            }}
                          />
                        </div>
                        <div className="flex justify-between mt-1.5">
                          <span
                            className="text-gray-300 text-[10px]"
                            style={{ fontWeight: 600 }}
                          >
                            {s.min}%
                          </span>
                          <span
                            className="text-gray-300 text-[10px]"
                            style={{ fontWeight: 600 }}
                          >
                            {s.max}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-6 p-5 bg-[#F5F7FA] rounded-xl">
                  <p
                    className="text-gray-400 text-xs mb-3"
                    style={{ fontWeight: 600 }}
                  >
                    DISTRIBUTION PREVIEW — 100 MEALS
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p
                        className="text-[#25A05F] text-2xl"
                        style={{ fontWeight: 700 }}
                      >
                        {donationPct}
                      </p>
                      <p className="text-gray-400 text-xs">Donated</p>
                    </div>
                    <div>
                      <p
                        className="text-[#0E3442] text-2xl"
                        style={{ fontWeight: 700 }}
                      >
                        {100 - donationPct}
                      </p>
                      <p className="text-gray-400 text-xs">
                        Discounted ({discountPct}% off)
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-gray-500 text-2xl"
                        style={{ fontWeight: 700 }}
                      >
                        $
                        {(
                          (100 - donationPct) *
                          10 *
                          (1 - discountPct / 100)
                        ).toFixed(0)}
                      </p>
                      <p className="text-gray-400 text-xs">Est. Revenue</p>
                    </div>
                  </div>
                  <div className="mt-3 h-3 bg-gray-200 rounded-full overflow-hidden flex">
                    <div
                      className="bg-[#25A05F] h-full"
                      style={{ width: `${donationPct}%` }}
                    />
                    <div
                      className="bg-[#155433] h-full"
                      style={{ width: `${100 - donationPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-[#0E3442] mb-1" style={{ fontWeight: 600 }}>
                  Automation
                </h3>
                <p className="text-gray-400 text-sm mb-5">
                  Configure automatic actions
                </p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p
                        className="text-[#0E3442] text-sm"
                        style={{ fontWeight: 600 }}
                      >
                        Auto-assign to nearest charity
                      </p>
                      <p className="text-gray-400 text-xs">
                        Automatically route donations to closest partner
                      </p>
                    </div>
                    {renderToggle({
                      on: autoAssign,
                      toggle: () => setAutoAssign(!autoAssign),
                    })}
                  </div>
                  <div className="flex items-center justify-between py-2 border-t border-gray-100">
                    <div>
                      <p
                        className="text-[#0E3442] text-sm"
                        style={{ fontWeight: 600 }}
                      >
                        Public listing for customers
                      </p>
                      <p className="text-gray-400 text-xs">
                        Show discounted meals on the customer marketplace
                      </p>
                    </div>
                    {renderToggle({
                      on: publicListing,
                      toggle: () => setPublicListing(!publicListing),
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-[#0E3442] mb-1" style={{ fontWeight: 600 }}>
                Notification Preferences
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Choose how and when you receive alerts
              </p>
              <div className="space-y-4">
                {[
                  {
                    label: "Auto-notify charities",
                    desc: "Send automatic alerts when new surplus is logged",
                    on: autoNotify,
                    toggle: () => setAutoNotify(!autoNotify),
                  },
                  {
                    label: "Email alerts",
                    desc: "Receive daily summary and important alerts via email",
                    on: emailAlerts,
                    toggle: () => setEmailAlerts(!emailAlerts),
                  },
                  {
                    label: "SMS alerts",
                    desc: "Get text notifications for urgent items",
                    on: smsAlerts,
                    toggle: () => setSmsAlerts(!smsAlerts),
                  },
                ].map((n) => (
                  <div
                    key={n.label}
                    className="flex items-center justify-between py-3 border-b border-gray-100"
                  >
                    <div>
                      <p
                        className="text-[#0E3442] text-sm"
                        style={{ fontWeight: 600 }}
                      >
                        {n.label}
                      </p>
                      <p className="text-gray-400 text-xs">{n.desc}</p>
                    </div>
                    {renderToggle({ on: n.on, toggle: n.toggle })}
                  </div>
                ))}
              </div>
              <div className="mt-6 bg-[#F5F7FA] rounded-xl p-4">
                <p
                  className="text-gray-500 text-sm"
                  style={{ fontWeight: 600 }}
                >
                  Notification schedule
                </p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-gray-400 text-xs block mb-1">
                      Daily summary time
                    </label>
                    <input
                      type="time"
                      defaultValue="08:00"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#25A05F]"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-xs block mb-1">
                      Quiet hours start
                    </label>
                    <input
                      type="time"
                      defaultValue="23:00"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-[#25A05F]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "team" && (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-[#0E3442]" style={{ fontWeight: 600 }}>
                    Team Members
                  </h3>
                  <p className="text-gray-400 text-sm mt-0.5">
                    Manage who has access to the manager portal
                  </p>
                </div>
                <button
                  className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-colors shadow-sm"
                  style={{ fontWeight: 600 }}
                >
                  <Users size={14} /> Invite Member
                </button>
              </div>
              {profile && (
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full bg-[#25A05F]/10 flex items-center justify-center text-[#25A05F] text-xs"
                      style={{ fontWeight: 700 }}
                    >
                      {profile.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p
                        className="text-[#0E3442] text-sm"
                        style={{ fontWeight: 600 }}
                      >
                        {profile.fullName}
                      </p>
                      <p className="text-gray-400 text-xs">{profile.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="bg-[#25A05F]/10 text-[#25A05F] px-2.5 py-0.5 rounded-full text-xs"
                      style={{ fontWeight: 600 }}
                    >
                      Owner
                    </span>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "branding" && (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-[#0E3442] mb-1" style={{ fontWeight: 600 }}>
                Brand Customization
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                Customize the appearance of your Foody portal
              </p>
              <div className="space-y-5">
                <div>
                  <label className="text-gray-500 text-sm block mb-2">
                    Restaurant / Brand Name
                  </label>
                  <input
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    placeholder="Your restaurant name"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#25A05F]"
                  />
                </div>
                <div>
                  <label className="text-gray-500 text-sm block mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#25A05F] border-2 border-gray-200" />
                    <input
                      defaultValue="#25A05F"
                      className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#25A05F] w-32"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-gray-500 text-sm block mb-2">
                    Logo Upload
                  </label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#25A05F]/40 transition-colors cursor-pointer">
                    <Palette size={24} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-400 text-sm">
                      Drop your logo here or click to upload
                    </p>
                    <p className="text-gray-300 text-xs mt-1">
                      PNG, SVG — Max 2MB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="text-[#0E3442] mb-1" style={{ fontWeight: 600 }}>
                  General Settings
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Basic platform configuration
                </p>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-500 text-sm block mb-2">
                        Timezone
                      </label>
                      <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#25A05F]">
                        <option>UTC+2 (Egypt Standard)</option>
                        <option>UTC+3 (Arabia)</option>
                        <option>UTC-5 (Eastern)</option>
                        <option>UTC (Greenwich)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-gray-500 text-sm block mb-2">
                        Currency
                      </label>
                      <select className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#25A05F]">
                        <option>EGP (Egyptian Pound)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-gray-500 text-sm block mb-2">
                      Default Expiry Window (hours)
                    </label>
                    <input
                      type="number"
                      defaultValue={4}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#25A05F] max-w-xs"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                <h3 className="text-red-500 mb-1" style={{ fontWeight: 600 }}>
                  Danger Zone
                </h3>
                <p className="text-red-400 text-sm mb-4">
                  Irreversible actions that affect your account
                </p>
                <div className="flex gap-3">
                  <button
                    className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl text-sm transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    Reset All Data
                  </button>
                  <button
                    className="bg-red-100 hover:bg-red-200 text-red-500 px-4 py-2 rounded-xl text-sm transition-colors"
                    style={{ fontWeight: 600 }}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
