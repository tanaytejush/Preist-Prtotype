
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="text-spiritual-brown dark:text-spiritual-cream hover:text-spiritual-gold dark:hover:text-spiritual-gold rounded-full transition-colors duration-300"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 animate-in spin-in-180 duration-300" />
      ) : (
        <Moon className="h-5 w-5 animate-in spin-in-180 duration-300" />
      )}
      <span className="sr-only">{theme === 'dark' ? 'Light' : 'Dark'} mode</span>
    </Button>
  );
}
