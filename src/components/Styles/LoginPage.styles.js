import styled, { keyframes } from 'styled-components';
import { Card } from '@mui/material';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  background: ${({ theme }) => theme.bg};
  transition: background .3s ease;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ImageSide = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  min-height: 300px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(21, 101, 192, 0.85) 0%,
      rgba(0, 60, 143, 0.75) 50%,
      rgba(26, 26, 46, 0.9) 100%
    );
  }

  @media (max-width: 768px) {
    min-height: 200px;
    flex: none;
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 48px;

  @media (max-width: 768px) {
    padding: 24px;
    justify-content: flex-end;
  }
`;

export const ImageTitle = styled.h1`
  font-size: clamp(28px, 3vw, 48px);
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin: 0 0 16px;
  span { color: #60A5FA; }
`;

export const ImageSub = styled.p`
  font-size: 16px;
  color: rgba(255,255,255,0.75);
  line-height: 1.6;
  margin: 0 0 32px;
  max-width: 400px;
`;

export const ImageStats = styled.div`
  display: flex;
  gap: 32px;
  flex-wrap: wrap;
`;

export const ImageStat = styled.div`
  .value {
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    display: block;
  }
  .label {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`;

export const FormSide = styled.div`
  width: 480px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  transition: background .3s ease;
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 768px) {
    width: 100%;
    padding: 32px 24px;
  }
`;

export const FormInner = styled.div`
  width: 100%;
  max-width: 380px;
`;

export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

export const StyledCard = styled(Card)`
  width: 100%;
  max-width: 440px;
  border-radius: 16px !important;
  background: ${({theme})=>theme.surface};
  border:1px solid ${({theme})=>theme.divider};

  box-shadow:${({theme}) =>
    theme.bg === '#0D1117'
      ? '0 20px 60px rgba(0,0,0,.5)'
      : '0 20px 60px rgba(0,0,0,.08)'};
`;

export const AuthPageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #1565C0 0%, #003C8F 60%, #1A1A2E 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 16px 0;
  color: ${({ theme }) => theme.textMuted};
  font-size: 13px;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.divider};
  }
`;