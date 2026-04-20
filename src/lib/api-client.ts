export type UserRole = "customer" | "manager" | "staff" | "charity";

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  restaurantName?: string;
  branchName?: string;
  branchId?: string;
  organizationName?: string;
  organizationAddress?: string;
  organizationWebsite?: string;
}

export interface CreateStaffPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  branchId: string;
  branchName?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface UpdateProfilePayload {
  fullName?: string;
  phone?: string;
  restaurantName?: string;
  branchName?: string;
  organizationName?: string;
  organizationAddress?: string;
  organizationWebsite?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface ListQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
}

export interface MealListQuery extends ListQuery {
  branchId?: string;
  status?: string;
  category?: string;
}

export interface OrderListQuery extends ListQuery {
  status?: string;
  paymentStatus?: string;
}

export interface DonationListQuery extends ListQuery {
  status?: string;
}

export interface BranchListQuery extends ListQuery {
  includeInactive?: boolean;
}

export interface BranchSettings {
  autoAssignToCharity: boolean;
  publicListingEnabled: boolean;
  donationSplitPercentage: number;
  discountPercentage: number;
}

export interface BranchAddress {
  line1?: string | null;
  city?: string | null;
  area?: string | null;
  country?: string | null;
}

export interface Branch {
  _id: string;
  managerId: string;
  name: string;
  code?: string | null;
  address?: BranchAddress;
  contactPhone?: string | null;
  isActive: boolean;
  settings: BranchSettings;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchPayload {
  name: string;
  code?: string;
  address?: BranchAddress;
  contactPhone?: string;
  settings?: Partial<BranchSettings>;
}

export interface UpdateBranchPayload extends Partial<CreateBranchPayload> {
  isActive?: boolean;
}

export interface BranchRef {
  _id: string;
  name: string;
  address?: {
    line1?: string | null;
    city?: string | null;
    area?: string | null;
    country?: string | null;
  };
  contactPhone?: string | null;
}

export interface SurplusMeal {
  _id: string;
  branchId: string | BranchRef;
  createdBy: string;
  title: string;
  description?: string | null;
  category: string;
  quantityTotal: number;
  quantityAvailable: number;
  unitPrice: number;
  currency: string;
  visibility: {
    allowDonation: boolean;
    allowMarketplace: boolean;
  };
  status: string;
  expiresAt: string;
  images: string[];
  allergens: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  mealId: string;
  quantity: number;
  paymentMethod?: "cash" | "card" | "wallet" | "online";
  notes?: string;
}

export type CheckoutOrderItemPayload = CreateOrderPayload;

export interface CheckoutOrdersPayload {
  items: CheckoutOrderItemPayload[];
}

export interface CheckoutOrdersFailure {
  mealId: string;
  quantity: number;
  message: string;
}

export interface CheckoutOrdersResult {
  successfulItems: number;
  failedItems: number;
  totalMealsReserved: number;
  orders: CustomerOrder[];
  failures: CheckoutOrdersFailure[];
}

export interface CustomerOrder {
  _id: string;
  orderNumber: string;
  mealId: string;
  branchId: string;
  customerId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  currency: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  pickupWindowStart: string;
  pickupWindowEnd: string;
  pickedUpAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Donation {
  _id: string;
  mealId: string;
  branchId: string;
  charityId: string;
  matchedBy?: string | null;
  pickupCode?: string | null;
  quantity: number;
  status: string;
  scheduledPickupAt?: string | null;
  pickedUpAt?: string | null;
  completedAt?: string | null;
  cancellationReason?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDonationPayload {
  mealId: string;
  charityId: string;
  quantity: number;
  scheduledPickupAt?: string;
  notes?: string;
}

export interface UpdateDonationStatusPayload {
  status:
    | "matched"
    | "confirmed"
    | "picked_up"
    | "completed"
    | "cancelled"
    | "no_show";
  cancellationReason?: string;
}

export interface CharityUser {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  managerId?: string | null;
  branchId?: string | null;
  phone?: string | null;
  branchName?: string | null;
  isActive?: boolean;
  organizationName?: string | null;
  organizationAddress?: string | null;
  organizationWebsite?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserStatusPayload {
  isActive: boolean;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ path: string; message: string }>;
}

export interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  managerId?: string | null;
  branchId?: string | null;
  phone?: string | null;
  restaurantName?: string | null;
  branchName?: string | null;
  organizationName?: string | null;
  organizationAddress?: string | null;
  organizationWebsite?: string | null;
}

interface AuthData {
  token: string;
  user: UserProfile;
}

interface PasswordResetData {
  accepted: boolean;
  resetToken: string | null;
}

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://localhost:5000/api/v1";

const authCookieMaxAgeSeconds = 60 * 60 * 24 * 7;

function writeCookie(
  name: string,
  value: string,
  maxAgeSeconds = authCookieMaxAgeSeconds,
) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAgeSeconds}; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function readCookie(name: string) {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${name}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.slice(name.length + 1));
}

