import axios from "@/util/axios";
import { LoginPayload, RegisterPayload, FilterParams } from "@/types";

const API_URL = process.env.VUE_APP_API_URL;

const login = (payload: LoginPayload) =>
  axios.post(`${API_URL}/users/login`, payload);

const register = (payload: RegisterPayload) =>
  axios.post(`${API_URL}/users`, payload);

const getAccounts = () => axios.get(`${API_URL}/banking/accounts`);

const addAccount = (code: string) =>
  axios.post(`${API_URL}/banking/accounts`, { code });

const reAuthAccount = (id: string) =>
  axios.post(`${API_URL}/banking/account/${id}/reauthorize`);

const deleteAccount = (id: string) =>
  axios.delete(`${API_URL}/banking/account/${id}`);

const getTransactions = (params: FilterParams) =>
  axios.get(`${API_URL}/banking/accounts/transactions`, { params });

const updateTransaction = (id: string, params: string) =>
  axios.put(`${API_URL}/banking/transactions/${id}`, params);

const splitTransctions = (id: string, params: string) =>
  axios.post(`${API_URL}/banking/transactions/${id}/split`, params);

const getTransactionCategories = (params: FilterParams) =>
  axios.get(`${API_URL}/banking/accounts/transactions/categories`, { params });

const getEstablishments = () => axios.get(`${API_URL}/banking/establishments`);

const getEstablishmentActivities = (params: FilterParams) =>
  axios.get(`${API_URL}/banking/establishmentActivities`, { params });

const getExpenses = (params: FilterParams) =>
  axios.get(`${API_URL}/banking/expense`, { params });

const getRecurringExpenses = (params?: Record<string, string | undefined>) =>
  axios.get(`${API_URL}/banking/accounts/recurrentExpenses`, { params });

const getNetIncome = (params: FilterParams) =>
  axios.get(`${API_URL}/banking/accounts/netincome`, { params });

const getRevenue = (params: FilterParams) =>
  axios.get(`${API_URL}/banking/revenue`, { params });

const subscribe = (body: Record<string, string>) =>
  axios.post(`${API_URL}/users/subscription`, body);

const unsubscribe = (data: Record<string, string>) =>
  axios.delete(`${API_URL}/users/subscription`, { data });

export default {
  login,
  register,
  getAccounts,
  addAccount,
  reAuthAccount,
  deleteAccount,
  getTransactions,
  updateTransaction,
  splitTransctions,
  getTransactionCategories,
  getEstablishments,
  getEstablishmentActivities,
  getExpenses,
  getRecurringExpenses,
  getNetIncome,
  getRevenue,
  subscribe,
  unsubscribe,
};
