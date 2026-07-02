import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPatientsRequest,
  fetchPatientByIdRequest,
  createPatientRequest,
  updatePatientRequest,
  deletePatientRequest,
  clearPatientStatus,
  fetchDropdownListsRequest,
} from '../patientSlice';

const usePatients = () => {
  const dispatch = useDispatch();
  const { list, current, loading, error, success, patients } = useSelector((state) => state.patients);

  const fetchPatients     = ()         => dispatch(fetchPatientsRequest());
  const fetchPatientById  = (id)       => dispatch(fetchPatientByIdRequest(id));
  const createPatient     = (data)     => dispatch(createPatientRequest(data));
  const updatePatient     = (id, data) => dispatch(updatePatientRequest({ id, data }));
  const deletePatient     = (id)       => dispatch(deletePatientRequest(id));
    const fetchDropdownLists  = (role)         => dispatch(fetchDropdownListsRequest(role));
  const clearStatus       = ()         => dispatch(clearPatientStatus());

  return {
    list, current, loading, error, success,
    fetchPatients, fetchPatientById, createPatient, updatePatient, deletePatient, clearStatus, fetchDropdownLists, patients
  };
};

export default usePatients;