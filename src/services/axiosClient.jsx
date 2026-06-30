import axios from 'axios';
import { API_BASE } from '../config/apiEndpoints';
import { getSubdomain } from '../utils/tenantUtils';

// ── Access token → localStorage ────────────────────────
export const setAccessToken = (token) => localStorage.setItem('access_token', token);
export const getAccessToken = ()      => localStorage.getItem('access_token');

// ── CSRF token → memory (JS variable) ─────────────────
let csrfToken = null;
export const setCsrfToken = (token) => { csrfToken = token; };

export const getCsrfToken = ()      => csrfToken;
const subdomain = getSubdomain();

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('logged');
  localStorage.removeItem('remember_email');
  csrfToken = null;
};

// ── Axios instance ─────────────────────────────────────
const axiosClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
});

// ── Request interceptor ────────────────────────────────
axiosClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token)     config.headers['Authorization'] = `Bearer ${token}`;
    if (csrfToken) config.headers['X-CSRF-Token']  = csrfToken;
    if (subdomain) config.headers['X-Tenant']      = subdomain;
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Refresh queue ──────────────────────────────────────
let isRefreshing = false;
let waitingQueue  = [];

const resolveQueue = (newToken) =>
  waitingQueue.forEach(({ resolve }) => resolve(newToken));
const rejectQueue  = (err) =>
  waitingQueue.forEach(({ reject }) => reject(err));

// ── Response interceptor ───────────────────────────────
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waitingQueue.push({ resolve, reject });
      }).then((newToken) => {
        original.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosClient(original);
      });
    }

    original._retry = true;
    isRefreshing    = true;

    try {
      const res = await axios.post(
        `${API_BASE}/refresh-token`,
        {},
        { withCredentials: true }
      );
      const newToken = res.data.data.access_token;
      setAccessToken(newToken);
      resolveQueue(newToken);
      waitingQueue = [];
      original.headers['Authorization'] = `Bearer ${newToken}`;
      return axiosClient(original);

    } catch (refreshError) {
      rejectQueue(refreshError);
      waitingQueue = [];
      clearTokens();
      return Promise.reject(refreshError);

    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;