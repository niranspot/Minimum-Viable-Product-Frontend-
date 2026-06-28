import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPatientsRequest,
  createPatientRequest,
  updatePatientRequest,
  deletePatientRequest,
  clearPatientStatus,
} from '../patientSlice';

const usePatients = () => {
  const dispatch = useDispatch();
  const { list, loading, error, success } = useSelector((state) => state.patients);

  const fetchPatients  = ()           => dispatch(fetchPatientsRequest());
  const createPatient  = (data)       => dispatch(createPatientRequest(data));
  const updatePatient  = (id, data)   => dispatch(updatePatientRequest({ id, data }));
  const deletePatient  = (id)         => dispatch(deletePatientRequest(id));
  const clearStatus    = ()           => dispatch(clearPatientStatus());

  return { list, loading, error, success, fetchPatients, createPatient, updatePatient, deletePatient, clearStatus };
};

export default usePatients;