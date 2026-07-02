import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAppointmentsRequest,
  createAppointmentRequest,
  updateAppointmentRequest,
  clearAppointmentStatus,
  fetchDropdownListsRequest,
} from '../appointmentSlice';

const useAppointments = () => {
  const dispatch = useDispatch();
  const {
    list, loading, error, success,
    isOnline, queue, syncing, doctors, patients,
  } = useSelector((s) => s.appointments);

  const fetchAppointments  = ()         => dispatch(fetchAppointmentsRequest());
  const createAppointment  = (data)     => dispatch(createAppointmentRequest(data));
  const updateAppointment  = (id, data) => dispatch(updateAppointmentRequest({ id, data }));
  const clearStatus        = ()         => dispatch(clearAppointmentStatus());
  const fetchDropdownLists  = (role)         => dispatch(fetchDropdownListsRequest(role));

  return {
    list, loading, error, success,
    isOnline, queue, syncing,patients,doctors,
    fetchAppointments, createAppointment, updateAppointment, clearStatus, fetchDropdownLists,
  };
};

export default useAppointments;