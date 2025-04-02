import { useState } from 'react';
import { Input } from '@heroui/react';
import { Button } from '@heroui/react';
import { Card, CardHeader, CardBody, CardFooter } from '@heroui/react';
import { validatePassword, createAuthToken } from '@/utils/auth';

interface LoginFormProps {
  onLoginSuccess: () => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validate the password
    if (validatePassword(password)) {
      // Create auth token and notify parent
      createAuthToken();
      onLoginSuccess();
    } else {
      setError('Invalid password. Please try again.');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="pb-0">
          <h2 className="text-2xl font-bold text-center">Daily Notes of Love</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mt-1">
            Enter the password to view your love notes
          </p>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Input
                  type="password"
                  label="Password"
                  placeholder="Enter your password"
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
                Login
              </Button>
            </div>
          </form>
        </CardBody>
        <CardFooter className="pt-0">
          <p className="text-center text-xs text-gray-500 dark:text-gray-400">
            This site contains private content. Unauthorized access is prohibited.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 