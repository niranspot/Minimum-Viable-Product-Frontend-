import { useDispatch, useSelector } from "react-redux";
import {
  fetchBillingRequest,
  createBillingRequest,
  updateBillingStatusRequest,
  retryOfflineQueueRequest,
  removeQueuedItem,
  clearBillingError,
} from "../billingSlice";

const useBilling = () => {
  const dispatch = useDispatch();
  const {
    list,
    loading,
    error,
    actionLoading,
    actionError,
    isOnline,
    offlineQueue,
    offlineQueueHydrated,
    syncing,
  } = useSelector((state) => state.billing);

  const fetchBilling = () => {
    dispatch(fetchBillingRequest());
  };

  // Same call site as before — the saga transparently queues this
  // instead of hitting the API when the browser is offline.
  const createBilling = (data) => {
    dispatch(createBillingRequest(data));
  };

  const updateBillingStatus = (id, status) => {
    dispatch(updateBillingStatusRequest({ id, status }));
  };

  // Manually re-attempt syncing the offline queue (e.g. a "Retry" button
  // shown next to items that failed to sync for a non-network reason).
  const retrySync = () => {
    dispatch(retryOfflineQueueRequest());
  };

  const discardQueuedItem = (localId) => {
    dispatch(removeQueuedItem(localId));
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
    isOnline,
    offlineQueue,
    offlineQueueHydrated,
    syncing,
    fetchBilling,
    createBilling,
    updateBillingStatus,
    retrySync,
    discardQueuedItem,
    clearError,
  };
};

export default useBilling;