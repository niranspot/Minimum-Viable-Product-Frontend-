import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPatientsRequest,
  fetchPatientByIdRequest,
  createPatientRequest,
  updatePatientRequest,
  deletePatientRequest,
  clearPatientStatus,
} from '../patientSlice';

const usePatients = () => {
  const dispatch = useDispatch();
  const { list, current, loading, error, success } = useSelector((state) => state.patients);

  const fetchPatients     = ()         => dispatch(fetchPatientsRequest());
  const fetchPatientById  = (id)       => dispatch(fetchPatientByIdRequest(id));
  const createPatient     = (data)     => dispatch(createPatientRequest(data));
  const updatePatient     = (id, data) => dispatch(updatePatientRequest({ id, data }));
  const deletePatient     = (id)       => dispatch(deletePatientRequest(id));
  const clearStatus       = ()         => dispatch(clearPatientStatus());

  return {
    list, current, loading, error, success,
    fetchPatients, fetchPatientById, createPatient, updatePatient, deletePatient, clearStatus,
  };
};

export default usePatients;
