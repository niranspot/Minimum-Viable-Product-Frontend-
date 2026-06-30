import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import DashboardPage from '../pages/Dashboard/DashboardPage';

const DashboardIndexGate = () => {
  const { user } = useSelector(state => state.auth);
  if (user?.role === 'patient') return <Navigate to="/dashboard/appointments" replace />;
  return <DashboardPage />;
};

export default DashboardIndexGate;