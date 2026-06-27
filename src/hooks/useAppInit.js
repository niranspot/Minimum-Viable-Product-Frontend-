import { useEffect, useState } from 'react';
import { useDispatch }         from 'react-redux';
import axiosClient, {
  getAccessToken,
  setAccessToken,
  setCsrfToken,
  getCsrfToken
}                              from '../services/axiosClient';
import { decodeJWT }           from '../utils/jwtUtils';
import { restoreSession }      from '../modules/auth/authSlice';
import { setTenant }           from '../modules/tenant/tenantSlice';

const useAppInit = () => {
  const dispatch              = useDispatch();
  const [restoring, setRestoring] = useState(true);

  // ── 1. Fetch CSRF token ──────────────────────────────
  const fetchCsrf = async () => {
    try {
      const res = await axiosClient.get('/csrf-token');
      setCsrfToken(res.data.data.csrf_token);
      
    } catch {
      console.warn('CSRF fetch failed');
    }
  };


  // ── 2. Restore user session from token ───────────────
  const restoreFromToken = (payload) => {
    dispatch(restoreSession({
      user_id:   payload.user_id,
      role:      payload.role,
      tenant_id: payload.tenant_id,
    }));
    dispatch(setTenant({ tenant_id: payload.tenant_id }));
  };

  // ── 3. Try refresh token ─────────────────────────────
  const tryRefresh = async () => {
    try {
      const res      = await axiosClient.post('/refresh-token');
      const newToken = res.data.data.access_token;
      const payload  = decodeJWT(newToken);
      if (!payload) throw new Error('Invalid token');
      setAccessToken(newToken);
      restoreFromToken(payload);
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('logged');
    }
  };

  // ── 4. Check existing token ──────────────────────────
  const checkToken = async () => {
    try {
      const token = getAccessToken();
      if (!token) return;

      const payload = decodeJWT(token);
      if (!payload) throw new Error('Invalid token');

      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        await tryRefresh();
      } else {
        restoreFromToken(payload);
      }
    } catch {
      localStorage.removeItem('access_token');
      localStorage.removeItem('logged');
    }
  };

  // ── 5. Run on page load ──────────────────────────────
  useEffect(() => {
    const initialize = async () => {
      await fetchCsrf();
      await checkToken();
      setRestoring(false);
    };
    initialize();
  }, []);

  return { restoring };
};

export default useAppInit;