"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiListDonations,
  apiListUsers,
  apiRegister,
  type CharityUser,
  type Donation,
} from "@/features/manager/api";

export interface CharityView extends CharityUser {
  totalReceived: number;
  pendingDonations: number;
  lastUpdate?: string;
}

export interface NewCharityDraft {
  fullName: string;
  email: string;
  phone: string;
  organizationName: string;
  organizationAddress: string;
  organizationWebsite: string;
  password: string;
}

const managerCharitiesQueryKeys = {
  users: ["manager", "charities", "users"] as const,
  donations: ["manager", "charities", "donations"] as const,
};

function generateSecurePassword(length = 14) {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  const allChars = `${lowercase}${uppercase}${numbers}${symbols}`;

  const randomByte = () => {
    if (
      typeof crypto !== "undefined" &&
      typeof crypto.getRandomValues === "function"
    ) {
      const bytes = new Uint8Array(1);
      crypto.getRandomValues(bytes);
      return bytes[0];
    }

    return Math.floor(Math.random() * 256);
  };

  const pick = (charset: string) => charset[randomByte() % charset.length];

  const passwordChars = [
    pick(lowercase),
    pick(uppercase),
    pick(numbers),
    pick(symbols),
  ];

  while (passwordChars.length < Math.max(length, 8)) {
    passwordChars.push(pick(allChars));
  }

  for (let i = passwordChars.length - 1; i > 0; i -= 1) {
    const j = randomByte() % (i + 1);
    [passwordChars[i], passwordChars[j]] = [passwordChars[j], passwordChars[i]];
  }

  return passwordChars.join("");
}

function createNewCharityDraft(): NewCharityDraft {
  return {
    fullName: "",
    email: "",
    phone: "",
    organizationName: "",
    organizationAddress: "",
    organizationWebsite: "",
    password: generateSecurePassword(),
  };
}

function formatDate(value?: string) {
  if (!value) {
    return "No activity";
  }
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function useManagerCharities() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedCharityId, setSelectedCharityId] = useState<string | null>(
    null,
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCharity, setNewCharity] = useState<NewCharityDraft>(
    createNewCharityDraft,
  );

  const usersQuery = useQuery({
    queryKey: managerCharitiesQueryKeys.users,
    queryFn: () => apiListUsers("charity"),
  });

  const donationsQuery = useQuery({
    queryKey: managerCharitiesQueryKeys.donations,
    queryFn: () =>
      apiListDonations({
        limit: 100,
        sortBy: "createdAt",
        sortDirection: "desc",
      }),
  });

  const createCharityMutation = useMutation({
    mutationFn: apiRegister,
    onSuccess: async () => {
      setShowAddModal(false);
      setNewCharity(createNewCharityDraft());
      setSuccessMessage("Charity partner created successfully");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: managerCharitiesQueryKeys.users,
        }),
        queryClient.invalidateQueries({
          queryKey: managerCharitiesQueryKeys.donations,
        }),
      ]);

      setTimeout(() => setSuccessMessage(""), 2000);
    },
  });

  const charities = useMemo<CharityView[]>(() => {
    const users = usersQuery.data ?? [];
    const donationItems = donationsQuery.data?.items ?? [];

    const donationByCharity = new Map<string, Donation[]>();
    donationItems.forEach((donation) => {
      const current = donationByCharity.get(donation.charityId) || [];
      current.push(donation);
      donationByCharity.set(donation.charityId, current);
    });

    return users.map((charity) => {
      const charityDonations = donationByCharity.get(charity._id) || [];
      return {
        ...charity,
        totalReceived: charityDonations
          .filter((donation) => donation.status === "completed")
          .reduce((sum, donation) => sum + donation.quantity, 0),
        pendingDonations: charityDonations.filter((donation) =>
          ["matched", "confirmed", "picked_up"].includes(donation.status),
        ).length,
        lastUpdate: charityDonations[0]?.updatedAt,
      };
    });
  }, [usersQuery.data, donationsQuery.data]);

  const donations = useMemo(
    () => donationsQuery.data?.items ?? [],
    [donationsQuery.data?.items],
  );

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) {
      return charities;
    }

    return charities.filter((charity) =>
      [
        charity.fullName,
        charity.organizationName,
        charity.email,
        charity.organizationAddress,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [charities, search]);

  const activeCharityId =
    selectedCharityId &&
    charities.some((charity) => charity._id === selectedCharityId)
      ? selectedCharityId
      : (charities[0]?._id ?? null);

  const selectedCharity =
    charities.find((charity) => charity._id === activeCharityId) || null;

  const selectedHistory = useMemo(
    () =>
      donations
        .filter((donation) => donation.charityId === activeCharityId)
        .slice(0, 6),
    [donations, activeCharityId],
  );

  const stats = useMemo(() => {
    const active = charities.length;
    const totalMeals = charities.reduce(
      (sum, charity) => sum + charity.totalReceived,
      0,
    );
    const pending = charities.reduce(
      (sum, charity) => sum + charity.pendingDonations,
      0,
    );

    return {
      active,
      totalMeals,
      pending,
    };
  }, [charities]);

  const loadError = usersQuery.error || donationsQuery.error;
  const displayError =
    errorMessage ||
    (loadError instanceof Error ? loadError.message : "") ||
    (createCharityMutation.error instanceof Error
      ? createCharityMutation.error.message
      : "");

  async function submitCreateCharity() {
    if (
      !newCharity.fullName ||
      !newCharity.email ||
      !newCharity.organizationName ||
      !newCharity.organizationAddress ||
      !newCharity.password
    ) {
      setErrorMessage("Please complete required fields");
      return;
    }

    try {
      setErrorMessage("");
      setSuccessMessage("");

      await createCharityMutation.mutateAsync({
        fullName: newCharity.fullName,
        email: newCharity.email,
        password: newCharity.password,
        role: "charity",
        phone: newCharity.phone || undefined,
        organizationName: newCharity.organizationName,
        organizationAddress: newCharity.organizationAddress,
        organizationWebsite: newCharity.organizationWebsite || undefined,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create charity",
      );
    }
  }

  function openAddModal() {
    setErrorMessage("");
    setNewCharity(createNewCharityDraft());
    setShowAddModal(true);
  }

  function closeAddModal() {
    setShowAddModal(false);
  }

  function updateNewCharityField(field: keyof NewCharityDraft, value: string) {
    setNewCharity((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function regeneratePassword() {
    setNewCharity((current) => ({
      ...current,
      password: generateSecurePassword(),
    }));
  }

  return {
    isLoading: usersQuery.isLoading || donationsQuery.isLoading,
    isCreating: createCharityMutation.isPending,
    search,
    setSearch,
    displayError,
    successMessage,
    showAddModal,
    openAddModal,
    closeAddModal,
    filtered,
    stats,
    selectedCharity,
    selectedHistory,
    selectedCharityId: activeCharityId,
    setSelectedCharityId,
    newCharity,
    updateNewCharityField,
    regeneratePassword,
    submitCreateCharity,
    formatDate,
  };
}
