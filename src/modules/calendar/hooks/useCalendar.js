import { useDispatch, useSelector } from 'react-redux';
import { fetchCalendarRequest } from '../calendarSlice';

const useCalendar = () => {
  const dispatch = useDispatch();
  const { events, loading, error, from, to } = useSelector((s) => s.calendar);

  const fetchCalendar = (from, to) => dispatch(fetchCalendarRequest({ from, to }));

  return { events, loading, error, from, to, fetchCalendar };
};

export default useCalendar;
