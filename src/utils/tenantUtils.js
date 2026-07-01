// Read subdomain from browser URL
// acme.localhost → 'acme'
// medicloud.localhost → null (main site)
// localhost → null (no tenant)

export const getSubdomain = () => {
  const host  = window.location.hostname; // e.g. acme.localhost
  const parts = host.split('.');

  // localhost only → no tenant
  if (parts.length === 1) return null;

  const sub = parts[0].toLowerCase();

  // Ignore main site subdomains
  const ignored = ['www', 'api', 'medicloud', 'localhost', 'lvh'];
  if (ignored.includes(sub)) return null;

  return sub; // → 'acme'
};

// Build API base URL per tenant
export const getTenantApiBase = () => {
  const sub = getSubdomain();
  if (!sub) return null;
  return process.env.REACT_APP_TENANT_API_BASE;
};