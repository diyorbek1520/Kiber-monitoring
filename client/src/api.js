// Axios backend API bilan HTTP so'rovlar qilish uchun ishlatiladi.
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 120000
});

const TOKEN_KEY = 'kiber_platforma_token';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  delete api.defaults.headers.common.Authorization;
}

setStoredToken(getStoredToken());

export function getErrorMessage(error) {
  if (error.code === 'ERR_NETWORK') {
    return 'Backend server bilan aloqa yo‘q. VITE_API_URL va backend deploy manzilini tekshiring.';
  }

  return error.response?.data?.xabar || error.message || 'So‘rov bajarilmadi';
}

export async function downloadPdfReport(id) {
  const response = await api.get(`/hisobotlar/${id}/pdf`, { responseType: 'blob' });
  const url = URL.createObjectURL(response.data);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hisobot-${id}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