function buildQueryString<T extends object>(query?: T) {
  if (!query) {
    return "";
  }

  const params = new URLSearchParams();

  Object.entries(query as Record<string, unknown>).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    params.set(key, String(value));
  });

  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  const rawText = await response.text();
  let payload: ApiEnvelope<T> | null = null;

  try {
    payload = rawText ? (JSON.parse(rawText) as ApiEnvelope<T>) : null;
  } catch {
    payload = null;
  }

  if (!response.ok || !payload?.success) {
    const fieldErrors = payload?.errors
      ?.map((e) => `${e.path}: ${e.message}`)
      .join(" | ");
    throw new Error(
      fieldErrors ||
        payload?.message ||
        (rawText && !payload ? rawText : "Request failed"),
    );
  }

  return payload.data;
}

function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  if (!token) {
    return {};
  }

  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function apiRegister(body: RegisterPayload): Promise<AuthData> {
  return request<AuthData>("/users/register", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiCreateStaff(
  body: CreateStaffPayload,
): Promise<UserProfile> {
  return request<UserProfile>("/users/staff", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
}

export async function apiLogin(body: LoginPayload): Promise<AuthData> {
  return request<AuthData>("/users/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiForgotPassword(
  body: ForgotPasswordPayload,
): Promise<PasswordResetData> {
  return request<PasswordResetData>("/users/forgot-password", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiResetPassword(
  body: ResetPasswordPayload,
): Promise<AuthData> {
  return request<AuthData>("/users/reset-password", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function apiGetMe() {
  return request<UserProfile>("/users/me", {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

export async function apiUpdateMe(body: UpdateProfilePayload) {
  return request<UserProfile>("/users/me", {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
}

export async function apiChangePassword(body: ChangePasswordPayload) {
  return request<AuthData>("/users/change-password", {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
}

export async function apiListMeals(query?: MealListQuery) {
  return request<PaginatedData<SurplusMeal>>(
    `/meals${buildQueryString(query)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );
}

export async function apiGetMealById(mealId: string) {
  return request<SurplusMeal>(`/meals/${mealId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

export async function apiCreateOrder(body: CreateOrderPayload) {
  return request<CustomerOrder>("/orders", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
}

export async function apiListOrders(query?: OrderListQuery) {
  return request<PaginatedData<CustomerOrder>>(
    `/orders${buildQueryString(query)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );
}

export async function apiCheckoutOrders(body: CheckoutOrdersPayload) {
  return request<CheckoutOrdersResult>("/orders/checkout", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
}

export async function apiListDonations(query?: DonationListQuery) {
  return request<PaginatedData<Donation>>(
    `/donations${buildQueryString(query)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );
}

export async function apiUpdateDonationStatus(
  donationId: string,
  body: UpdateDonationStatusPayload,
) {
  return request<Donation>(`/donations/${donationId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
}

export async function apiListUsers(role?: UserRole) {
  return request<CharityUser[]>(`/users${buildQueryString({ role })}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

export async function apiListCharities() {
  return request<CharityUser[]>("/users/charities", {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

export async function apiUpdateUserStatus(
  userId: string,
  body: UpdateUserStatusPayload,
) {
  return request<CharityUser>(`/users/${userId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
}

export async function apiListBranches(query?: BranchListQuery) {
  return request<PaginatedData<Branch>>(`/branches${buildQueryString(query)}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
}

export async function apiCreateBranch(body: CreateBranchPayload) {
  return request<Branch>("/branches", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
}

export async function apiUpdateBranch(
  branchId: string,
  body: UpdateBranchPayload,
) {
  return request<Branch>(`/branches/${branchId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
}

export async function apiCreateMeal(
  body: Omit<
    SurplusMeal,
    "_id" | "createdBy" | "createdAt" | "updatedAt" | "quantityAvailable"
  >,
) {
  return request<SurplusMeal>("/meals", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
}

export async function apiUpdateMeal(
  mealId: string,
  body: Partial<
    Omit<SurplusMeal, "_id" | "createdBy" | "createdAt" | "updatedAt">
  >,
) {
  return request<SurplusMeal>(`/meals/${mealId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
}

export async function apiChangeMealStatus(mealId: string, status: string) {
  return request<SurplusMeal>(`/meals/${mealId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
}

export async function apiCreateDonation(body: CreateDonationPayload) {
  return request<Donation>("/donations", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
}

export async function apiChangeOrderStatus(orderId: string, status: string) {
  return request<CustomerOrder>(`/orders/${orderId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
}

export function saveAuthToken(token: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("foody_token", token);
    writeCookie("foody_token", token);
  }
}

export function saveAuthUser(user: UserProfile) {
  if (typeof window !== "undefined") {
    localStorage.setItem("foody_user", JSON.stringify(user));
    writeCookie("foody_role", user.role);
  }
}

export function saveAuthSession(token: string, user: UserProfile) {
  saveAuthToken(token);
  saveAuthUser(user);
}

export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem("foody_token");
  if (stored) {
    return stored;
  }

  return readCookie("foody_token");
}

export function clearAuthToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("foody_token");
    deleteCookie("foody_token");
  }
}

export function getAuthUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem("foody_user");
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("foody_token");
    localStorage.removeItem("foody_user");
    deleteCookie("foody_token");
    deleteCookie("foody_role");
  }
}
