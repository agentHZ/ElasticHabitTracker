import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { format, addDays, subDays, startOfWeek, endOfWeek, isSameDay } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils/dateUtils";
import { type Habit, type HabitCompletion } from "@shared/schema";

interface CalendarViewProps {
  userId: number;
  habits: Habit[];
}

export default function CalendarView({ userId, habits }: CalendarViewProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  
  // Calculate week end date
  const currentWeekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  
  // Format dates for display
  const formattedDateRange = `${format(currentWeekStart, 'MMM d')} - ${format(currentWeekEnd, 'MMM d')}`;
  
  // Get date array for the current week
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  
  // Previous and next week handlers
  const goToPreviousWeek = () => setCurrentWeekStart(prevDate => subDays(prevDate, 7));
  const goToNextWeek = () => setCurrentWeekStart(prevDate => addDays(prevDate, 7));
  
  // Fetch completions for the current week
  const { 
    data: completions, 
    isLoading 
  } = useQuery<HabitCompletion[]>({
    queryKey: ['/api/habit-completions', { 
      userId, 
      startDate: formatDate(currentWeekStart),
      endDate: formatDate(currentWeekEnd)
    }],
    queryFn: async () => {
      const res = await fetch(`/api/habit-completions?userId=${userId}&startDate=${formatDate(currentWeekStart)}&endDate=${formatDate(currentWeekEnd)}`);
      if (!res.ok) throw new Error('Failed to fetch completions');
      return res.json();
    },
    enabled: habits.length > 0,
  });
  
  // Get completions for a specific day
  const getDayCompletions = (date: Date) => {
    if (!completions) return [];
    
    return completions.filter(completion => {
      const completionDate = new Date(completion.date);
      return isSameDay(completionDate, date);
    });
  };
  
  // Get habit by id
  const getHabitById = (habitId: number) => {
    return habits.find(habit => habit.id === habitId);
  };
  
  // Get color class based on level
  const getLevelColorClass = (level: string) => {
    switch (level) {
      case 'micro':
        return 'bg-green-100 text-green-800';
      case 'standard':
        return 'bg-blue-100 text-blue-800';
      case 'stretch':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };
  
  // Check if a date is today
  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">Weekly Calendar</h2>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToPreviousWeek}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <span className="text-sm font-medium">{formattedDateRange}</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToNextWeek}
            className="text-neutral-500 hover:text-neutral-700"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
      
      <Card className="overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={i} className="py-2 text-center text-sm font-medium text-neutral-500">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7">
          {weekDays.map((day, i) => {
            const dayCompletions = getDayCompletions(day);
            const isCurrentDay = isToday(day);
            
            return (
              <div 
                key={i} 
                className={`border-r border-b last:border-r-0 p-3 min-h-[120px] ${isCurrentDay ? 'bg-neutral-50' : ''}`}
              >
                <div className="flex flex-col h-full">
                  <div className={`text-sm font-medium mb-2 ${isCurrentDay ? 'text-primary-500' : ''}`}>
                    {format(day, 'd')}
                  </div>
                  <div className="flex-1">
                    {isLoading ? (
                      <div className="space-y-1">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                      </div>
                    ) : (
                      <>
                        {dayCompletions.map(completion => {
                          const habit = getHabitById(completion.habitId);
                          if (!habit) return null;
                          
                          return (
                            <div 
                              key={completion.id} 
                              className={`mb-1 px-2 py-1 text-xs rounded ${getLevelColorClass(completion.level)}`}
                            >
                              {habit.title} ({completion.level.charAt(0).toUpperCase() + completion.level.slice(1)})
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
