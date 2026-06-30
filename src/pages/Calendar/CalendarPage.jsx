import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, Chip, IconButton, Tooltip } from '@mui/material';
import { Calendar, Badge, Spin } from 'antd';
import RefreshIcon from '@mui/icons-material/Refresh';
import dayjs       from 'dayjs';
import styled      from 'styled-components';
import useCalendar from '../../modules/calendar/hooks/useCalendar';

// ── Hero banner (Unsplash) ──────────────────────────────────────
const Hero = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  min-height: 150px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px;
  background-image:
    linear-gradient(120deg, rgba(229,62,62,0.90) 10%, rgba(229,62,62,0.5) 60%, rgba(229,62,62,0.12) 100%),
    url('https://source.unsplash.com/1600x500/?calendar,schedule,clinic');
  background-size: cover;
  background-position: center;
`;

const HeroText = styled.div`
  color: #fff;
  max-width: 560px;
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
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
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
    const from = value.startOf('month').format('YYYY-MM-DD');
    const to   = value.endOf('month').format('YYYY-MM-DD');
    fetchCalendar(from, to);
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
        <HeroText>
          <Typography sx={{ fontSize: 22, fontWeight: 700, mb: 0.5 }}>Appointment Calendar</Typography>
          <Typography sx={{ fontSize: 13.5, opacity: 0.92 }}>
            Browse confirmed, pending, and completed appointments by day across your tenant.
          </Typography>
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
        <Tooltip title="Refresh">
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
            <Typography variant="h6" fontWeight={700} mb={1.5} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {dayjs(selectedDate).format('D MMMM YYYY')}
              <Typography component="span" variant="body2" color="text.secondary">
                ({selectedEvents.length} appointment{selectedEvents.length !== 1 ? 's' : ''})
              </Typography>
            </Typography>

            {selectedEvents.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No appointments on this day.</Typography>
            ) : (
              selectedEvents.map((e, i) => (
                <Box
                  key={i}
                  sx={{
                    display: 'flex', alignItems: 'center', gap: 2,
                    py: 1.5,
                    borderBottom: i < selectedEvents.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Badge status={badgeStatus[e.status] || 'default'} />
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight={600}>
                      {dayjs(e.appointment_date).format('HH:mm')} — Dr. {e.doctor_name || '?'}
                    </Typography>
                    {e.patient_name && (
                      <Typography variant="caption" color="text.secondary">
                        Patient: {e.patient_name}
                      </Typography>
                    )}
                  </Box>
                  <Chip
                    label={e.status}
                    size="small"
                    sx={{
                      fontSize: 10,
                      height: 22,
                      textTransform: 'capitalize',
                      bgcolor: chipStyle[e.status]?.bg    || '#E3F2FD',
                      color:   chipStyle[e.status]?.color || '#1565C0',
                      fontWeight: 600,
                    }}
                  />
                </Box>
              ))
            )}
          </EventPopover>
        )}
      </CalendarCard>
    </PageWrapper>
  );
};

export default CalendarPage;
