import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardRequest, fetchTenantAnalyticsRequest } from '../dashboardSlice';

const useDashboard = () => {
  const dispatch = useDispatch();
  const { summary, appointments, prescriptions, tenantAnalytics, loading, error } =
    useSelector((s) => s.dashboard);

  const fetchDashboard       = () => dispatch(fetchDashboardRequest());
  const fetchTenantAnalytics = () => dispatch(fetchTenantAnalyticsRequest());

  return { summary, appointments, prescriptions, tenantAnalytics, loading, error, fetchDashboard, fetchTenantAnalytics };
};

export default useDashboard;