import { useState } from 'react';
import { useRouter } from 'next/router';
import { Calendar, Button } from '@heroui/react';
import { format } from 'date-fns';
import { Note } from '@/types/notes';
import { DateValue, getLocalTimeZone } from '@internationalized/date';
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
    const formattedDate = format(new Date(note.date), 'yyyy-MM-dd');
    noteDatesMap.set(formattedDate, note);
  });
  

  console.log(noteDatesMap);

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
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Daily Notes of Love</h1>
          <Button variant="ghost" onPress={handleLogout}>Logout</Button>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Select a Date</h2>
          
          <Calendar
            value={date}
            onChange={handleDateChange}
            isDateUnavailable={isDateUnavailable}
            className=""
          />
          
          <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
              <p>Days with notes</p>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white dark:bg-gray-800 py-4 shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            With love, every day.
          </p>
        </div>
      </footer>
    </div>
  );
} 