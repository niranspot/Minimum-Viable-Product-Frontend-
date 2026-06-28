import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box, List, ListItemButton, ListItemIcon,
  ListItemText, IconButton, Tooltip, Divider
} from '@mui/material';
import ChevronLeftIcon   from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon  from '@mui/icons-material/ChevronRight';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import styled            from 'styled-components';
import { menuItems }     from './menuConfig';
import { useSelector }   from 'react-redux';
import {
  SidebarWrapper,
  LogoText,
  SectionLabel,
  MenuLabel,
  UserName,
  UserRole,
  Avatar,
} from '../../styles/sidebar.styles';

const OPEN   = 240;
const CLOSED = 64;


// ──────────────────────────────────────────────────────────────

const Sidebar = ({ open, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const role     = user?.role || '';
  const allowed  = menuItems.filter((i) => i.roles.includes(role));

  return (
    <SidebarWrapper open={open}>

      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'space-between' : 'center',
          px: open ? 2 : 0,
          py: 1.5,
        }}
      >
        {open && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalHospitalIcon sx={{ color: '#3B82F6', fontSize: 26 }} />
            <LogoText>Healthcare</LogoText>
          </Box>
        )}
        <IconButton onClick={onToggle} size="small" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* Menu */}
      <Box sx={{flex:1, overflow:"hidden", mt:1}}>
        {open && <SectionLabel>MAIN</SectionLabel>}

        <List dense sx={{ px: open ? 1 : 0.5, mt: 0.5 }}>
          {allowed.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Tooltip key={item.key} title={!open ? item.label : ''} placement="right">
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.3,
                    py: 1,
                    justifyContent: open ? 'flex-start' : 'center',
                    px: open ? 1.5 : 1,
                    minWidth: 0,
                    backgroundColor: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                    borderLeft: active ? '3px solid #3B82F6' : '3px solid transparent',
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: active ? '#3B82F6' : 'rgba(255,255,255,0.5)',
                      minWidth: open ? 34 : 'unset',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {open && (
                    <ListItemText
                      disableTypography
                      primary={<MenuLabel active={active}>{item.label}</MenuLabel>}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />

      {/* User info bottom */}
      <Box
        sx={{
          px: open ? 2 : 0,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          gap: 1,
        }}
      >
        <Avatar>
          {user?.role?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        {open && (
          <Box sx={{ overflow: 'hidden' }}>
            <UserName>
              {user?.role
                ? user.role.charAt(0).toUpperCase() + user.role.slice(1) + ' User'
                : 'User'}
            </UserName>
            <UserRole>{user?.role}</UserRole>
          </Box>
        )}
      </Box>

    </SidebarWrapper>
  );
};

export default Sidebar;