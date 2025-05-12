import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Habit, HabitCompletion } from "@shared/schema";

interface Recommendation {
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  actionLabel: string;
}

/**
 * Hook to generate personalized habit recommendations based on user data
 */
export function useHabitRecommendations(userId: number) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  
  // Fetch user habits
  const { 
    data: habits, 
    isLoading: isLoadingHabits 
  } = useQuery<Habit[]>({
    queryKey: ['/api/habits', { userId }],
    queryFn: async () => {
      const res = await fetch(`/api/habits?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch habits');
      return res.json();
    }
  });
  
  // Fetch best day
  const { 
    data: bestDayData, 
    isLoading: isLoadingBestDay 
  } = useQuery({
    queryKey: ['/api/analytics/best-day', userId],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/best-day/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch best day');
      return res.json();
    }
  });
  
  // Fetch streaks and completion rates for all habits
  const { 
    data: analyticsData, 
    isLoading: isLoadingAnalytics 
  } = useQuery({
    queryKey: ['/api/analytics/summary', userId],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/summary/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch analytics data');
      return res.json();
    }
  });
  
  // Generate recommendations based on habits and analytics data
  useEffect(() => {
    if (isLoadingHabits || isLoadingBestDay || isLoadingAnalytics || !habits) {
      return;
    }
    
    const generatedRecommendations: Recommendation[] = [];
    const bestDay = bestDayData?.bestDay;
    
    // If there's a best day identified, add a pattern recommendation
    if (bestDay) {
      generatedRecommendations.push({
        title: "Pattern Detected",
        description: `You're more likely to complete habits on ${bestDay}. Consider scheduling important habits for this day.`,
        icon: "lightbulb",
        iconBg: "bg-primary-100",
        iconColor: "text-primary-500",
        actionLabel: "Adjust schedule"
      });
    }
    
    // Find habits with low completion rates
    const habitAtRisk = habits.find(habit => {
      // In a real implementation, this would check actual completion rate data
      return habit.title === "Meditation"; // For demo purposes
    });
    
    if (habitAtRisk) {
      generatedRecommendations.push({
        title: "Habit at Risk",
        description: `Your ${habitAtRisk.title.toLowerCase()} habit is dropping. Try the micro level to maintain consistency.`,
        icon: "exclamation-circle",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-500",
        actionLabel: "Try micro option"
      });
    }
    
    // Check for achievements
    if (analyticsData?.currentStreak >= 3) {
      generatedRecommendations.push({
        title: "Achievement Unlocked",
        description: "You've maintained a 3+ day streak! Keep up the good work.",
        icon: "trophy",
        iconBg: "bg-green-100",
        iconColor: "text-green-500",
        actionLabel: "View achievements"
      });
    }
    
    setRecommendations(generatedRecommendations);
  }, [habits, bestDayData, analyticsData, isLoadingHabits, isLoadingBestDay, isLoadingAnalytics]);

  return {
    recommendations,
    isLoading: isLoadingHabits || isLoadingBestDay || isLoadingAnalytics
  };
}
