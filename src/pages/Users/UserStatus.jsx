import React from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, Switch, Chip, CircularProgress, Card, CardContent,
  Avatar, Stack, Divider, TextField, InputAdornment,
  IconButton, Tooltip, Paper, Badge as MuiBadge,
  Menu, MenuItem, ListItemIcon, ListItemText, Alert, Snackbar,
  LinearProgress
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  LocalHospital, Person, AdminPanelSettings,
  Search, Refresh, MoreVert, CheckCircle, Cancel,
  MedicationLiquid
} from '@mui/icons-material';
import { useUserDirectory } from '../../modules/users/hooks/useUserDirectory'; // Adjust file path as needed

// A clean helper mapping that resolves using the theme object dynamically
const getRoleDetails = (role, theme) => {
  const roles = {
    doctor: {
      color: theme.palette.teal?.main || '#0d9488', // Fallback to original teal if not defined in your custom palette
      icon: <LocalHospital fontSize="small" />,
      label: 'Doctor'
    },
    nurse: {
      color: theme.palette.primary.main,
      icon: <Person fontSize="small" />,
      label: 'Nurse'
    },
    admin: {
      color: theme.palette.error.main,
      icon: <AdminPanelSettings fontSize="small" />,
      label: 'Admin'
    },
    pharmacist: {
      color: theme.palette.warning.main,
      icon: <MedicationLiquid fontSize="small" />,
      label: 'Pharmacist'
    },
  };

  return roles[role] || {
    color: theme.palette.text.disabled,
    icon: <Person fontSize="small" />,
    label: role || 'Staff'
  };
};

const ROLE_FILTERS = ['doctor', 'nurse', 'admin', 'pharmacist'];
const ROLE_DETAILS = {
  doctor:     { icon: <LocalHospital fontSize="small" />, label: 'Doctor' },
  nurse:      { icon: <Person fontSize="small" />, label: 'Nurse' },
  admin:      { icon: <AdminPanelSettings fontSize="small" />, label: 'Admin' },
  pharmacist: { icon: <MedicationLiquid fontSize="small" />, label: 'Pharmacist' },
};

