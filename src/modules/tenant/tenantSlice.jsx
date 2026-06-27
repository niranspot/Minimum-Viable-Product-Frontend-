import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tenant_id: null,
  name: null,
  code: null,
  status: null,
  loading: false,
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
    setTenant: (state, action) => {
      state.tenant_id = action.payload.tenant_id;
      state.name = action.payload.name || null;
      state.code = action.payload.code || null;
      state.status = action.payload.status || 'active';
      state.loading = false;
      state.error = null;
    },
    clearTenant: (state) => {
      state.tenant_id = null;
      state.name = null;
      state.code = null;
      state.status = null;
    },
  },
});

export const { setTenant, clearTenant } = tenantSlice.actions;
export default tenantSlice.reducer;