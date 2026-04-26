"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  apiGetMe,
  apiListBranches,
  apiListDonations,
  apiListMeals,
  apiUpdateDonationStatus,
  apiUpdateMe,
  type Branch,
  type SurplusMeal,
  type UserProfile,
} from "@/features/charity/api";
import { getAuthUser } from "@/platform/auth/session.client";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { DashboardTab } from "./charity-portal/dashboard-tab";
import { DonationsTab } from "./charity-portal/donations-tab";
import { HistoryTab } from "./charity-portal/history-tab";
import { NotificationsTab } from "./charity-portal/notifications-tab";
import { PortalAlerts } from "./charity-portal/portal-alerts";
import { PortalSidebar } from "./charity-portal/portal-sidebar";
import { ProfileTab } from "./charity-portal/profile-tab";
import { SettingsTab } from "./charity-portal/settings-tab";
import type { DonationView, Tab } from "./charity-portal/types";
import { formatDateTime } from "./charity-portal/utils";

export function CharityPortal() {
  const navigate = useRouter();

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
  const [organizationWebsite, setOrganizationWebsite] = useState("");

  const [donations, setDonations] = useState<DonationView[]>([]);
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [me, donationResult, mealResult, branchResult] = await Promise.all([
        apiGetMe(),
        apiListDonations({
          limit: 100,
          sortBy: "createdAt",
          sortDirection: "desc",
        }),
        apiListMeals({
          limit: 100,
          sortBy: "createdAt",
          sortDirection: "desc",
        }),
        apiListBranches({
          limit: 100,
          sortBy: "createdAt",
          sortDirection: "desc",
        }),
      ]);

      const mealMap = new Map<string, SurplusMeal>(
        mealResult.items.map((meal) => [meal._id, meal]),
      );
      const branchMap = new Map<string, Branch>(
        branchResult.items.map((branch) => [branch._id, branch]),
      );

      const enriched = donationResult.items.map((donation) => ({
        ...donation,
        mealTitle: mealMap.get(donation.mealId)?.title || "Meal",
        branchName: branchMap.get(donation.branchId)?.name || "Branch",
      }));

      setProfile(me);
      setFullName(me.fullName || "");
      setPhone(me.phone || "");
      setOrganizationName(me.organizationName || "");
      setOrganizationAddress(me.organizationAddress || "");
      setOrganizationWebsite(me.organizationWebsite || "");
      setDonations(enriched);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load charity data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!getAuthUser()) {
      navigate.push("/auth");
      return;
    }

    loadData();
  }, [loadData, navigate]);

  useEffect(() => {
    if (!autoRefresh) {
      return;
    }

    const timer = window.setInterval(() => {
      loadData();
    }, 30000);

    return () => window.clearInterval(timer);
  }, [autoRefresh, loadData]);

  const pendingDonations = useMemo(
    () =>
      donations.filter((donation) =>
        ["matched", "confirmed", "picked_up"].includes(donation.status),
      ),
    [donations],
  );

  const completedDonations = useMemo(
    () =>
      donations.filter((donation) =>
        ["completed", "cancelled", "no_show"].includes(donation.status),
      ),
    [donations],
  );

  const totalReceivedMeals = useMemo(
    () =>
      donations
        .filter((donation) => donation.status === "completed")
        .reduce((sum, donation) => sum + donation.quantity, 0),
    [donations],
  );

  const notifications = useMemo(
    () =>
      donations.slice(0, 8).map((donation) => ({
        id: donation._id,
        text: `${donation.quantity} ${donation.mealTitle} from ${donation.branchName} is ${donation.status.replace("_", " ")}`,
        time: formatDateTime(donation.updatedAt),
        unread: ["matched", "confirmed"].includes(donation.status),
      })),
    [donations],
  );

  async function handleStatusUpdate(
    donationId: string,
    status: "confirmed" | "picked_up" | "completed",
  ) {
    try {
      setUpdatingId(donationId);
      setErrorMessage("");
      setSuccessMessage("");
      await apiUpdateDonationStatus(donationId, { status });
      setSuccessMessage("Donation status updated");
      await loadData();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update donation",
      );
    } finally {
      setUpdatingId(null);
      setTimeout(() => setSuccessMessage(""), 1800);
    }
  }

  async function handleSaveProfile() {
    try {
      setErrorMessage("");
      setSuccessMessage("");
      const updated = await apiUpdateMe({
        fullName,
        phone: phone || undefined,
        organizationName: organizationName || undefined,
        organizationAddress: organizationAddress || undefined,
        organizationWebsite: organizationWebsite || undefined,
      });
      setProfile(updated);
      setSuccessMessage("Profile saved");
      setTimeout(() => setSuccessMessage(""), 1800);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to save profile",
      );
    }
  }

  const logout = useLogout();

  function handleSignOut() {
    logout.mutate();
  }

  const unreadCount = notifications.filter(
    (notification) => notification.unread,
  ).length;

  if (loading) {
    return (
      <div
        className="min-h-screen bg-[#F5F7FA] flex items-center justify-center"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <p className="text-sm text-gray-500">Loading charity portal...</p>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen bg-[#F5F7FA]"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      <PortalSidebar
        activeTab={activeTab}
        pendingDonationsCount={pendingDonations.length}
        unreadCount={unreadCount}
        organizationName={profile?.organizationName || undefined}
        onTabChange={setActiveTab}
        onHome={() => navigate.push("/")}
        onLogout={handleSignOut}
      />

      <main className="flex-1 p-6">
        <PortalAlerts
          errorMessage={errorMessage}
          successMessage={successMessage}
        />

        {activeTab === "dashboard" && (
          <DashboardTab
            pendingDonations={pendingDonations}
            completedDonations={completedDonations}
            totalReceivedMeals={totalReceivedMeals}
            unreadCount={unreadCount}
            onOpenDonations={() => setActiveTab("donations")}
          />
        )}

        {activeTab === "donations" && (
          <DonationsTab
            pendingDonations={pendingDonations}
            updatingId={updatingId}
            onStatusUpdate={handleStatusUpdate}
          />
        )}

        {activeTab === "history" && (
          <HistoryTab completedDonations={completedDonations} />
        )}

        {activeTab === "notifications" && (
          <NotificationsTab notifications={notifications} />
        )}

        {activeTab === "profile" && (
          <ProfileTab
            fullName={fullName}
            phone={phone}
            organizationName={organizationName}
            organizationAddress={organizationAddress}
            organizationWebsite={organizationWebsite}
            onFullNameChange={setFullName}
            onPhoneChange={setPhone}
            onOrganizationNameChange={setOrganizationName}
            onOrganizationAddressChange={setOrganizationAddress}
            onOrganizationWebsiteChange={setOrganizationWebsite}
            onSaveProfile={handleSaveProfile}
          />
        )}

        {activeTab === "settings" && (
          <SettingsTab
            emailNotif={emailNotif}
            smsNotif={smsNotif}
            autoRefresh={autoRefresh}
            onEmailNotifChange={setEmailNotif}
            onSmsNotifChange={setSmsNotif}
            onAutoRefreshChange={setAutoRefresh}
          />
        )}
      </main>
    </div>
  );
}
