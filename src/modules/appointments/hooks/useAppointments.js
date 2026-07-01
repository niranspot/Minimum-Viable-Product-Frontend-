import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAppointmentsRequest,
  createAppointmentRequest,
  updateAppointmentRequest,
  clearAppointmentStatus,
} from '../appointmentSlice';

const useAppointments = () => {
  const dispatch = useDispatch();
  const {
    list, loading, error, success,
    isOnline, queue, syncing,
  } = useSelector((s) => s.appointments);

  const fetchAppointments  = ()         => dispatch(fetchAppointmentsRequest());
  const createAppointment  = (data)     => dispatch(createAppointmentRequest(data));
  const updateAppointment  = (id, data) => dispatch(updateAppointmentRequest({ id, data }));
  const clearStatus        = ()         => dispatch(clearAppointmentStatus());

  return {
    list, loading, error, success,
    isOnline, queue, syncing,
    fetchAppointments, createAppointment, updateAppointment, clearStatus,
  };
};

export default useAppointments;