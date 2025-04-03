import { useState } from 'react';
import { useRouter } from 'next/router';
import { Calendar, Button } from '@heroui/react';
import { format, isAfter } from 'date-fns';
import { de } from 'date-fns/locale';
import { Note } from '@/types/notes';
import { DateValue, getLocalTimeZone, parseDate } from '@internationalized/date';
import { today } from '@internationalized/date';

interface CalendarViewProps {
  notes: Note[];
  onLogout: () => void;
}

export default function CalendarView({ notes, onLogout }: CalendarViewProps) {
  const router = useRouter();
  const [date, setDate] = useState<DateValue>(today(getLocalTimeZone()));
  
  // Create a map of dates that have notes
  const noteDatesMap = new Map<string, Note>();
  notes.forEach(note => {
    const formattedDate = format(new Date(note.date), 'yyyy-MM-dd', { locale: de });
    noteDatesMap.set(formattedDate, note);
  });


  const handleDateChange = (selectedDate: DateValue) => {
    setDate(selectedDate);
    const formattedDate = selectedDate.toString().split('T')[0];
    
    if (noteDatesMap.has(formattedDate)) {
      // Navigate to the note page for this date
      router.push(`/notes/${formattedDate}`);
    }
  };
  
  const handleLogout = () => {
    onLogout();
  };

  // Custom validation function to disable dates without notes
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
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Tägliche Liebesnotizen</h1>
          <Button variant="ghost" onPress={handleLogout}>Abmelden</Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg items-center justify-center flex flex-col">
          <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-gray-100">Wähle ein Datum</h2>
          
          <Calendar
            value={date}
            onChange={handleDateChange}
            isDateUnavailable={isDateUnavailable}
            minValue={minDate}
            maxValue={maxDate}
          />
          
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-300 flex justify-center items-center">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <p>Tage mit Notizen</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 py-4 shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Mit Liebe, jeden Tag.
          </p>
        </div>
      </footer>
    </div>
  );
} 