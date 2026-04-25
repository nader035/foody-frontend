"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/shared/branding";
import { apiRegister } from "@/features/auth/api";
import { saveAuthSession } from "@/platform/auth/session.client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { LucideIcon } from "lucide-react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Building2,
  ArrowRight,
  ArrowLeft,
  Check,
  LayoutDashboard,
  ClipboardList,
  Heart,
  ShoppingBag,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";

const roleConfig: Record<
  string,
  {
    label: string;
    icon: LucideIcon;
    redirect: string;
    tagline: string;
    emailPlaceholder: string;
    leftTitle: string;
    leftDesc: string;
    perks: string[];
  }
> = {
  customer: {
    label: "Customer",
    icon: ShoppingBag,
    redirect: "/customer",
    tagline: "Start saving on quality meals today",
    emailPlaceholder: "you@email.com",
    leftTitle: "Fresh food,\nhalf the price",
    leftDesc:
      "Create your account to start browsing and reserving discounted surplus meals near you.",
    perks: [
      "Up to 50% off restaurant meals",
      "Fresh food prepared same day",
      "Save food from going to waste",
    ],
  },
  manager: {
    label: "Restaurant Manager",
    icon: LayoutDashboard,
    redirect: "/manager",
    tagline: "Set up your restaurant surplus management",
    emailPlaceholder: "you@restaurant.com",
    leftTitle: "Start making\na difference today",
    leftDesc:
      "Set up your account in minutes and start managing food surplus across all your branches.",
    perks: [
      "Free 14-day trial, no credit card",
      "Unlimited branches & staff accounts",
      "Real-time donation matching",
    ],
  },
  staff: {
    label: "Branch Staff",
    icon: ClipboardList,
    redirect: "/staff",
    tagline: "Join your restaurant's surplus management team",
    emailPlaceholder: "you@restaurant.com",
    leftTitle: "Join your\nbranch team",
    leftDesc:
      "Get set up in seconds. Your manager has already configured everything â€” just start logging surplus.",
    perks: [
      "Quick surplus logging in seconds",
      "No setup required, just join",
      "Real-time sync with manager dashboard",
    ],
  },
  charity: {
    label: "Charity Organization",
    icon: Heart,
    redirect: "/charity",
    tagline: "Partner with restaurants to receive surplus donations",
    emailPlaceholder: "you@charity.org",
    leftTitle: "Receive donations,\nfeed communities",
    leftDesc:
      "Partner with local restaurants and receive instant alerts when surplus meals are available for pickup.",
    perks: [
      "Instant donation notifications",
      "One-tap pickup confirmation",
      "Complete audit trail for reports",
    ],
  },
};

const signupSchema = z
  .object({
    role: z.enum(["customer", "manager", "staff", "charity"]),
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must include at least one uppercase letter")
      .regex(/\d/, "Password must include at least one number"),
    phone: z.string().optional(),
    restaurantName: z.string().optional(),
    branchName: z.string().optional(),
    organizationName: z.string().optional(),
    organizationAddress: z.string().optional(),
    organizationWebsite: z
      .union([
        z.string().url("Enter a valid website URL (including https://)"),
        z.literal(""),
      ])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === "manager") {
      if (!data.restaurantName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["restaurantName"],
          message: "Restaurant name is required",
        });
      }
      if (!data.phone?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "Phone number is required",
        });
      }
    }

    if (data.role === "charity") {
      if (!data.organizationName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["organizationName"],
          message: "Organization name is required",
        });
      }
      if (!data.organizationAddress?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["organizationAddress"],
          message: "Organization address is required",
        });
      }
      if (!data.phone?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phone"],
          message: "Phone number is required",
        });
      }
    }
  });

type SignupFormValues = z.infer<typeof signupSchema>;

