import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRTL } from '@/hooks/useRTL';
import { HabitIcons } from './icons';
import { cn } from '@/lib/utils';
import { Tooltip } from '@/components/ui/tooltip';
import { 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from '@/components/ui/tooltip';

// Language options for the selector
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', isRTL: false },
  { code: 'ar', name: 'العربية', flag: '🇪🇬', isRTL: true },
  { code: 'he', name: 'עִברִית', flag: '🇮🇱', isRTL: true },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', isRTL: true },
] as const;

export const LanguageSelector: React.FC = () => {
  const { isRTL, setDirection } = useRTL();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Handle language selection
  const handleLanguageChange = (language: typeof languages[number]) => {
    setDirection(language.isRTL);
    setIsExpanded(false);
    // In a real app, you might want to also set the language code in a state or context
  };

  // Find currently active language
  const currentLanguage = languages.find(lang => lang.isRTL === isRTL) || languages[0];

  return (
    <div className="relative">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "flex items-center gap-1.5 border-2 transition-all duration-200",
                isExpanded ? "border-primary" : "border-neutral-200"
              )}
            >
              <span className="text-lg">{currentLanguage.flag}</span>
              <span className="font-medium">{currentLanguage.name}</span>
              <HabitIcons.ChartLine
                size={14}
                className={cn(
                  "transition-transform duration-200",
                  isExpanded ? "rotate-180" : ""
                )}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isRTL ? "تغيير اللغة" : "Change language"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      {isExpanded && (
        <div className={cn(
          "absolute z-50 mt-1 py-2 px-1 bg-white rounded-md shadow-lg border border-neutral-200",
          isRTL ? "right-0" : "left-0"
        )}>
          <div className="flex flex-col gap-1">
            {languages.map(language => (
              <Button
                key={language.code}
                variant={language.code === currentLanguage.code ? "secondary" : "ghost"}
                size="sm"
                onClick={() => handleLanguageChange(language)}
                className={cn(
                  "justify-start min-w-[150px] gap-2 text-left",
                  language.code === currentLanguage.code && "bg-primary/10 text-primary-foreground/90",
                  isRTL && "flex-row-reverse text-right"
                )}
              >
                <span className="text-lg">{language.flag}</span>
                {language.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;