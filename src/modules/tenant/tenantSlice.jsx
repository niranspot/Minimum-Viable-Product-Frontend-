import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tenant_id:      null,
  company_name:   null,
  subdomain:      null,
  plan:           null,
  status:         null,
  theme_settings: null,
  loading:        false,
  error:          null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    fetchTenantRequest: (state) => {
      state.loading = true;
      state.error   = null;
    },
    fetchTenantSuccess: (state, action) => {
      state.loading       = false;
      state.tenant_id     = action.payload.tenant_id;
      state.company_name  = action.payload.company_name;
      state.subdomain     = action.payload.subdomain;
      state.plan          = action.payload.plan;
      state.status        = action.payload.status;
      state.theme_settings = action.payload.theme_settings;
    },
    fetchTenantFailure: (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    },
    setTenant: (state, action) => {
      state.tenant_id    = action.payload.tenant_id;
      state.company_name = action.payload.company_name;
      state.subdomain    = action.payload.subdomain;
      state.plan         = action.payload.plan;
      state.status       = action.payload.status;
    },
    clearTenant: (state) => {
      Object.assign(state, initialState);
    },
   //theme
    updateThemeRequest: (state) => {
      state.loading = true;
    },
    updateThemeSuccess: (state, action) => {
      state.loading = false;
      state.theme_settings = action.payload.theme_settings;
    },
    updateThemeFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchTenantRequest, fetchTenantSuccess,
  fetchTenantFailure, setTenant, clearTenant,
   updateThemeRequest, updateThemeSuccess, updateThemeFailure
} = tenantSlice.actions;

export default tenantSlice.reducer;