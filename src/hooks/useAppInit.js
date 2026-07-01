import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosClient, {
  getAccessToken,
  setAccessToken,
  setCsrfToken,
} from "../services/axiosClient";
import { decodeJWT } from "../utils/jwtUtils";
import {
  restoreSession,
  sessionCheckComplete,
} from "../modules/auth/authSlice";
import { setTenant } from "../modules/tenant/tenantSlice";
import { fetchTenantRequest } from '../modules/tenant/tenantSlice';
import { getSubdomain }       from '../utils/tenantUtils';

// ── Standalone CSRF fetcher — call this from DashboardLayout ──
export const fetchCsrf = async () => {
  try {
    const res = await axiosClient.get("/csrf-token");
    setCsrfToken(res.data.data.csrf_token);
  } catch {
    console.warn("CSRF fetch failed");
  }
};

const useAppInit = () => {
  const dispatch = useDispatch();
  const sessionChecked = useSelector((state) => state.auth.sessionChecked);

  const restoreFromToken = (payload) => {
    dispatch(
      restoreSession({
        user_id: payload.user_id,
        role: payload.role,
        tenant_id: payload.tenant_id,
      }),
    );
    dispatch(setTenant({ tenant_id: payload.tenant_id }));
  };

  const tryRefresh = async () => {
    try {
      const res = await axiosClient.post("/refresh-token");
      const newToken = res.data.data.access_token;
      const payload = decodeJWT(newToken);
      if (!payload) throw new Error("Invalid token");
      setAccessToken(newToken);
      restoreFromToken(payload);
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("logged");
    }
  };

  const checkToken = async () => {
    try {
      const token = getAccessToken();
      const logged = localStorage.getItem('logged');

      if (!token && !logged) return;

      if (!token && logged) {
        await tryRefresh();
        return;
      }

      const payload = decodeJWT(token);
      if (!payload) throw new Error("Invalid token");

      const isExpired = payload.exp * 1000 < Date.now();

      if (isExpired) {
        await tryRefresh();
      } else {
        restoreFromToken(payload);
      }
    } catch {
      localStorage.removeItem("access_token");
      localStorage.removeItem("logged");
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchCsrf();
      await checkToken();
      const subdomain = getSubdomain();
      if (subdomain) {
        dispatch(fetchTenantRequest());
      }
      dispatch(sessionCheckComplete());
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { restoring: !sessionChecked };
};

export default useAppInit;