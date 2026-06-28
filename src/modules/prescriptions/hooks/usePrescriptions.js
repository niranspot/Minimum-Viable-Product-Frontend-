import { useDispatch, useSelector } from "react-redux";
import {
  fetchPrescriptionsRequest,
  createPrescriptionRequest,
  updatePrescriptionRequest,
  updatePrescriptionStatusRequest,
  deletePrescriptionRequest,
  clearPrescriptionError,
} from "../prescriptionSlice";

const usePrescriptions = () => {
  const dispatch = useDispatch();
  const { list, loading, error, actionLoading, actionError } = useSelector(
    (state) => state.prescriptions,
  );

  const fetchPrescriptions = () => {
    dispatch(fetchPrescriptionsRequest());
  };

  const createPrescription = (data) => {
    dispatch(createPrescriptionRequest(data));
  };

  const updatePrescription = (id, data) => {
    dispatch(updatePrescriptionRequest({ id, data }));
  };

  const updatePrescriptionStatus = (id, status) => {
    dispatch(updatePrescriptionStatusRequest({ id, status }));
  };

  const deletePrescription = (id) => {
    dispatch(deletePrescriptionRequest(id));
  };

  const clearError = () => {
    dispatch(clearPrescriptionError());
  };

  return {
    list,
    loading,
    error,
    actionLoading,
    actionError,
    fetchPrescriptions,
    createPrescription,
    updatePrescription,
    updatePrescriptionStatus,
    deletePrescription,
    clearError,
  };
};

export default usePrescriptions;
