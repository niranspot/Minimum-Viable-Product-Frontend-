import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardRequest } from '../dashboardSlice';

const useDashboard = () => {
  const dispatch = useDispatch();
  const { summary, appointments, prescriptions, loading, error } =
    useSelector((s) => s.dashboard);

  const fetchDashboard = () => dispatch(fetchDashboardRequest());

  return { summary, appointments, prescriptions, loading, error, fetchDashboard };
};

export default useDashboard;
