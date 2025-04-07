import { ReactNode } from 'react';
import { Button } from '@heroui/react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  headerButton?: {
    label: string;
    onClick: () => void;
    variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
    className?: string;
  };
  backgroundImage?: string;
}

export default function Layout({
  children,
  title = 'Nathalie\'s Lofs',
  headerButton,
  backgroundImage
}: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow py-3 sm:py-4 z-10">
        <div className="container mx-auto px-3 sm:px-4 flex justify-between items-center">
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 truncate">{title}</h1>
          {headerButton && (
            <Button
              variant={headerButton.variant || 'ghost'}
              onPress={headerButton.onClick}
              className={`text-sm sm:text-base whitespace-nowrap ${headerButton.className || ''}`}
              size="sm"
            >
              {headerButton.label}
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 relative">
        {backgroundImage && (
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-black/30 z-10" />
            <img 
              src={backgroundImage} 
              alt="Hintergrundbild" 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {children}
      </main>

      <footer className="bg-white dark:bg-gray-800 py-3 sm:py-4 shadow-inner relative z-10">
        <div className="container mx-auto px-3 sm:px-4 text-center">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            Für dich jeden Tag.
          </p>
        </div>
      </footer>
    </div>
  );
} 