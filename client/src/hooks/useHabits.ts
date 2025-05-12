import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Habit, InsertHabit } from "@shared/schema";

/**
 * Hook to fetch and manage habits for a user
 */
export function useHabits(userId: number) {
  // Fetch all habits for a user
  const { 
    data: habits, 
    isLoading, 
    isError,
    error 
  } = useQuery<Habit[]>({
    queryKey: ['/api/habits', { userId }],
    queryFn: async () => {
      const res = await fetch(`/api/habits?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch habits');
      return res.json();
    }
  });
  
  // Create a new habit
  const createHabit = useMutation({
    mutationFn: async (habitData: InsertHabit) => {
      return apiRequest('POST', '/api/habits', habitData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
    }
  });
  
  // Update an existing habit
  const updateHabit = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<InsertHabit> }) => {
      return apiRequest('PATCH', `/api/habits/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
    }
  });
  
  // Delete a habit
  const deleteHabit = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/habits/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/habits'] });
    }
  });

  return {
    habits,
    isLoading,
    isError,
    error,
    createHabit,
    updateHabit,
    deleteHabit
  };
}
