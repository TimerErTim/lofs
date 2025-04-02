import { Card, CardHeader, CardBody, CardFooter } from '@heroui/react';
import { Note } from '@/types/notes';

interface NoteCardProps {
  note: Note;
}

export default function NoteCard({ note }: NoteCardProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <h3 className="text-lg font-semibold">{formatDate(note.date)}</h3>
      </CardHeader>
      <CardBody>
        {note.imageUrl && (
          <div className="mb-4">
            <img 
              src={note.imageUrl} 
              alt="Note image" 
              className="w-full h-auto rounded-lg object-cover max-h-[300px]"
            />
          </div>
        )}
        <p className="whitespace-pre-line">{note.text}</p>
      </CardBody>
      <CardFooter className="pt-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">Note #{note.id}</p>
      </CardFooter>
    </Card>
  );
} 