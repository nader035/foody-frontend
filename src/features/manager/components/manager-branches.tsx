"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  MapPin,
  Phone,
  Building2,
  X,
  Check,
  AlertTriangle,
} from "lucide-react";
import {
  apiCreateBranch,
  apiListBranches,
  type Branch,
} from "@/features/manager/api";

export function ManagerBranches() {
  const [search, setSearch] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createdName, setCreatedName] = useState("");

  const [newBranch, setNewBranch] = useState({
    name: "",
    code: "",
    line1: "",
    city: "",
    area: "",
    country: "Egypt",
    contactPhone: "",
  });

  async function loadBranches() {
    try {
      setLoading(true);
      setErrorMessage("");
      const result = await apiListBranches({
        limit: 100,
        sortBy: "createdAt",
        sortDirection: "desc",
      });
      setBranches(result.items);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load branches",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBranches();
  }, []);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) {
      return branches;
    }

    return branches.filter((branch) => {
      const byName = branch.name.toLowerCase().includes(query);
      const byCode = (branch.code || "").toLowerCase().includes(query);
      const byAddress = [
        branch.address?.line1,
        branch.address?.city,
        branch.address?.area,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);

      return byName || byCode || byAddress;
    });
  }, [branches, search]);

  async function handleCreateBranch() {
    if (!newBranch.name || !newBranch.line1 || !newBranch.city) {
      setErrorMessage("Name, street and city are required");
      return;
    }

    try {
      setSaving(true);
      setErrorMessage("");

      const created = await apiCreateBranch({
        name: newBranch.name,
        code: newBranch.code || undefined,
        contactPhone: newBranch.contactPhone || undefined,
        address: {
          line1: newBranch.line1,
          city: newBranch.city,
          area: newBranch.area || undefined,
          country: newBranch.country || "Egypt",
        },
      });

      setCreatedName(created.name);
      setShowAddModal(false);
      setNewBranch({
        name: "",
        code: "",
        line1: "",
        city: "",
        area: "",
        country: "Egypt",
        contactPhone: "",
      });

      await loadBranches();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create branch",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#0E3442] text-2xl" style={{ fontWeight: 700 }}>
            Branches
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage branches from live backend data
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors shadow-sm"
          style={{ fontWeight: 600 }}
        >
          <Plus size={16} /> Add Branch
        </button>
      </div>

      <div className="relative max-w-sm mb-6">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search branches..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] shadow-sm"
        />
      </div>

      {errorMessage && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
          <AlertTriangle size={14} /> {errorMessage}
        </div>
      )}

      {createdName && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
          <Check size={14} /> Branch {createdName} created successfully
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6 text-sm text-gray-500 shadow-sm">
          Loading branches...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-6 text-sm text-gray-500 shadow-sm">
          No branches found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((branch) => (
            <div
              key={branch._id}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-[#0E3442]" style={{ fontWeight: 600 }}>
                    {branch.name}
                  </h3>
                  {branch.code && (
                    <p className="text-gray-400 text-xs mt-1">
                      Code: {branch.code}
                    </p>
                  )}
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs ${
                    branch.isActive
                      ? "bg-[#25A05F]/10 text-[#25A05F]"
                      : "bg-gray-100 text-gray-400"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {branch.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-500">
                <p className="flex items-center gap-2">
                  <MapPin size={14} />
                  {branch.address?.line1 || "No address"}
                  {branch.address?.city ? `, ${branch.address.city}` : ""}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={14} /> {branch.contactPhone || "No phone"}
                </p>
                <p className="flex items-center gap-2">
                  <Building2 size={14} />
                  Donation {branch.settings?.donationSplitPercentage ?? 50}% |
                  Discount {branch.settings?.discountPercentage ?? 35}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
          onClick={() => setShowAddModal(false)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2
                className="text-[#0E3442] text-lg"
                style={{ fontWeight: 700 }}
              >
                Add New Branch
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <input
                value={newBranch.name}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, name: e.target.value })
                }
                placeholder="Branch Name *"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
              />
              <input
                value={newBranch.code}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, code: e.target.value })
                }
                placeholder="Code (optional)"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
              />
              <input
                value={newBranch.line1}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, line1: e.target.value })
                }
                placeholder="Street Address *"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={newBranch.city}
                  onChange={(e) =>
                    setNewBranch({ ...newBranch, city: e.target.value })
                  }
                  placeholder="City *"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
                />
                <input
                  value={newBranch.area}
                  onChange={(e) =>
                    setNewBranch({ ...newBranch, area: e.target.value })
                  }
                  placeholder="Area"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
                />
              </div>
              <input
                value={newBranch.contactPhone}
                onChange={(e) =>
                  setNewBranch({ ...newBranch, contactPhone: e.target.value })
                }
                placeholder="Phone"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#25A05F]"
              />
            </div>

            <div className="px-6 pb-6 flex justify-end">
              <button
                onClick={handleCreateBranch}
                disabled={saving}
                className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-6 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60"
                style={{ fontWeight: 600 }}
              >
                {saving ? "Creating..." : "Create Branch"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

