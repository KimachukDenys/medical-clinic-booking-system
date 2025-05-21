import { useState, useEffect } from 'react';
import { getBookedSlots } from '../../api/appointmentApi';

interface AppointmentFormProps {
  value: { date: string; time: string };
  onChange: (value: { date: string; time: string }) => void;
  doctorId: number;
  token: string;
}

const getNextWeekdays = (startFrom: Date, count: number): { label: string; value: string }[] => {
  const weekdays: { label: string; value: string }[] = [];
  const dayNames = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота'];

  let date = new Date(startFrom);

  while (weekdays.length < count) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day >= 1 && day <= 5) {
      const isoDate = date.toISOString().split('T')[0];
      const label = `${dayNames[day]} ${isoDate.split('-').reverse().join('-')}`;
      weekdays.push({ label, value: isoDate });
    }
  }
  return weekdays;
};

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  value,
  onChange,
  doctorId,
  token,
}) => {
  const [date, setDate] = useState(value.date);
  const [time, setTime] = useState(value.time);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [displayedDates, setDisplayedDates] = useState(() =>
    getNextWeekdays(new Date(), 10)
  );

  useEffect(() => {
    onChange({ date, time });
  }, [date, time]);

  useEffect(() => {
    setDate(value.date);
    setTime(value.time);
  }, [value]);

  useEffect(() => {
    if (!date || !doctorId) return;
    setLoading(true);
    getBookedSlots(doctorId, date, token)
      .then((res) => setBookedSlots(res.data))
      .catch(() => setBookedSlots([]))
      .finally(() => setLoading(false));
  }, [date, doctorId, token]);

  const handleLoadMoreDates = () => {
    const lastDate = new Date(displayedDates[displayedDates.length - 1].value);
    const moreDates = getNextWeekdays(lastDate, 10);
    setDisplayedDates((prev) => [...prev, ...moreDates]);
  };

  const generateAvailableTimeSlots = () => {
    const slots: string[] = [];
    for (let hour = 8; hour <= 17; hour++) {
      if (hour === 14) continue;
      const slot = `${hour.toString().padStart(2, '0')}:00`;
      if (!bookedSlots.includes(slot)) {
        slots.push(slot);
      }
    }
    return slots;
  };

  return (
    <div>
      <div className="mb-6">
        <label className="block mb-2 font-semibold text-primary">Оберіть дату:</label>
        <div className="flex flex-wrap gap-3">
          {displayedDates.map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => {
                setTime('');
                setDate(value);
              }}
              className={`px-4 py-2 rounded-lg border transition ${
                date === value
                  ? 'border-primary bg-primary text-background'
                  : 'border-gray-300 bg-gray-100 text-primary hover:bg-primary hover:text-background'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={handleLoadMoreDates}
            type="button"
            className="px-4 py-2 rounded-lg bg-gray-200 text-primary hover:bg-gray-300 transition"
          >
            Показати ще
          </button>
        </div>
      </div>

      {date && (
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-primary">Оберіть час:</label>
          {loading ? (
            <p className="text-primary">Завантаження доступних слотів...</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {generateAvailableTimeSlots().map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setTime(slot)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    time === slot
                      ? 'border-primary bg-primary text-background'
                      : 'border-gray-300 bg-gray-100 text-primary hover:bg-primary hover:text-background'
                  }`}
                >
                  {slot}
                </button>
              ))}
              {generateAvailableTimeSlots().length === 0 && (
                <p className="text-primary">Немає доступних слотів на цю дату.</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentForm;
