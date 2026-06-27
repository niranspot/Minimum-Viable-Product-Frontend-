import { useSelector } from 'react-redux';

const useTenant = () => {
  const { tenant_id, name, code, status } = useSelector(
    (state) => state.tenant
  );

  return { tenant_id, name, code, status };
};

export default useTenant;