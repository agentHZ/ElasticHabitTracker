import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Habit, HabitCompletion, COMMITMENT_LEVELS } from "@shared/schema";
import { useRTL } from "@/hooks/useRTL";
import { cn } from "@/lib/utils";

interface HabitCardProps {
  habit: Habit;
  completion?: HabitCompletion;
  onComplete: (level: string) => void;
  isCompleting: boolean;
}

export default function HabitCard({ habit, completion, onComplete, isCompleting }: HabitCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isRTL } = useRTL();
  
  // Get the icon based on the habit category
  const getIcon = (category: string) => {
    switch (category) {
      case 'health':
        return 'running';
      case 'productivity':
        return 'briefcase';
      case 'mindfulness':
        return 'brain';
      case 'learning':
        return 'book';
      default:
        return 'star';
    }
  };
  
  // Get the color class based on the habit's color
  const getColorClass = (level: string) => {
    if (completion?.level === level) {
      switch (level) {
        case 'micro':
          return 'border-green-500 bg-green-100 text-green-700';
        case 'standard':
          return 'border-blue-500 bg-blue-100 text-blue-700';
        case 'stretch':
          return 'border-purple-500 bg-purple-100 text-purple-700';
        default:
          return 'border-neutral-300 text-neutral-700 hover:bg-neutral-100';
      }
    }
    return 'border-neutral-300 text-neutral-700 hover:bg-neutral-100';
  };
  
  // Calculate completion progress
  const calculateProgress = () => {
    // In a real app, we'd fetch historical data
    // For now, return a fixed value based on the completion level
    if (!completion) return 0;
    switch (completion.level) {
      case 'micro':
        return 33;
      case 'standard':
        return 66;
      case 'stretch':
        return 100;
      default:
        return 0;
    }
  };
  
  const progressValue = calculateProgress();
  
  // Handle level completion
  const handleLevelClick = (level: string) => {
    if (isCompleting) return;
    onComplete(level);
  };
  
  // Get the check icon for completed levels
  const getCheckIcon = (level: string) => {
    if (completion?.level === level) {
      return (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")}
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
            clipRule="evenodd" 
          />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className={cn("flex items-center", isRTL && "flex-row-reverse")}>
            <div className={`p-2 rounded-md bg-${habit.category === 'health' ? 'primary' : habit.category === 'learning' ? 'blue' : 'purple'}-100 text-${habit.category === 'health' ? 'primary' : habit.category === 'learning' ? 'blue' : 'purple'}-500`}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {habit.category === 'health' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                )}
                {habit.category === 'learning' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                )}
                {habit.category === 'mindfulness' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                )}
                {habit.category !== 'health' && habit.category !== 'learning' && habit.category !== 'mindfulness' && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                )}
              </svg>
            </div>
            <h3 className={cn("text-lg font-medium text-neutral-800", isRTL ? "mr-3" : "ml-3")}>{habit.title}</h3>
            <span className={cn(`px-2 py-1 text-xs font-medium rounded-full bg-${habit.category === 'health' ? 'primary' : habit.category === 'learning' ? 'blue' : 'purple'}-100 text-${habit.category === 'health' ? 'primary' : habit.category === 'learning' ? 'blue' : 'purple'}-600`, isRTL ? "mr-2" : "ml-2")}>{habit.frequency}</span>
          </div>
          <div className="relative">
            <button 
              className="text-neutral-400 hover:text-neutral-600" 
              aria-label="More options"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {isMenuOpen && (
              <div className={cn("absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10", isRTL ? "left-0" : "right-0")}>
                <div className="py-1">
                  <button className={cn("block w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100", isRTL ? "text-right" : "text-left")}>{isRTL ? "تعديل العادة" : "Edit Habit"}</button>
                  <button className={cn("block w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100", isRTL ? "text-right" : "text-left")}>{isRTL ? "عرض التاريخ" : "View History"}</button>
                  <button className={cn("block w-full px-4 py-2 text-sm text-red-600 hover:bg-neutral-100", isRTL ? "text-right" : "text-left")}>{isRTL ? "حذف العادة" : "Delete Habit"}</button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {/* Micro Level */}
              <button 
                className={`flex items-center justify-center px-4 py-2 border-2 ${getColorClass('micro')} rounded-md text-sm font-medium`}
                onClick={() => handleLevelClick('micro')}
                disabled={isCompleting}
              >
                {getCheckIcon('micro')}
                <span>Micro: {habit.microLevel}</span>
              </button>
              
              {/* Standard Level */}
              <button 
                className={`flex items-center justify-center px-4 py-2 border-2 ${getColorClass('standard')} rounded-md text-sm font-medium`}
                onClick={() => handleLevelClick('standard')}
                disabled={isCompleting}
              >
                {getCheckIcon('standard')}
                <span>Standard: {habit.standardLevel}</span>
              </button>
              
              {/* Stretch Level */}
              <button 
                className={`flex items-center justify-center px-4 py-2 border-2 ${getColorClass('stretch')} rounded-md text-sm font-medium`}
                onClick={() => handleLevelClick('stretch')}
                disabled={isCompleting}
              >
                {getCheckIcon('stretch')}
                <span>Stretch: {habit.stretchLevel}</span>
              </button>
            </div>
            
            <div className="text-sm text-neutral-500 w-full sm:w-auto">
              <div className="flex items-center mb-1">
                <span className="mr-2">Progress:</span>
                <div className="relative w-32 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-primary-500 rounded-full" 
                    style={{ width: `${progressValue}%` }}
                  ></div>
                </div>
                <span className="ml-2">{progressValue}%</span>
              </div>
              <div className="text-xs">Current streak: <span className="font-medium">8 days</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
