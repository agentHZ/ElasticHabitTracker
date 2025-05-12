import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/Header";
import QuickStats from "@/components/QuickStats";
import ProgressChart from "@/components/ProgressChart";
import HabitCard from "@/components/HabitCard";
import CreateHabitModal from "@/components/CreateHabitModal";
import CalendarView from "@/components/CalendarView";
import RecommendationsSection from "@/components/RecommendationsSection";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils/dateUtils";
import type { Habit, HabitCompletion } from "@shared/schema";

interface DashboardProps {
  user: {
    id: number;
    username: string;
  };
}

export default function Dashboard({ user }: DashboardProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // Fetch user habits
  const { 
    data: habits, 
    isLoading: isLoadingHabits 
  } = useQuery<Habit[]>({
    queryKey: ['/api/habits', { userId: user.id }],
    queryFn: async () => {
      const res = await fetch(`/api/habits?userId=${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch habits');
      return res.json();
    }
  });
  
  // Fetch today's completions
  const today = new Date();
  const { 
    data: todayCompletions, 
    isLoading: isLoadingCompletions 
  } = useQuery<HabitCompletion[]>({
    queryKey: ['/api/habit-completions', { userId: user.id, date: formatDate(today) }],
    queryFn: async () => {
      const res = await fetch(`/api/habit-completions?userId=${user.id}&date=${formatDate(today)}`);
      if (!res.ok) throw new Error('Failed to fetch completions');
      return res.json();
    }
  });
  
  // Fetch analytics summary
  const { 
    data: analytics, 
    isLoading: isLoadingAnalytics 
  } = useQuery({
    queryKey: ['/api/analytics/summary', user.id],
    queryFn: async () => {
      const res = await fetch(`/api/analytics/summary/${user.id}`);
      if (!res.ok) throw new Error('Failed to fetch analytics');
      return res.json();
    }
  });
  
  // Handle habit completion
  const completionMutation = useMutation({
    mutationFn: async ({ habitId, level }: { habitId: number, level: string }) => {
      return apiRequest('POST', '/api/habit-completions', {
        habitId,
        userId: user.id,
        date: new Date(),
        level
      });
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['/api/habit-completions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/analytics/summary'] });
    }
  });
  
  const handleCreateHabit = () => {
    setIsCreateModalOpen(true);
  };
  
  const handleHabitCreated = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <div className="p-6 md:p-8">
        <Header
          userName={user.username}
          onCreateHabit={handleCreateHabit}
        />
        
        <QuickStats
          isLoading={isLoadingAnalytics}
          currentStreak={analytics?.currentStreak || 0}
          completionRate={analytics?.completionRate || 0}
          bestDay={analytics?.bestDay || 'None'}
          totalHabits={analytics?.totalHabits || 0}
        />
        
        <ProgressChart
          userId={user.id}
          isLoading={isLoadingHabits || isLoadingCompletions}
        />
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-800">Today's Habits</h2>
            <div className="text-sm text-neutral-500">
              {formatDate(today, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          
          <div className="space-y-4">
            {isLoadingHabits ? (
              // Loading skeletons
              Array(3).fill(0).map((_, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded-md" />
                      <Skeleton className="h-6 w-32 ml-3" />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              ))
            ) : habits && habits.length > 0 ? (
              habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  completion={todayCompletions?.find(c => c.habitId === habit.id)}
                  onComplete={(level) => completionMutation.mutate({ habitId: habit.id, level })}
                  isCompleting={completionMutation.isPending}
                />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-5 text-center">
                <p className="text-neutral-600">No habits yet. Click "Create Habit" to get started!</p>
              </div>
            )}
          </div>
        </div>
        
        <RecommendationsSection userId={user.id} />
        
        <CalendarView userId={user.id} habits={habits || []} />
      </div>
      
      <CreateHabitModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onHabitCreated={handleHabitCreated}
        userId={user.id}
      />
    </>
  );
}
