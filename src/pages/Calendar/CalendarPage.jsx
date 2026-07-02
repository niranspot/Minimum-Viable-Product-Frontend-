import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, Chip, IconButton, Tooltip } from '@mui/material';
import { Calendar, Badge, Spin } from 'antd';
import RefreshIcon from '@mui/icons-material/Refresh';
import EventIcon from '@mui/icons-material/Event';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import dayjs       from 'dayjs';
import styled      from 'styled-components';
import useCalendar from '../../modules/calendar/hooks/useCalendar';

// ── Hero banner (Unsplash) ──────────────────────────────────────
// ── Hero banner (Unsplash) ──────────────────────────────────────
const Hero = styled.div`
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

const HeroShield = styled(EventIcon)`
  position: absolute !important;
  right: 36px;
  bottom: 28px;
  font-size: 64px !important;
  color: rgba(255,255,255,0.18);
`;

const HeroText = styled.div`
  color: #fff;
  max-width: 600px;
  position: relative;
  z-index: 1;
`;

const HeroBadges = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const HeroBadge = styled.div`
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

// ── Styled ─────────────────────────────────────────────────────
const PageWrapper = styled.div`
  background: ${({ theme }) => theme.bg};
  min-height: 100%;
`;

const CalendarCard = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.divider};
  border-radius: 12px;
  padding: 20px;
  position: relative;

  .ant-picker-calendar {
    background: transparent;
  }
`;

const LegendRow = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
  align-items: center;
  justify-content: space-between;
`;

const LegendChips = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const EventPopover = styled.div`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.divider};
  border-radius: 14px;
  margin-top: 20px;
  overflow: hidden;
`;

const EventPopoverHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(120deg, rgba(229,62,62,0.08), rgba(229,62,62,0.02));
  border-bottom: 1px solid ${({ theme }) => theme.divider};
`;

const EventPopoverBody = styled.div`
  padding: 8px 20px 16px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 36px 0 28px;
  color: ${({ theme }) => theme.textMuted};
`;

const AppointmentRow = styled.div`
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

