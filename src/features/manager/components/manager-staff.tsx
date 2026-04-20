"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Users,
  Search,
  Plus,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Shield,
  Eye,
  EyeOff,
  UserCheck,
  UserX,
  MoreHorizontal,
  Filter,
  Building2,
  Clock,
  Key,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import {
  apiListUsers,
  apiListBranches,
  apiCreateStaff,
  apiUpdateUserStatus,
  type CharityUser,
  type Branch,
} from "@/lib/api-client";

// Staff is a "staff" role user in the backend
type StaffStatus = "Active" | "Inactive";

interface StaffMember extends CharityUser {
  status: StaffStatus;
  branchName: string;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs ${
        status === "Active"
          ? "bg-[#25A05F]/10 text-[#25A05F]"
          : "bg-gray-100 text-gray-400"
      }`}
      style={{ fontWeight: 600 }}
    >
      {status}
    </span>
  );
}

function InputField({
  icon: Icon,
  label,
  required,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  icon: React.ElementType;
  label: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        className="text-gray-600 text-sm block mb-1.5"
        style={{ fontWeight: 600 }}
      >
        {label}
        {required && " *"}
      </label>
      <div className="relative">
        <Icon
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          {...props}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#0E3442] focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10"
        />
      </div>
    </div>
  );
}

export function ManagerStaff() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [search, setSearch] = useState("");
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState<StaffMember | null>(null);
  const [addStep, setAddStep] = useState(1);
  const [addSuccess, setAddSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    branchId: "",
    tempPassword: "",
    sendInvite: true,
  });
  const [showPassword, setShowPassword] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [users, branchResult] = await Promise.all([
        apiListUsers("staff"),
        apiListBranches({ limit: 100, includeInactive: false }),
      ]);

      setBranches(branchResult.items);

      const enriched: StaffMember[] = users.map((user) => ({
        ...user,
        status: user.isActive === false ? "Inactive" : "Active",
        branchName: user.branchName || "Unassigned",
      }));

      setStaff(enriched);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to load staff",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filtered = useMemo(() => {
    return staff.filter((s) => {
      const matchSearch =
        s.fullName.toLowerCase().includes(search.toLowerCase()) ||
        s.email.toLowerCase().includes(search.toLowerCase()) ||
        (s.branchName || "").toLowerCase().includes(search.toLowerCase());
      const matchBranch =
        filterBranch === "All" || s.branchName === filterBranch;
      const matchStatus = filterStatus === "All" || s.status === filterStatus;
      return matchSearch && matchBranch && matchStatus;
    });
  }, [staff, search, filterBranch, filterStatus]);

  const canProceedStep1 =
    newStaff.firstName &&
    newStaff.lastName &&
    newStaff.email &&
    newStaff.tempPassword;
  const canProceedStep2 = !!newStaff.branchId;

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$";
    let pw = "";
    for (let i = 0; i < 12; i++)
      pw += chars[Math.floor(Math.random() * chars.length)];
    setNewStaff({ ...newStaff, tempPassword: pw });
  };

  const resetAdd = () => {
    setNewStaff({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      branchId: branches[0]?._id || "",
      tempPassword: "",
      sendInvite: true,
    });
    setAddStep(1);
    setAddSuccess(false);
  };

  const handleAddSubmit = async () => {
    try {
      setSaving(true);
      setErrorMessage("");

      await apiCreateStaff({
        fullName: `${newStaff.firstName} ${newStaff.lastName}`,
        email: newStaff.email,
        password: newStaff.tempPassword,
        phone: newStaff.phone || undefined,
        branchId: newStaff.branchId,
        branchName: branches.find((b) => b._id === newStaff.branchId)?.name,
      });

      setAddSuccess(true);
      setSuccessMessage(
        `Staff member ${newStaff.firstName} ${newStaff.lastName} created`,
      );
      setTimeout(async () => {
        setShowAddModal(false);
        resetAdd();
        await loadData();
        setTimeout(() => setSuccessMessage(""), 3000);
      }, 2000);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to create staff member",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStaffStatus = async (member: StaffMember) => {
    try {
      setErrorMessage("");
      const nextIsActive = member.status !== "Active";
      await apiUpdateUserStatus(member._id, { isActive: nextIsActive });
      setSuccessMessage(
        `${member.fullName} is now ${nextIsActive ? "Active" : "Inactive"}`,
      );
      setMenuOpen(null);
      await loadData();
      setTimeout(() => setSuccessMessage(""), 2500);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to update staff status",
      );
    }
  };

  const activeCount = staff.filter((s) => s.status === "Active").length;
  const branchNames = [
    ...new Set(staff.map((s) => s.branchName).filter(Boolean)),
  ];

  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[#0E3442] text-2xl" style={{ fontWeight: 700 }}>
            Staff Accounts
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage branch staff accounts and roles
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="bg-white border border-gray-200 text-gray-500 px-3 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />{" "}
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors shadow-sm"
            style={{ fontWeight: 600 }}
          >
            <Plus size={16} /> Add Staff
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Staff",
            value: loading ? "—" : staff.length,
            icon: Users,
            color: "text-[#0E3442]",
          },
          {
            label: "Active",
            value: loading ? "—" : activeCount,
            icon: UserCheck,
            color: "text-[#25A05F]",
          },
          {
            label: "Branches",
            value: loading ? "—" : branchNames.length,
            icon: Building2,
            color: "text-amber-500",
          },
          {
            label: "Filtered Results",
            value: loading ? "—" : filtered.length,
            icon: Shield,
            color: "text-[#0E3442]",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-gray-500 text-xs" style={{ fontWeight: 600 }}>
                {s.label}
              </p>
              <s.icon size={16} className="text-gray-300" />
            </div>
            <p className={`text-2xl ${s.color}`} style={{ fontWeight: 700 }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search staff by name, email, branch..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] shadow-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`border px-3 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors shadow-sm ${showFilters ? "bg-[#25A05F]/10 border-[#25A05F]/30 text-[#25A05F]" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
          style={{ fontWeight: 500 }}
        >
          <Filter size={14} /> Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4 shadow-sm flex flex-wrap gap-4">
          <div>
            <label
              className="text-gray-500 text-xs block mb-1"
              style={{ fontWeight: 600 }}
            >
              Branch
            </label>
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0E3442] focus:outline-none focus:border-[#25A05F]"
            >
              <option>All</option>
              {branchNames.map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              className="text-gray-500 text-xs block mb-1"
              style={{ fontWeight: 600 }}
            >
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0E3442] focus:outline-none focus:border-[#25A05F]"
            >
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          {(filterBranch !== "All" || filterStatus !== "All") && (
            <button
              onClick={() => {
                setFilterBranch("All");
                setFilterStatus("All");
              }}
              className="self-end text-xs text-[#25A05F] hover:underline pb-2"
              style={{ fontWeight: 600 }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      <p className="text-gray-400 text-xs mb-3" style={{ fontWeight: 500 }}>
        {filtered.length} staff member{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-[#F5F7FA]">
                <th
                  className="text-left text-gray-500 px-5 py-3"
                  style={{ fontWeight: 600 }}
                >
                  Staff Member
                </th>
                <th
                  className="text-left text-gray-500 px-5 py-3"
                  style={{ fontWeight: 600 }}
                >
                  Branch
                </th>
                <th
                  className="text-left text-gray-500 px-5 py-3"
                  style={{ fontWeight: 600 }}
                >
                  Status
                </th>
                <th
                  className="text-left text-gray-500 px-5 py-3"
                  style={{ fontWeight: 600 }}
                >
                  Phone
                </th>
                <th
                  className="text-right text-gray-500 px-5 py-3"
                  style={{ fontWeight: 600 }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw size={16} className="animate-spin" /> Loading
                      staff...
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr
                    key={s._id}
                    className="border-b border-gray-50 hover:bg-[#F5F7FA]/50 transition-colors"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs shrink-0 bg-[#25A05F]"
                          style={{ fontWeight: 700 }}
                        >
                          {initials(s.fullName)}
                        </div>
                        <div>
                          <p
                            className="text-[#0E3442]"
                            style={{ fontWeight: 600 }}
                          >
                            {s.fullName}
                          </p>
                          <p className="text-gray-400 text-xs">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-600 text-xs">
                      <span className="flex items-center gap-1">
                        <Building2 size={12} className="text-gray-400" />{" "}
                        {s.branchName}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={s.status} />
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs">
                      {s.phone || "—"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="relative inline-block">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(menuOpen === s._id ? null : s._id);
                          }}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        {menuOpen === s._id && (
                          <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 w-44 z-20">
                            <button
                              onClick={() => {
                                setShowViewModal(s);
                                setMenuOpen(null);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Eye size={14} /> View Details
                            </button>
                            <button
                              onClick={() => handleToggleStaffStatus(s)}
                              className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"
                            >
                              {s.status === "Active" ? (
                                <>
                                  <UserX size={14} /> Mark Inactive
                                </>
                              ) : (
                                <>
                                  <UserCheck size={14} /> Mark Active
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-12 text-gray-400 text-sm"
                  >
                    No staff members found. Add staff using the button above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {menuOpen !== null && (
        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
      )}

      {/* View Modal */}
      {showViewModal && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
          onClick={() => setShowViewModal(null)}
        >
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg bg-[#25A05F]"
                  style={{ fontWeight: 700 }}
                >
                  {initials(showViewModal.fullName)}
                </div>
                <div>
                  <h2
                    className="text-[#0E3442] text-xl"
                    style={{ fontWeight: 700 }}
                  >
                    {showViewModal.fullName}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={showViewModal.status} />
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowViewModal(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail size={14} /> {showViewModal.email}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Phone size={14} /> {showViewModal.phone || "—"}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Building2 size={14} /> {showViewModal.branchName}
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Clock size={14} /> Joined{" "}
                  {new Date(showViewModal.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4"
          onClick={() => {
            setShowAddModal(false);
            resetAdd();
          }}
        >
          <div
            className="bg-white rounded-2xl border border-gray-100 shadow-xl w-full max-w-xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {addSuccess ? (
              <div className="p-10 text-center">
                <div className="w-16 h-16 bg-[#25A05F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-[#25A05F]" />
                </div>
                <h2
                  className="text-[#0E3442] text-xl mb-2"
                  style={{ fontWeight: 700 }}
                >
                  Staff Account Created!
                </h2>
                <p className="text-gray-500 text-sm">
                  &quot;{newStaff.firstName} {newStaff.lastName}&quot; has been
                  added as Staff.
                </p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <div>
                    <h2
                      className="text-[#0E3442] text-lg"
                      style={{ fontWeight: 700 }}
                    >
                      Add Staff Account
                    </h2>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Step {addStep} of 2
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetAdd();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Progress */}
                <div className="px-6 pt-4">
                  <div className="flex gap-2">
                    {[1, 2].map((s) => (
                      <div
                        key={s}
                        className={`flex-1 h-1.5 rounded-full ${s <= addStep ? "bg-[#25A05F]" : "bg-gray-200"}`}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {["Personal Info", "Branch"].map((label, i) => (
                      <span
                        key={label}
                        className={`text-[10px] ${i + 1 <= addStep ? "text-[#25A05F]" : "text-gray-400"}`}
                        style={{ fontWeight: 600 }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {errorMessage && (
                  <div className="mx-6 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center gap-2">
                    <AlertTriangle size={14} /> {errorMessage}
                  </div>
                )}

                <div className="p-6 space-y-5">
                  {addStep === 1 && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <InputField
                          icon={Users}
                          label="First Name"
                          required
                          placeholder="e.g. John"
                          value={newStaff.firstName}
                          onChange={(e) =>
                            setNewStaff({
                              ...newStaff,
                              firstName: e.target.value,
                            })
                          }
                        />
                        <InputField
                          icon={Users}
                          label="Last Name"
                          required
                          placeholder="e.g. Smith"
                          value={newStaff.lastName}
                          onChange={(e) =>
                            setNewStaff({
                              ...newStaff,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <InputField
                        icon={Mail}
                        label="Email Address"
                        required
                        placeholder="john.smith@foody.com"
                        type="email"
                        value={newStaff.email}
                        onChange={(e) =>
                          setNewStaff({ ...newStaff, email: e.target.value })
                        }
                      />
                      <InputField
                        icon={Phone}
                        label="Phone Number"
                        placeholder="+20 555-0000"
                        value={newStaff.phone}
                        onChange={(e) =>
                          setNewStaff({ ...newStaff, phone: e.target.value })
                        }
                      />
                      <div>
                        <label
                          className="text-gray-600 text-sm block mb-1.5"
                          style={{ fontWeight: 600 }}
                        >
                          Temporary Password *
                        </label>
                        <div className="relative">
                          <Key
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={newStaff.tempPassword}
                            onChange={(e) =>
                              setNewStaff({
                                ...newStaff,
                                tempPassword: e.target.value,
                              })
                            }
                            placeholder="Set a temporary password"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-20 py-2.5 text-sm text-[#0E3442] focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-gray-400 hover:text-gray-600 p-1"
                            >
                              {showPassword ? (
                                <EyeOff size={14} />
                              ) : (
                                <Eye size={14} />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={generatePassword}
                              className="text-[#25A05F] hover:text-[#1e8a4f] text-xs px-1.5 py-0.5 bg-[#25A05F]/10 rounded"
                              style={{ fontWeight: 600 }}
                            >
                              Gen
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {addStep === 2 && (
                    <>
                      <div>
                        <label
                          className="text-gray-600 text-sm block mb-1.5"
                          style={{ fontWeight: 600 }}
                        >
                          Assign to Branch *
                        </label>
                        <div className="relative">
                          <Building2
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <select
                            value={newStaff.branchId}
                            onChange={(e) =>
                              setNewStaff({
                                ...newStaff,
                                branchId: e.target.value,
                              })
                            }
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm text-[#0E3442] focus:outline-none focus:border-[#25A05F] appearance-none"
                          >
                            <option value="">Select a branch...</option>
                            {branches.map((b) => (
                              <option key={b._id} value={b._id}>
                                {b.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="bg-[#F5F7FA] rounded-xl p-4">
                        <p
                          className="text-gray-400 text-xs mb-1"
                          style={{ fontWeight: 600 }}
                        >
                          ACCOUNT SUMMARY
                        </p>
                        <p
                          className="text-[#0E3442]"
                          style={{ fontWeight: 700 }}
                        >
                          {newStaff.firstName} {newStaff.lastName}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5">
                          {newStaff.email} · Staff at{" "}
                          {branches.find((b) => b._id === newStaff.branchId)
                            ?.name || "—"}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <div className="px-6 pb-6 flex items-center justify-between">
                  {addStep > 1 ? (
                    <button
                      onClick={() => setAddStep(addStep - 1)}
                      className="flex items-center gap-1 text-gray-500 hover:text-gray-700 text-sm"
                      style={{ fontWeight: 600 }}
                    >
                      <ChevronLeft size={16} /> Back
                    </button>
                  ) : (
                    <div />
                  )}
                  {addStep < 2 ? (
                    <button
                      onClick={() => setAddStep(addStep + 1)}
                      disabled={!canProceedStep1}
                      className={`px-5 py-2.5 rounded-xl text-sm flex items-center gap-1 transition-all ${canProceedStep1 ? "bg-[#25A05F] hover:bg-[#1e8a4f] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                      style={{ fontWeight: 600 }}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={handleAddSubmit}
                      disabled={saving || !canProceedStep2}
                      className={`bg-[#25A05F] hover:bg-[#1e8a4f] text-white px-6 py-2.5 rounded-xl text-sm flex items-center gap-2 transition-colors shadow-sm disabled:opacity-60`}
                      style={{ fontWeight: 600 }}
                    >
                      <Check size={16} />{" "}
                      {saving ? "Creating..." : "Create Account"}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
