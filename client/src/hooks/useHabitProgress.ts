import { useQuery } from "@tanstack/react-query";
import { formatDate } from "@/lib/utils/dateUtils";
import type { HabitCompletion } from "@shared/schema";

/**
 * Hook to fetch and analyze habit progress data
 */
export function useHabitProgress(userId: number, habitId?: number) {
  // Fetch analytics summary
  const { 
    data: summary, 
    isLoading: isLoadingSummary 
  } = useQuery({
    queryKey: ['/api/analytics/summary', userId],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/summary/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch analytics summary');
      return res.json();
    }
  });
  
  // Fetch completion rate for a specific habit
  const { 
    data: completionRate,
    isLoading: isLoadingRate
  } = useQuery({
    queryKey: ['/api/analytics/completion-rate', habitId],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/completion-rate/${habitId}`);
      if (!res.ok) throw new Error('Failed to fetch completion rate');
      return res.json();
    },
    enabled: !!habitId
  });
  
  // Fetch current streak for a specific habit
  const { 
    data: currentStreak,
    isLoading: isLoadingStreak
  } = useQuery({
    queryKey: ['/api/analytics/current-streak', habitId],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/current-streak/${habitId}`);
      if (!res.ok) throw new Error('Failed to fetch current streak');
      return res.json();
    },
    enabled: !!habitId
  });
  
  // Get today's habit completions
  const today = new Date();
  const { 
    data: todayCompletions,
    isLoading: isLoadingToday
  } = useQuery<HabitCompletion[]>({
    queryKey: ['/api/habit-completions', { userId, date: formatDate(today) }],
    queryFn: async () => {
      const res = await fetch(`/api/habit-completions?userId=${userId}&date=${formatDate(today)}`);
      if (!res.ok) throw new Error('Failed to fetch today\'s completions');
      return res.json();
    }
  });
  
  // Get completions for a date range (last 7 days by default)
  const getHabitCompletions = (startDate: Date, endDate: Date = new Date()) => {
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);
    
    return useQuery<HabitCompletion[]>({
      queryKey: ['/api/habit-completions', { userId, startDate: startDateStr, endDate: endDateStr }],
      queryFn: async () => {
        const res = await fetch(`/api/habit-completions?userId=${userId}&startDate=${startDateStr}&endDate=${endDateStr}`);
        if (!res.ok) throw new Error('Failed to fetch completions');
        return res.json();
      }
    });
  };
  
  // Calculate completion percentage for the last 7 days
  const calculateWeekProgress = () => {
    if (!todayCompletions) return 0;
    
    // In a real implementation, this would calculate based on actual data
    return Math.round((todayCompletions.length / (summary?.totalHabits || 1)) * 100);
  };

  return {
    summary,
    completionRate,
    currentStreak,
    todayCompletions,
    getHabitCompletions,
    calculateWeekProgress,
    isLoading: isLoadingSummary || isLoadingRate || isLoadingStreak || isLoadingToday
  };
}