export function AuthSignup() {
  const navigate = useRouter();
  const params = useSearchParams();
  const role = params.get("role") || "customer";
  const config = roleConfig[role] || roleConfig.customer;
  const RoleIcon = config.icon;

  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      role: role as SignupFormValues["role"],
      fullName: "",
      email: "",
      password: "",
      phone: "",
      restaurantName: "",
      branchName: "",
      organizationName: "",
      organizationAddress: "",
      organizationWebsite: "",
    },
  });

  useEffect(() => {
    setValue("role", role as SignupFormValues["role"]);
  }, [role, setValue]);

  // Staff cannot self-register â€” redirect to login
  if (role === "staff") {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-gray-50 p-6"
        style={{ fontFamily: "Nunito, sans-serif" }}
      >
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 bg-[#0E3442]/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <ClipboardList size={28} className="text-[#0E3442]" />
          </div>
          <h1
            className="text-[#0E3442] text-2xl mb-3"
            style={{ fontWeight: 700 }}
          >
            Staff Accounts Are Manager-Created
          </h1>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            Branch staff accounts are created by restaurant managers through
            their dashboard. If your manager has already created your account,
            you can sign in with the credentials they provided.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate.push("/login?role=staff")}
              className="w-full bg-[#25A05F] hover:bg-[#1e8a4f] text-white py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
              style={{ fontWeight: 600 }}
            >
              Sign In with My Credentials <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate.push("/auth")}
              className="w-full bg-white hover:bg-gray-50 border border-gray-200 text-[#0E3442] py-3 rounded-xl text-sm transition-colors"
              style={{ fontWeight: 600 }}
            >
              Back to Role Selection
            </button>
          </div>
          <p className="text-gray-400 text-xs mt-6">
            Need an account? Contact your restaurant manager.
          </p>
        </div>
      </div>
    );
  }

  const onSubmit = async (values: SignupFormValues) => {
    setErrorMessage("");

    try {
      setLoading(true);
      const result = await apiRegister({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        role: values.role,
        phone: values.phone || undefined,
        restaurantName: values.restaurantName || undefined,
        branchName: values.branchName || undefined,
        organizationName: values.organizationName || undefined,
        organizationAddress: values.organizationAddress || undefined,
        organizationWebsite: values.organizationWebsite || undefined,
      });

      saveAuthSession(result.user);
      navigate.push(roleConfig[result.user.role]?.redirect || config.redirect);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to create account",
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordValue = watch("password") || "";
  const passChecks = [
    { label: "8+ characters", ok: passwordValue.length >= 8 },
    { label: "A number", ok: /\d/.test(passwordValue) },
    { label: "Uppercase", ok: /[A-Z]/.test(passwordValue) },
  ];

  const needsRestaurant = role === "manager";
  const isCharity = role === "charity";

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "Nunito, sans-serif" }}
    >
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#155433] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-40 -left-10 w-72 h-72 bg-[#25A05F] rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-56 h-56 bg-[#25A05F] rounded-full blur-3xl" />
        </div>
        <div
          className="relative z-10 cursor-pointer"
          onClick={() => navigate.push("/")}
        >
          <Logo size="lg" />
        </div>
        <div className="relative z-10 space-y-6">
          <h2
            className="text-white text-4xl leading-tight whitespace-pre-line"
            style={{ fontWeight: 700 }}
          >
            {config.leftTitle}
          </h2>
          <p className="text-white/60 text-lg max-w-md">{config.leftDesc}</p>
          <div className="space-y-3 pt-2">
            {config.perks.map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-[#25A05F] rounded-full flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white" />
                </div>
                <span className="text-white/70 text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="relative z-10 text-white/30 text-sm">
          &copy; 2026 Foody. All rights reserved.
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 p-6 overflow-y-auto">
        <div className="w-full max-w-md py-4">
          <div
            className="lg:hidden mb-8 cursor-pointer"
            onClick={() => navigate.push("/")}
          >
            <Logo size="md" />
          </div>

          {/* Back + Role badge */}
          <button
            onClick={() => navigate.push("/auth")}
            className="inline-flex items-center gap-1.5 text-gray-400 text-sm hover:text-[#155433] mb-6 transition-colors"
          >
            <ArrowLeft size={14} /> Change role
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#25A05F]/10 flex items-center justify-center">
              <RoleIcon size={20} className="text-[#25A05F]" />
            </div>
            <div>
              <p className="text-[#0E3442] text-sm" style={{ fontWeight: 700 }}>
                Signing up as {config.label}
              </p>
              <p className="text-gray-400 text-xs">{config.tagline}</p>
            </div>
          </div>

          <h1
            className="text-[#0E3442] text-3xl mb-2"
            style={{ fontWeight: 700 }}
          >
            Create your account
          </h1>
          <p className="text-gray-500 mb-8">Get started with Foody for free</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register("role")} />
            {/* Full Name â€” all roles */}
            <div>
              <label
                className="text-gray-600 text-sm block mb-1.5"
                style={{ fontWeight: 600 }}
              >
                Full Name
              </label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  {...register("fullName")}
                  placeholder={isCharity ? "Contact person name" : "John Doe"}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#0E3442] placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Restaurant Name â€” manager only */}
            {needsRestaurant && (
              <div>
                <label
                  className="text-gray-600 text-sm block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Restaurant Name
                </label>
                <div className="relative">
                  <Building2
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    {...register("restaurantName")}
                    placeholder="e.g. FreshBites"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#0E3442] placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                  />
                </div>
                {errors.restaurantName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.restaurantName.message}
                  </p>
                )}
              </div>
            )}

            {/* Branch Name â€” staff only */}
            {role === "staff" && (
              <div>
                <label
                  className="text-gray-600 text-sm block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Branch Name
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    {...register("branchName")}
                    placeholder="e.g. Downtown Main"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#0E3442] placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                  />
                </div>
                {errors.branchName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.branchName.message}
                  </p>
                )}
              </div>
            )}

            {/* Charity fields â€” charity only */}
            {isCharity && (
              <>
                <div>
                  <label
                    className="text-gray-600 text-sm block mb-1.5"
                    style={{ fontWeight: 600 }}
                  >
                    Organization Name
                  </label>
                  <div className="relative">
                    <Heart
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      {...register("organizationName")}
                      placeholder="e.g. City Food Bank"
                      className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#0E3442] placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                    />
                  </div>
                  {errors.organizationName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.organizationName.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label
                      className="text-gray-600 text-sm block mb-1.5"
                      style={{ fontWeight: 600 }}
                    >
                      Address
                    </label>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        {...register("organizationAddress")}
                        placeholder="Street, City"
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#0E3442] placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                      />
                    </div>
                    {errors.organizationAddress && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.organizationAddress.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      className="text-gray-600 text-sm block mb-1.5"
                      style={{ fontWeight: 600 }}
                    >
                      Website
                    </label>
                    <div className="relative">
                      <Globe
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="url"
                        {...register("organizationWebsite")}
                        placeholder="https://"
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#0E3442] placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                      />
                    </div>
                    {errors.organizationWebsite && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.organizationWebsite.message}
                      </p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Email â€” all roles */}
            <div>
              <label
                className="text-gray-600 text-sm block mb-1.5"
                style={{ fontWeight: 600 }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  {...register("email")}
                  placeholder={config.emailPlaceholder}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#0E3442] placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone â€” charity & manager */}
            {(isCharity || role === "manager") && (
              <div>
                <label
                  className="text-gray-600 text-sm block mb-1.5"
                  style={{ fontWeight: 600 }}
                >
                  Phone Number
                </label>
                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="tel"
                    {...register("phone")}
                    placeholder="+20 100 123 4567"
                    className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-[#0E3442] placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            )}

            {/* Password â€” all roles */}
            <div>
              <label
                className="text-gray-600 text-sm block mb-1.5"
                style={{ fontWeight: 600 }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type={showPass ? "text" : "password"}
                  {...register("password")}
                  placeholder="Create a strong password"
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-11 py-3 text-sm text-[#0E3442] placeholder:text-gray-400 focus:outline-none focus:border-[#25A05F] focus:ring-2 focus:ring-[#25A05F]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
              {passwordValue && (
                <div className="flex gap-3 mt-2">
                  {passChecks.map((c) => (
                    <span
                      key={c.label}
                      className={`text-[11px] flex items-center gap-1 ${c.ok ? "text-[#25A05F]" : "text-gray-400"}`}
                    >
                      <Check size={10} /> {c.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#25A05F] hover:bg-[#1e8a4f] disabled:opacity-60 text-white py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
              style={{ fontWeight: 600 }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            Already have an account?{" "}
            <Link
              href={`/login?role=${role}`}
              className="text-[#25A05F] hover:underline"
              style={{ fontWeight: 600 }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
