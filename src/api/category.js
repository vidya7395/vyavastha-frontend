import api from './axiosInstance';

export const getCategory = async () => {
  const response = await api.get(`categories`, {
    withCredentials: true
  });
  return response.data;
};
export const addCategory = async (categoryValue) => {
  const response = await api.get(
    `categories`,
    {
      name: categoryValue
    },
    {
      withCredentials: true
    }
  );

  return response.data;
};
