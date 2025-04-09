import { useRouter } from 'next/router';
import { Badge, Calendar, Card, CardBody, CardFooter, CardHeader, Chip, cn } from '@heroui/react';
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

  let maxDate = null
  let minDate = null
  for (const note of notes) {
    const noteDate = parseDate(note.date)
    if (maxDate === null || noteDate.compare(maxDate) > 0) {
      maxDate = noteDate
    }
    if (minDate === null || noteDate.compare(minDate) < 0) {
      minDate = noteDate
    }
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex items-center justify-center">
      <Card fullWidth className="items-center align-middle" title='Kalender'>
        <CardHeader className="justify-center">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 text-center max-w-md">
            Täglich eine Notiz über meinen liebsten Moment mit oder Lieblingseigenschaft an dir.
          </p>
        </CardHeader>

        <CardBody className="justify-center items-center">
          <Calendar
            onChange={handleDateChange}
            isDateUnavailable={isDateUnavailable}
            className="md:scale-110 md:m-4 lg:scale-125 lg:m-8"
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
        </CardBody>

        <CardFooter className="justify-center items-center">
          <Chip size="sm" variant="faded" startContent={<span className="w-2 h-2 mx-1 rounded-full bg-danger-300"></span>}>
            Tage mit Notizen
          </Chip>
        </CardFooter>
      </Card>
    </div>
  );
} 