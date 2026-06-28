import styled from 'styled-components';
import { Card } from '@mui/material';


export const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1565C0 0%, #003C8F 60%, #1A1A2E 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const StyledCard = styled(Card)`
  width: 100%;
  max-width: 420px;
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3) !important;
`;

export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 8px;
`;