const TimeBadge = styled.div`
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

// ── Status Configurations ──────────────────────────────────────
const badgeStatus = {
  pending:   'warning',
  confirmed: 'processing',
  completed: 'success',
  cancelled: 'error',
};

const chipStyle = {
  pending:   { bg: '#FFF3E0', color: '#E65100' },
  confirmed: { bg: '#E3F2FD', color: '#1565C0' },
  completed: { bg: '#E8F5E9', color: '#2E7D32' },
  cancelled: { bg: '#FFEBEE', color: '#C62828' },
};

const fmt = (d) => dayjs(d).format('YYYY-MM-DD');

// ── Component ──────────────────────────────────────────────────
const CalendarPage = () => {
  const { events, loading, error, fetchCalendar } = useCalendar();

  const [value, setValue]               = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(null);
  const [fetchedMonth, setFetchedMonth] = useState(null);

  // ── Fetch whenever the displayed month changes ───────────────
  useEffect(() => {
    const monthKey = value.format('YYYY-MM');
    if (monthKey === fetchedMonth) return;
    const from = value.startOf('month').format('YYYY-MM-DD');
    const to   = value.endOf('month').format('YYYY-MM-DD');
    fetchCalendar(from, to);
    setFetchedMonth(monthKey);
  }, [value, fetchedMonth, fetchCalendar]);

  const refresh = () => {
    const today = dayjs();
    setValue(today);
    setSelectedDate(today.format('YYYY-MM-DD'));

    const from = today.startOf('month').format('YYYY-MM-DD');
    const to   = today.endOf('month').format('YYYY-MM-DD');
    fetchCalendar(from, to);
    setFetchedMonth(today.format('YYYY-MM'));
  };

  // ── Build events map keyed by YYYY-MM-DD ─────────────────────
  const eventsByDate = {};
  (events || []).forEach((e) => {
    const day = fmt(e.appointment_date);
    if (!eventsByDate[day]) eventsByDate[day] = [];
    eventsByDate[day].push(e);
  });

  const selectedEvents = selectedDate ? (eventsByDate[selectedDate] || []) : [];

  const handlePanelChange = (date) => { setValue(date); };

  const handleSelect = (date, { source }) => {
    if (source === 'date') {
      setSelectedDate(date.format('YYYY-MM-DD'));
      if (!date.isSame(value, 'month')) setValue(date);
    }
  };

  // ── Cell content renderer ─────────────────────────────────────
  const cellRender = (current, info) => {
    if (info.type !== 'date') return info.originNode;
    const key  = current.format('YYYY-MM-DD');
    const list = eventsByDate[key] || [];
    if (list.length === 0) return null;
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {list.slice(0, 2).map((item, i) => (
          <li key={i} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <Badge
              status={badgeStatus[item.status] || 'default'}
              text={
                <span style={{ fontSize: 10 }}>
                  {item.doctor_name || 'Dr.'}
                  {item.patient_name ? ` — ${item.patient_name}` : ''}
                </span>
              }
            />
          </li>
        ))}
        {list.length > 2 && (
          <li style={{ fontSize: 10, color: '#718096', paddingLeft: '8px' }}>+{list.length - 2} more</li>
        )}
      </ul>
    );
  };

  return (
    <PageWrapper>
      <Hero>
  <HeroShield />
  <HeroText>
    <Typography sx={{ fontSize: 28, fontWeight: 800, mb: 1 }}>Appointment Calendar</Typography>
    <Typography sx={{ fontSize: 14.5, opacity: 0.92, lineHeight: 1.5 }}>
      Browse confirmed, pending, completed and cancelled appointments by day.
    </Typography>
    <HeroBadges>
      <HeroBadge><EventIcon style={{ fontSize: 16 }} /> Monthly View</HeroBadge>
      <HeroBadge><EventIcon style={{ fontSize: 16 }} /> Appointment View</HeroBadge>
      <HeroBadge><RefreshIcon style={{ fontSize: 16 }} /> Live Sync</HeroBadge>
    </HeroBadges>
  </HeroText>
</Hero>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Legend */}
      <LegendRow>
        <LegendChips>
          {Object.entries(chipStyle).map(([status, style]) => (
            <Chip
              key={status}
              label={status.charAt(0).toUpperCase() + status.slice(1)}
              size="small"
              sx={{ bgcolor: style.bg, color: style.color, fontWeight: 600 }}
            />
          ))}
        </LegendChips>
        <Tooltip title="Back to today">
          <span>
            <IconButton onClick={refresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </span>
        </Tooltip>
      </LegendRow>

      <CalendarCard>
        <Spin spinning={loading && !events.length} size="large" tip="Loading appointments...">
          <Calendar
            value={value}
            cellRender={cellRender}
            onPanelChange={handlePanelChange}
            onSelect={handleSelect}
          />
        </Spin>

        {/* Selected day detail */}
        {selectedDate && (
  <EventPopover>
    <EventPopoverHeader>
      <Box>
        <Typography variant="subtitle1" fontWeight={800}>
          {dayjs(selectedDate).format('D MMMM YYYY')}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {dayjs(selectedDate).format('dddd')}
        </Typography>
      </Box>
      <Chip
        label={`${selectedEvents.length} appointment${selectedEvents.length !== 1 ? 's' : ''}`}
        size="small"
        sx={{
          fontWeight: 700,
          bgcolor: selectedEvents.length ? '#FFEBEE' : '#F1F1F1',
          color: selectedEvents.length ? '#C62828' : '#718096',
        }}
      />
    </EventPopoverHeader>

    <EventPopoverBody>
      {selectedEvents.length === 0 ? (
        <EmptyState>
          <EventBusyIcon sx={{ fontSize: 38, opacity: 0.4 }} />
          <Typography variant="body2" color="text.secondary" fontWeight={600}>
            No appointments on this day
          </Typography>
        </EmptyState>
      ) : (
        selectedEvents
          .slice()
          .sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date))
          .map((e, i) => {
            const style = chipStyle[e.status] || { bg: '#E3F2FD', color: '#1565C0' };
            return (
              <AppointmentRow key={i}>
                <TimeBadge bg={style.bg} color={style.color}>
                  {dayjs(e.appointment_date).format('HH:mm')}
                </TimeBadge>

                <Box flex={1} minWidth={0}>
                  <Typography variant="body2" fontWeight={700} noWrap>
                    Dr. {e.doctor_name || '—'}
                  </Typography>
                  {e.patient_name && (
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                      Patient: {e.patient_name}
                    </Typography>
                  )}
                </Box>

                <Chip
                  label={e.status}
                  size="small"
                  sx={{
                    fontSize: 10.5,
                    height: 24,
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    bgcolor: style.bg,
                    color: style.color,
                  }}
                />
              </AppointmentRow>
            );
          })
      )}
    </EventPopoverBody>
  </EventPopover>
)}
      </CalendarCard>
    </PageWrapper>
  );
};

export default CalendarPage;