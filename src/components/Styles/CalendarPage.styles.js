import styled from 'styled-components';
import EventIcon from '@mui/icons-material/Event';

export const Hero = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  min-height: 230px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  padding: 36px 40px;
  background-image:
    linear-gradient(120deg, rgba(229,62,62,0.92) 10%, rgba(229,62,62,0.55) 60%, rgba(229,62,62,0.15) 100%),
    url('https://source.unsplash.com/1600x500/?calendar,schedule,clinic');
  background-size: cover;
  background-position: center;
`;

export const HeroShield = styled(EventIcon)`
  position: absolute !important;
  right: 36px;
  bottom: 28px;
  font-size: 64px !important;
  color: rgba(255,255,255,0.18);
`;

export const HeroText = styled.div`
  color: #fff;
  max-width: 600px;
  position: relative;
  z-index: 1;
`;

export const HeroBadges = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

export const HeroBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(6px);
  border-radius: 10px;
  padding: 8px 14px;
  font-size: 12.5px;
  font-weight: 600;
  color: #fff;
`;

export const PageWrapper = styled.div`
  background: ${({ theme }) => theme.bg};
  min-height: 100%;
`;

export const CalendarCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.divider};
  border-radius: 12px;
  padding: 20px;
  position: relative;

  .ant-picker-calendar {
    background: transparent;
  }
`;

export const LegendRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  align-items: center;
  justify-content: space-between;
`;

export const LegendChips = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const EventPopover = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.divider};
  border-radius: 14px;
  margin-top: 20px;
  overflow: hidden;
`;

export const EventPopoverHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(120deg, rgba(229,62,62,0.08), rgba(229,62,62,0.02));
  border-bottom: 1px solid ${({ theme }) => theme.divider};
`;

export const EventPopoverBody = styled.div`
  padding: 8px 20px 16px;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 36px 0 28px;
  color: ${({ theme }) => theme.textMuted};
`;

export const AppointmentRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 14px;
  margin: 8px 0;
  border-radius: 12px;
  background: ${({ theme }) => theme.bg};
  border: 1px solid ${({ theme }) => theme.divider};
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateX(2px);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.06);
  }
`;

export const TimeBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  padding: 8px 6px;
  border-radius: 10px;
  background: ${({ bg }) => bg};
  color: ${({ color }) => color};
  font-weight: 800;
  font-size: 13px;
  line-height: 1.2;
`;