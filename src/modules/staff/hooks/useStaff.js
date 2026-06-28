import { useDispatch, useSelector } from "react-redux";
import {
  fetchStaffRequest,
  createStaffRequest,
  updateStaffRequest,
  deleteStaffRequest,
  clearStaffError,
} from "../staffSlice";

const useStaff = () => {
  const dispatch = useDispatch();
  const { list, loading, error, actionLoading, actionError } = useSelector(
    (state) => state.staff,
  );

  const fetchStaff = () => {
    dispatch(fetchStaffRequest());
  };

  const createStaff = (data) => {
    dispatch(createStaffRequest(data));
  };

  const updateStaff = (id, data) => {
    dispatch(updateStaffRequest({ id, data }));
  };

  const deleteStaff = (id) => {
    dispatch(deleteStaffRequest(id));
  };

  const clearError = () => {
    dispatch(clearStaffError());
  };

  return {
    list,
    loading,
    error,
    actionLoading,
    actionError,
    fetchStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    clearError,
  };
};

export default useStaff;
