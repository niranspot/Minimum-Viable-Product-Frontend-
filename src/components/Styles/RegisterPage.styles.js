import styled, { keyframes } from 'styled-components';

export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(15px); }
  to   { opacity: 1; transform: translateY(0); }
`;

// ── Screen Wrapper: strictly locked to 100vh and prevents screen scrolling ──
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
    overflow: auto;
  }
`;

// ── Left Side Image Section ──
export const ImageSide = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  height: 100%;

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

  @media (max-width: 900px) {
    height: 250px;
    flex: none;
  }
`;

export const ImageOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;

  @media (max-width: 900px) {
    padding: 24px;
    justify-content: flex-end;
  }
`;

export const ImageTitle = styled.h1`
  font-size: clamp(24px, 2.5vw, 38px);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.25;
  margin: 0 0 12px;
  
  span { color: #60A5FA; }
`;

export const ImageSub = styled.p`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
  margin: 0 0 24px;
  max-width: 420px;
`;

// ── Right Side Form Side: Handles inner scroll safely if viewport gets tiny ──
export const FormSide = styled.div`
  width: 480px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 30px 40px; 
  background: ${props => props.theme.surface};
  border-left: 1px solid ${props => props.theme.divider};
  overflow-y: auto; 
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 900px) {
    width: 100%;
    height: auto;
    padding: 32px 24px;
    border-left: none;
  }
`;

export const FormInner = styled.div`
  width: 100%;
  max-width: 380px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  height: 100%;
  justify-content: space-between; 
`;

export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
`;