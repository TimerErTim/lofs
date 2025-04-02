import { useState } from 'react';
import { Input } from '@heroui/react';
import { Button } from '@heroui/react';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/react';
import { storePassword, createAuthToken } from '@/utils/auth';
import { decryptNotes } from '@/utils/decryptNotes';

interface LoginFormProps {
  encryptedData: string;
  onLoginSuccess: (password: string) => void;
}

export default function LoginForm({ encryptedData, onLoginSuccess }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Try to decrypt the notes with the provided password
      const notesData = await decryptNotes(encryptedData, password);
      
      if (notesData) {
        // Decryption successful, store auth data
        storePassword(password);
        createAuthToken();
        
        // Notify parent with the password for decryption
        onLoginSuccess(password);
      } else {
        setError('Ungültiges Passwort. Bitte versuchen Sie es erneut.');
      }
    } catch (error) {
      console.error('Decryption error:', error);
      setError('Entschlüsselung fehlgeschlagen. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="pb-0">
          <h2 className="text-2xl font-bold text-center">Tägliche Liebesnotizen</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mt-1">
            Geben Sie das Passwort ein, um Ihre Liebesnotizen anzuzeigen
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Input
                  type="password"
                  label="Passwort"
                  placeholder="Passwort eingeben"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isDisabled={isLoading}
                  isRequired
                  className="w-full"
                />
                {error && (
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                )}
              </div>
              <Button
                type="submit"
                isLoading={isLoading}
                className="w-full"
              >
                Anmelden
              </Button>
            </div>
          </form>
        </CardBody>
        <CardFooter className="pt-0">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            Diese Seite enthält private Inhalte. Unbefugter Zugriff ist untersagt.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 