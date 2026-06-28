import styled from 'styled-components';

export const SidebarWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'open',
})`
  width: ${({ open }) => (open ? '240px' : '64px')};
  min-height: 100vh;
  background: ${({ theme }) => theme.sidebarBg};
  transition: width 0.25s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1200;
`;

export const LogoText = styled.span`
  font-weight: 700;
  font-size: 16px;
  color: ${({ theme }) => theme.sidebarText};
  white-space: nowrap;
`;

export const SectionLabel = styled.span`
  padding: 0 16px;
  color: rgba(255,255,255,0.35);
  letter-spacing: 1px;
  font-size: 10px;
  display: block;
`;

export const MenuLabel = styled.span.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})`
  font-size: 13px;
  font-weight: ${({ active }) => (active ? 600 : 400)};
  color: ${({ active }) => (active ? '#FFFFFF' : 'rgba(255,255,255,0.65)')};
  white-space: nowrap;
`;

export const UserName = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.sidebarText};
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const UserRole = styled.span`
  font-size: 11px;
  color: rgba(255,255,255,0.4);
  display: block;
`;

export const Avatar = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #3B82F6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #ffffff;
  flex-shrink: 0;
`;