import type { Method } from "axios";
import { http } from "@/lib/http";

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
  role?: UserRole;
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
  [key: string]: QueryValue | undefined;
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
  user: UserProfile;
  token: string;
}

interface PasswordResetData {
  accepted: boolean;
}

type QueryValue = string | number | boolean | undefined;

type QueryParams = Record<string, QueryValue>;

export const API_ENDPOINTS = {
  users: {
    base: "users",
    register: "users/register",
    login: "users/login",
    logout: "users/logout",
    forgotPassword: "users/forgot-password",
    resetPassword: "users/reset-password",
    me: "users/me",
    changePassword: "users/change-password",
    staff: "users/staff",
    charities: "users/charities",
    status: (userId: string) => `users/${userId}/status`,
  },
  meals: {
    base: "meals",
    byId: (mealId: string) => `meals/${mealId}`,
    status: (mealId: string) => `meals/${mealId}/status`,
  },
  orders: {
    base: "orders",
    checkout: "orders/checkout",
    status: (orderId: string) => `orders/${orderId}/status`,
  },
  donations: {
    base: "donations",
    status: (donationId: string) => `donations/${donationId}/status`,
  },
  branches: {
    base: "branches",
    byId: (branchId: string) => `branches/${branchId}`,
  },
} as const;



async function request<TResponse, TBody = unknown>(config: {
  method?: Method;
  url: string;
  headers?: Record<string, string>;
  data?: TBody;
  params?: QueryParams;
}): Promise<TResponse> {
  const response = await http.request<ApiEnvelope<TResponse>>({
    method: config.method ?? "GET",
    url: config.url,
    headers: config.headers,
    data: config.data,
    params: config.params,
  });

  const payload = response.data;
  if (!payload?.success) {
    const fieldErrors = payload?.errors
      ?.map((entry) => `${entry.path}: ${entry.message}`)
      .join(" | ");

    throw new Error(fieldErrors || payload?.message || "Request failed");
  }

  return payload.data;
}

export async function apiRegister(body: RegisterPayload): Promise<AuthData> {
  return request<AuthData, RegisterPayload>({
    method: "POST",
    url: API_ENDPOINTS.users.register,
    data: body,
  });
}

export async function apiCreateStaff(
  body: CreateStaffPayload,
): Promise<UserProfile> {
  return request<UserProfile, CreateStaffPayload>({
    method: "POST",
    url: API_ENDPOINTS.users.staff,
    data: body,
  });
}

export async function apiLogin(body: LoginPayload): Promise<AuthData> {
  return request<AuthData, LoginPayload>({
    method: "POST",
    url: API_ENDPOINTS.users.login,
    data: body,
  });
}

export async function apiForgotPassword(
  body: ForgotPasswordPayload,
): Promise<PasswordResetData> {
  return request<PasswordResetData, ForgotPasswordPayload>({
    method: "POST",
    url: API_ENDPOINTS.users.forgotPassword,
    data: body,
  });
}

export async function apiResetPassword(
  body: ResetPasswordPayload,
): Promise<AuthData> {
  return request<AuthData, ResetPasswordPayload>({
    method: "POST",
    url: API_ENDPOINTS.users.resetPassword,
    data: body,
  });
}

export async function apiGetMe() {
  return request<UserProfile>({
    url: API_ENDPOINTS.users.me,
  });
}

export async function apiUpdateMe(body: UpdateProfilePayload) {
  return request<UserProfile, UpdateProfilePayload>({
    method: "PATCH",
    url: API_ENDPOINTS.users.me,
    data: body,
  });
}

export async function apiChangePassword(body: ChangePasswordPayload) {
  return request<AuthData, ChangePasswordPayload>({
    method: "PATCH",
    url: API_ENDPOINTS.users.changePassword,
    data: body,
  });
}

export async function apiListMeals(query?: MealListQuery) {
  return request<PaginatedData<SurplusMeal>>({
    url: API_ENDPOINTS.meals.base,
    params: query,
  });
}

