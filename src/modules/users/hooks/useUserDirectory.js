import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsersRequest, updateStatusRequest } from '../userSlice';

export const useUserDirectory = () => {
  const dispatch = useDispatch();
  const { list, loading, updating } = useSelector(state => state.users);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // UI Anchor / Feedback States
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Initial Fetch
  useEffect(() => {
    dispatch(fetchUsersRequest());
  }, [dispatch]);

  // Actions
  const handleRefresh = () => {
    dispatch(fetchUsersRequest());
  };

  const handleToggleStatus = (user) => {
    if (!user) return;
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    dispatch(updateStatusRequest({ id: user.id, status: newStatus }));
    setSnackbar({
      open: true,
      message: `${user.name}'s access has been ${newStatus === 'active' ? 'authorized' : 'suspended'}`,
      severity: newStatus === 'active' ? 'success' : 'warning'
    });
  };

  const handleMenuOpen = (event, user) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedUser(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Derived State: Filtering Logic
  const filteredUsers = (list || []).filter(user => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = user.name?.toLowerCase().includes(search) || user.email?.toLowerCase().includes(search);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Derived State: Computing Metrics
  const stats = {
    total: list?.length || 0,
    active: list?.filter(u => u.status === 'active').length || 0,
    inactive: list?.filter(u => u.status === 'inactive').length || 0,
    doctors: list?.filter(u => u.role === 'doctor').length || 0,
  };

  return {
    // States & Setters
    loading,
    updating,
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    filterStatus,
    setFilterStatus,
    menuAnchorEl,
    selectedUser,
    snackbar,
    
    // Computed Values
    filteredUsers,
    stats,
    totalCount: list?.length || 0,

    // Handlers
    handleRefresh,
    handleToggleStatus,
    handleMenuOpen,
    handleMenuClose,
    handleCloseSnackbar
  };
};