import { useDispatch, useSelector } from "react-redux";
import {
  fetchBillingRequest,
  createBillingRequest,
  updateBillingStatusRequest,
  clearBillingError,
} from "../billingSlice";

const useBilling = () => {
  const dispatch = useDispatch();
  const { list, loading, error, actionLoading, actionError } = useSelector(
    (state) => state.billing,
  );

  const fetchBilling = () => {
    dispatch(fetchBillingRequest());
  };

  const createBilling = (data) => {
    dispatch(createBillingRequest(data));
  };

  const updateBillingStatus = (id, status) => {
    dispatch(updateBillingStatusRequest({ id, status }));
  };

  const clearError = () => {
    dispatch(clearBillingError());
  };

  return {
    list,
    loading,
    error,
    actionLoading,
    actionError,
    fetchBilling,
    createBilling,
    updateBillingStatus,
    clearError,
  };
};

export default useBilling;