const UserStatus = () => {
  const {
    loading, updating, searchTerm, setSearchTerm,
    filterRole, setFilterRole, filterStatus, setFilterStatus,
    menuAnchorEl, selectedUser, snackbar, filteredUsers, stats, totalCount,
    handleRefresh, handleToggleStatus, handleMenuOpen, handleMenuClose, handleCloseSnackbar
  } = useUserDirectory();

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: 3 }}>
          <Stack spacing={3} alignItems="center">
            <CircularProgress size={48} thickness={4} color="primary" />
            <Typography variant="body2" color="text.secondary">Loading staff directory...</Typography>
            <LinearProgress sx={{ width: '100%', maxWidth: 400, borderRadius: 2 }} />
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <>
      <Box sx={{ p: { xs: 2, sm: 3 } }}>
        <Paper elevation={0} sx={{ borderRadius: 3, overflow: 'hidden', border: '1px solid', borderColor: 'divider', mb: 3 }}>
          <Box sx={{ p: 3, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <LocalHospital color="primary" sx={{ fontSize: 28 }} />
                  <Typography variant="h5" fontWeight={700}>Staff Directory</Typography>
                  <Chip 
                    label={`${stats.total} total`} 
                    size="small" 
                    sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', fontWeight: 600, fontSize: '0.7rem', ml: 1 }} 
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Manage staff access across your organization
                </Typography>
              </Box>
              <Tooltip title="Refresh">
                <IconButton size="small" onClick={handleRefresh}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {/* Dynamic color mappings extracted directly from theme contexts inside StatCards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(4, 1fr)' }, gap: 2, p: 3 }}>
            <StatCard icon={<Person />} label="Total Staff" value={stats.total} colorKey="primary" />
            <StatCard icon={<CheckCircle />} label="Active" value={stats.active} colorKey="success" />
            <StatCard icon={<Cancel />} label="Pending/Suspended" value={stats.inactive} colorKey="error" />
            <StatCard icon={<LocalHospital />} label="Doctors" value={stats.doctors} colorKey="info" />
          </Box>
        </Paper>

        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
          <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
              <TextField
                placeholder="Search by name or email..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ flex: 1, minWidth: { sm: 200 } }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton size="small" onClick={() => setSearchTerm('')}>
                          <Cancel fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 0.5 }}>
                <Chip label="All Roles" onClick={() => setFilterRole('all')} color={filterRole === 'all' ? 'primary' : 'default'} variant={filterRole === 'all' ? 'filled' : 'outlined'} size="small" />
                
                {/* Dynamically applying theme properties within the map array loop */}
                {ROLE_FILTERS.map(role => (
                  <Chip
                    key={role}
                    label={ROLE_DETAILS[role]?.label || role}
                    onClick={() => setFilterRole(role)}
                    color={filterRole === role ? 'primary' : 'default'}
                    variant={filterRole === role ? 'filled' : 'outlined'}
                    size="small"
                    icon={ROLE_DETAILS[role]?.icon}
                  />
                ))}

               
                
                <Divider orientation="vertical" flexItem />
                <Chip label="All Status" onClick={() => setFilterStatus('all')} color={filterStatus === 'all' ? 'primary' : 'default'} variant={filterStatus === 'all' ? 'filled' : 'outlined'} size="small" />
                <Chip label="Active" onClick={() => setFilterStatus('active')} color={filterStatus === 'active' ? 'success' : 'default'} variant={filterStatus === 'active' ? 'filled' : 'outlined'} size="small" icon={<CheckCircle fontSize="small" />} />
                <Chip label="Pending" onClick={() => setFilterStatus('inactive')} color={filterStatus === 'inactive' ? 'error' : 'default'} variant={filterStatus === 'inactive' ? 'filled' : 'outlined'} size="small" icon={<Cancel fontSize="small" />} />
              </Stack>
            </Stack>
          </Box>

          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: 'background.default' }}>
                <TableRow>
                  <TableCell>Staff Member</TableCell>
                  <TableCell>Contact</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <Stack spacing={2} alignItems="center">
                        <Person sx={{ fontSize: 48, color: 'text.disabled' }} />
                        <Typography variant="body1" color="text.secondary">No staff members found</Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => {
                    const isUserUpdating = updating === user.id;

                    return (
                      <TableRow key={user.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <MuiBadge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                <Box sx={{ 
                                  width: 10, 
                                  height: 10, 
                                  borderRadius: '50%', 
                                  bgcolor: user.status === 'active' ? 'success.main' : 'error.main', 
                                  border: '2px solid',
                                  borderColor: 'background.paper'
                                }} />
                              }
                            >
                              {/* Avatar uses a theme callback function inside sx to cleanly fetch runtime properties */}
                              <Avatar sx={(theme) => ({ 
                                bgcolor: getRoleDetails(user.role, theme).color, 
                                width: 40, 
                                height: 40, 
                                fontWeight: 600,
                                color: theme.palette.getContrastText?.(getRoleDetails(user.role, theme).color) || '#fff'
                              })}>
                                {user.name?.charAt(0).toUpperCase()}
                              </Avatar>
                            </MuiBadge>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                              <Typography variant="caption" color="text.secondary">ID: {user.id}</Typography>
                            </Box>
                          </Stack>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{user.email}</Typography>
                        </TableCell>
                        <TableCell>
                          {/* Use theme functional processing for the contextual chip background and layout styling */}
                        <Chip
                          sx={(theme) => {
                            const details = getRoleDetails(user.role, theme);
                            return {
                              bgcolor: alpha(details.color, 0.1),
                              color: details.color,
                              fontWeight: 600,
                            };
                          }}
                          icon={ROLE_DETAILS[user.role]?.icon}
                          label={ROLE_DETAILS[user.role]?.label || user.role}
                          size="small"
                        />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={user.status === 'active' ? 'Authorized' : 'Pending'}
                            size="small"
                            color={user.status === 'active' ? 'success' : 'error'}
                            sx={{ fontWeight: 600, minWidth: 90 }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                            {isUserUpdating ? (
                              <CircularProgress size={24} color="primary" />
                            ) : (
                              <>
                                <Tooltip title={user.status === 'active' ? 'Suspend Access' : 'Authorize Access'}>
                                  <Switch checked={user.status === 'active'} color="success" onChange={() => handleToggleStatus(user)} />
                                </Tooltip>
                                <Tooltip title="More Actions">
                                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                                    <MoreVert fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>

          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
            <Typography variant="caption" color="text.secondary">
              Showing {filteredUsers.length} of {totalCount} staff members
            </Typography>
          </Box>
        </Card>
      </Box>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => { handleToggleStatus(selectedUser); handleMenuClose(); }}>
          <ListItemIcon>
            {selectedUser?.status === 'active' ? <Cancel fontSize="small" color="error" /> : <CheckCircle fontSize="small" color="success" />}
          </ListItemIcon>
          <ListItemText>{selectedUser?.status === 'active' ? 'Suspend Access' : 'Authorize Access'}</ListItemText>
        </MenuItem>
      </Menu>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2, minWidth: 300 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

// Refactored StatCard component to map directly using standard MUI Theme Palette keys
const StatCard = ({ icon, label, value, colorKey }) => (
  <Box sx={(theme) => ({ 
    p: 1.5, 
    borderRadius: 2, 
    bgcolor: alpha(theme.palette[colorKey].main, 0.08), 
    border: '1px solid', 
    borderColor: alpha(theme.palette[colorKey].main, 0.2), 
    display: 'flex', 
    alignItems: 'center', 
    gap: 1.5 
  })}>
    <Box sx={(theme) => ({ 
      p: 1, 
      borderRadius: 1.5, 
      bgcolor: alpha(theme.palette[colorKey].main, 0.15), 
      color: `${colorKey}.main`, 
      display: 'flex', 
      alignItems: 'center' 
    })}>
      {icon}
    </Box>
    <Box>
      <Typography variant="h6" fontWeight={700}>{value}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
  </Box>
);

export default UserStatus;