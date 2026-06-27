import { useDispatch, useSelector } from 'react-redux';
import {
  loginRequest,
  logoutRequest,
  clearError,
} from '../authSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  const login = (email, password) => {
    dispatch(loginRequest({ email, password}));
  };

  const logout = () => {
    dispatch(logoutRequest());
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    clearAuthError,
  };
};

export default useAuth;