export async function apiGetMealById(mealId: string) {
  return request<SurplusMeal>({
    url: API_ENDPOINTS.meals.byId(mealId),
  });
}

export async function apiCreateOrder(body: CreateOrderPayload) {
  return request<CustomerOrder, CreateOrderPayload>({
    method: "POST",
    url: API_ENDPOINTS.orders.base,
    data: body,
  });
}

export async function apiListOrders(query?: OrderListQuery) {
  return request<PaginatedData<CustomerOrder>>({
    url: API_ENDPOINTS.orders.base,
    params: query,
  });
}

export async function apiCheckoutOrders(body: CheckoutOrdersPayload) {
  return request<CheckoutOrdersResult, CheckoutOrdersPayload>({
    method: "POST",
    url: API_ENDPOINTS.orders.checkout,
    data: body,
  });
}

export async function apiListDonations(query?: DonationListQuery) {
  return request<PaginatedData<Donation>>({
    url: API_ENDPOINTS.donations.base,
    params: query,
  });
}

export async function apiUpdateDonationStatus(
  donationId: string,
  body: UpdateDonationStatusPayload,
) {
  return request<Donation, UpdateDonationStatusPayload>({
    method: "PATCH",
    url: API_ENDPOINTS.donations.status(donationId),
    data: body,
  });
}

export async function apiListUsers(role?: UserRole) {
  return request<CharityUser[]>({
    url: API_ENDPOINTS.users.base,
    params: { role },
  });
}

export async function apiListCharities() {
  return request<CharityUser[]>({
    url: API_ENDPOINTS.users.charities,
  });
}

export async function apiUpdateUserStatus(
  userId: string,
  body: UpdateUserStatusPayload,
) {
  return request<CharityUser, UpdateUserStatusPayload>({
    method: "PATCH",
    url: API_ENDPOINTS.users.status(userId),
    data: body,
  });
}

export async function apiListBranches(query?: BranchListQuery) {
  return request<PaginatedData<Branch>>({
    url: API_ENDPOINTS.branches.base,
    params: query,
  });
}

export async function apiCreateBranch(body: CreateBranchPayload) {
  return request<Branch, CreateBranchPayload>({
    method: "POST",
    url: API_ENDPOINTS.branches.base,
    data: body,
  });
}

export async function apiUpdateBranch(
  branchId: string,
  body: UpdateBranchPayload,
) {
  return request<Branch, UpdateBranchPayload>({
    method: "PATCH",
    url: API_ENDPOINTS.branches.byId(branchId),
    data: body,
  });
}

export async function apiCreateMeal(
  body: Omit<
    SurplusMeal,
    "_id" | "createdBy" | "createdAt" | "updatedAt" | "quantityAvailable"
  >,
) {
  return request<SurplusMeal>({
    method: "POST",
    url: API_ENDPOINTS.meals.base,
    data: body,
  });
}

export async function apiUpdateMeal(
  mealId: string,
  body: Partial<
    Omit<SurplusMeal, "_id" | "createdBy" | "createdAt" | "updatedAt">
  >,
) {
  return request<SurplusMeal>({
    method: "PATCH",
    url: API_ENDPOINTS.meals.byId(mealId),
    data: body,
  });
}

export async function apiChangeMealStatus(mealId: string, status: string) {
  return request<SurplusMeal, { status: string }>({
    method: "PATCH",
    url: API_ENDPOINTS.meals.status(mealId),
    data: { status },
  });
}

export async function apiCreateDonation(body: CreateDonationPayload) {
  return request<Donation, CreateDonationPayload>({
    method: "POST",
    url: API_ENDPOINTS.donations.base,
    data: body,
  });
}

export async function apiChangeOrderStatus(orderId: string, status: string) {
  return request<CustomerOrder, { status: string }>({
    method: "PATCH",
    url: API_ENDPOINTS.orders.status(orderId),
    data: { status },
  });
}

// Re-export session utilities from their canonical location for backward compatibility
export {
  saveAuthUser,
  saveAuthSession,
  getAuthUser,
  clearAuthSession,
} from "@/platform/auth/session.client";
