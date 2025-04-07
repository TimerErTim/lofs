import { useRouter } from 'next/router';
import { Calendar, cn } from '@heroui/react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Note } from '@/types/notes';
import { DateValue, getLocalTimeZone, parseDate } from '@internationalized/date';
import { today } from '@internationalized/date';

interface CalendarViewProps {
  notes: Note[];
}

export default function CalendarView({ notes }: CalendarViewProps) {
  const router = useRouter();

  // Create a map of dates that have notes
  const noteDatesMap = new Map<string, Note>();
  notes.forEach(note => {
    const formattedDate = format(new Date(note.date), 'yyyy-MM-dd', { locale: de });
    noteDatesMap.set(formattedDate, note);
  });

  const handleDateChange = (selectedDate: DateValue) => {
    const formattedDate = selectedDate.toString().split('T')[0];

    if (noteDatesMap.has(formattedDate)) {
      router.push(`/notes/${formattedDate}`);
    }
  };

  const isDateUnavailable = (date: DateValue) => {
    const dateString = date.toString().split('T')[0];
    return !noteDatesMap.has(dateString);
  };

  let maxDate = today(getLocalTimeZone())
  let minDate = today(getLocalTimeZone())
  for (const note of notes) {
    const noteDate = parseDate(note.date)
    if (noteDate.compare(maxDate) > 0) {
      maxDate = noteDate
    }
    if (noteDate.compare(minDate) < 0) {
      minDate = noteDate
    }
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-lg items-center justify-center flex flex-col">
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
          Täglich eine Notiz über meinen liebsten Moment mit oder Lieblingseigenschaft an dir.
        </p>

        <Calendar
          onChange={handleDateChange}
          isDateUnavailable={isDateUnavailable}
          classNames={{
            cellButton: cn(
              "relative",
              "data-[unavailable=true]:no-underline",
              "data-[unavailable=true]:text-fg",
              "[&:not([data-unavailable])]:after:absolute",
              "[&:not([data-unavailable])]:after:bottom-0.5",
              "[&:not([data-unavailable])]:after:left-1/2",
              "[&:not([data-unavailable])]:after:-translate-x-1/2", 
              "[&:not([data-unavailable])]:after:w-1.5",
              "[&:not([data-unavailable])]:after:h-1.5",
              "[&:not([data-unavailable])]:after:bg-danger-300",
              "[&:not([data-unavailable])]:after:rounded-full"
            )
          }}
          minValue={minDate}
          maxValue={maxDate}
        />

        <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300 flex justify-center items-center">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-danger-300 mr-2"></div>
            <p>Tage mit Notizen</p>
          </div>
        </div>
      </div>
    </div>
  );
} 