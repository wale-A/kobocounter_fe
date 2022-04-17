import axios from "@/util/axios";
import {
  LoginPayload,
  RegisterPayload,
  FilterParams,
  TransactionPayload,
  SplitTransaction,
  TransactionResponse,
} from "@/types";
import { AxiosResponse } from "axios";

const login = (payload: LoginPayload): Promise<AxiosResponse> =>
  axios.post(`/users/login`, payload);

const register = (payload: RegisterPayload): Promise<AxiosResponse> =>
  axios.post(`/users`, payload);

const getAccounts = (): Promise<AxiosResponse> =>
  axios.get(`/banking/accounts`);

const addAccount = (code: string): Promise<AxiosResponse> =>
  axios.post(`/banking/accounts`, { code });

const reAuthAccount = (id: string): Promise<AxiosResponse> =>
  axios.post(`/banking/account/${id}/reauthorize`);

const deleteAccount = (id: string): Promise<AxiosResponse> =>
  axios.delete(`/banking/account/${id}`);

const getTransactions = (
  params: FilterParams
): Promise<AxiosResponse<TransactionResponse>> =>
  axios.get(`/banking/accounts/transactions`, { params });

const updateTransaction = (
  id: string,
  payload: TransactionPayload
): Promise<AxiosResponse> => axios.put(`/banking/transactions/${id}`, payload);

const splitTransctions = (
  id: string,
  payload: SplitTransaction[]
): Promise<AxiosResponse> =>
  axios.post(`/banking/transactions/${id}/split`, payload);

const getTransactionCategories = (
  params: FilterParams
): Promise<AxiosResponse> =>
  axios.get(`/banking/accounts/transactions/categories`, { params });

const getEstablishments = (): Promise<AxiosResponse> =>
  axios.get(`/banking/establishments`);

const getEstablishmentActivities = (
  params: FilterParams
): Promise<AxiosResponse> =>
  axios.get(`/banking/establishmentActivities`, { params });

const getExpenses = (params: FilterParams): Promise<AxiosResponse> =>
  axios.get(`/banking/expense`, { params });

const getRecurringExpenses = (
  params?: Record<string, string | undefined>
): Promise<AxiosResponse> =>
  axios.get(`/banking/accounts/recurrentExpenses`, { params });

const getNetIncome = (params: FilterParams): Promise<AxiosResponse> =>
  axios.get(`/banking/accounts/netincome`, { params });

const getRevenue = (params: FilterParams): Promise<AxiosResponse> =>
  axios.get(`/banking/revenue`, { params });

const subscribe = (body: Record<string, string>): Promise<AxiosResponse> =>
  axios.post(`/users/subscription`, body);

const unsubscribe = (data: Record<string, string>): Promise<AxiosResponse> =>
  axios.delete(`/users/subscription`, { data });

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
