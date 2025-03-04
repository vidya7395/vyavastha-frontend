import api from './axiosInstance';

export const getTransactionSummary = async (month) => {
  // month = 2025-02
  const response = await api.get(`transaction/summary?month=${month}`, {
    withCredentials: true
  });
  return response.data;
};
export const getRecentTransactionIncome = async () => {
  // month = 2025-02
  const response = await api.get(`transaction/recent-income`, {
    withCredentials: true
  });
  return response.data;
};
export const getRecentTransactionExpense = async () => {
  const response = await api.get(`transaction/recent-expenses`, {
    withCredentials: true
  });
  return response.data;
};
export const getTransactionExpense = async ({ page, limit }) => {
  const response = await api.get(
    `transaction/expense?page=${page}&limit=${limit}`,
    { withCredentials: true }
  );
  return response.data;
};
