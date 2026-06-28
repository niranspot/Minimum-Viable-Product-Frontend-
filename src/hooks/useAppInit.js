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

const useAppInit = () => {
  const dispatch = useDispatch();
  // Read straight from the auth slice — the same source of truth that
  // ProtectedRoute reads from. This guarantees "restoring" can only flip
  // to false in the same (or a later) state update than isAuthenticated,
  // so ProtectedRoute can never see a stale "not authenticated" in between.
  const sessionChecked = useSelector((state) => state.auth.sessionChecked);

  // ── 1. Fetch CSRF token ──────────────────────────────
  const fetchCsrf = async () => {
    try {
      const res = await axiosClient.get("/csrf-token");
      setCsrfToken(res.data.data.csrf_token);
    } catch {
      console.warn("CSRF fetch failed");
    }
  };

  // ── 2. Restore user session from token ───────────────
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

  // ── 3. Try refresh token ─────────────────────────────
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

  // ── 4. Check existing token ──────────────────────────
  const checkToken = async () => {
    try {
      const token = getAccessToken();
      if (!token) return;

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

  // ── 5. Run on page load ──────────────────────────────
  useEffect(() => {
    const initialize = async () => {
      await fetchCsrf();
      await checkToken();
      // Dispatched after restoreSession (if any) above, so both land in the
      // same state update — ProtectedRoute never reads sessionChecked=true
      // alongside a stale isAuthenticated=false.
      dispatch(sessionCheckComplete());
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { restoring: !sessionChecked };
};

export default useAppInit;
