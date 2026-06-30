import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ROLE_HOME = {
  patient: '/dashboard/appointments',
  admin: '/dashboard', doctor: '/dashboard', nurse: '/dashboard',
  pharmacist: '/dashboard', receptionist: '/dashboard',
};

const RoleGate = ({ children, roles }) => {
  const { user } = useSelector(state => state.auth);
  const role = user?.role;
  if (!roles.includes(role)) return <Navigate to={ROLE_HOME[role] || '/login'} replace />;
  return children;
};

export default RoleGate;