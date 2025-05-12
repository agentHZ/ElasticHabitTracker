import React from 'react';
import { Button } from '@/components/ui/button';
import { useRTL } from '@/hooks/useRTL';
import { HabitIcons } from './icons';

// Language options for the selector
const languages = [
  { code: 'en', name: 'English', isRTL: false },
  { code: 'ar', name: 'العربية', isRTL: true },
  { code: 'he', name: 'עִברִית', isRTL: true },
  { code: 'fa', name: 'فارسی', isRTL: true },
] as const;

export const LanguageSelector: React.FC = () => {
  const { isRTL, setDirection } = useRTL();
  
  // Handle language selection
  const handleLanguageChange = (language: typeof languages[number]) => {
    setDirection(language.isRTL);
    // In a real app, you might want to also set the language code in a state or context
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm font-medium mb-1">
        <HabitIcons.QuestionCircle size={16} className="text-muted-foreground" />
        <span>{isRTL ? 'اللغة' : 'Language'}</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {languages.map(language => (
          <Button
            key={language.code}
            variant={isRTL === language.isRTL ? "default" : "outline"}
            size="sm"
            onClick={() => handleLanguageChange(language)}
            className="min-w-[80px]"
          >
            {language.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;