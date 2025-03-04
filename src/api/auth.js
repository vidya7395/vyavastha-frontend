import api from './axiosInstance';

export const login = async (emailId, password) => {
  const response = await api.post(
    '/auth/login',
    { emailId, password },
    { withCredentials: true }
  );
  return response.data.user;
};

// ✅ Fetch User API (Use Cookies)
export const getUser = async () => {
  const response = await api.get('/auth/me', { withCredentials: true });
  return response.data;
};
