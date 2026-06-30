import { useSelector } from 'react-redux';
import { getSubdomain } from '../../../utils/tenantUtils';

const useTenant = () => {
  const tenant     = useSelector((state) => state.tenant);
  const subdomain  = getSubdomain();
  const isTenant   = !!subdomain;

  return {
    ...tenant,
    subdomain: subdomain || tenant.subdomain,
    isTenant,  // true if on tenant subdomain
  };
};

export default useTenant;