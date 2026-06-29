import styled, { keyframes } from 'styled-components';
import { Card } from '@mui/material';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ── Fixed Global Navigation Layer ──────────────────────
export const AuthNavbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 40px;
  background: transparent;
  z-index: 10;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }

  @media (max-width: 900px) {
    position: absolute;
    padding: 0 24px;
  }
`;

// ── Split screen wrapper (Used by Login) ───────────────
export const PageWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  overflow: hidden;
  background: ${props => props.theme.bg};
  transition: background 0.3s ease;

  @media (max-width: 900px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
    overflow: initial;
  }
`;

// ── Left side — hospital image ─────────────────────────
export const ImageSide = styled.div`
  flex: 1.2;
  position: relative;
  overflow: hidden;
  height: 100%;
  display: flex;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    position: absolute;
    inset: 0;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(21, 101, 192, 0.9) 0%,
      rgba(0, 60, 143, 0.8) 50%,
      rgba(15, 23, 42, 0.95) 100%
    );
  }

  @media (max-width: 900px) {
    height: 300px;
    min-height: 300px;
    flex: none;
  }
`;

// ── Text on top of image ───────────────────────────────
export const ImageOverlay = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 64px;
  width: 100%;

  @media (max-width: 900px) {
    padding: 32px;
    justify-content: flex-end;
    gap: 20px;
  }
`;

export const ImageTitle = styled.h1`
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.25;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
  
  span { color: #60A5FA; }`;

export const ImageSub = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0 0 40px;
  max-width: 460px;
`;

export const ImageStats = styled.div`
  display: flex;
  gap: 40px;
  flex-wrap: wrap;
  margin-top: auto;
  backdrop-filter: blur(4px);
  background: rgba(255, 255, 255, 0.03);
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 900px) {
    display: none;
  }
`;

export const ImageStat = styled.div`
  .value {
    font-size: 32px;
    font-weight: 800;
    color: #ffffff;
    display: block;
  }
  .label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    margin-top: 4px;
  }
`;

// ── Right side — form container ─────────────────────────
export const FormSide = styled.div`
  width: 520px;
  height: 100%;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  background: ${props => props.theme.surface};
  border-left: 1px solid ${props => props.theme.divider};
  transition: background 0.3s ease, border 0.3s ease;
  animation: ${fadeIn} 0.55s cubic-bezier(0.16, 1, 0.3, 1);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.divider};
    border-radius: 4px;
  }

  @media (max-width: 1200px) {
    width: 460px;
  }

  @media (max-width: 900px) {
    width: 100%;
    height: auto;
    overflow-y: visible;
    padding: 40px 24px;
    border-left: none;
  }
`;

export const FormInner = styled.div`
  width: 100%;
  max-width: 400px;
`;

export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
`;

// ── Centered Card Styles (Used by Register) ─────────────
export const StyledCard = styled(Card)`
  width: 100%;
  max-width: 460px;
  border-radius: 16px !important;
  background: ${props => props.theme.surface} !important;
  border: 1px solid ${props => props.theme.divider} !important;
  box-shadow: 0 20px 40px rgba(0,0,0,0.08) !important;
`;

export const AuthPageWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: ${props => props.theme.bg};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  transition: background 0.3s ease;
`;