import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, startOfWeek, endOfWeek, subMonths, startOfMonth, endOfMonth, subYears } from "date-fns";
import { formatDate } from "@/lib/utils/dateUtils";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import type { HabitCompletion, Habit } from "@shared/schema";

interface ProgressChartProps {
  userId: number;
  isLoading: boolean;
}

// Map completion level to numeric value
const getLevelValue = (level: string) => {
  switch (level) {
    case 'micro': return 1;
    case 'standard': return 2;
    case 'stretch': return 3;
    default: return 0;
  }
};

export default function ProgressChart({ userId, isLoading }: ProgressChartProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Calculate date range based on selected time range
  const today = new Date();
  let startDate: Date, endDate: Date;
  
  if (timeRange === 'week') {
    endDate = endOfWeek(today);
    startDate = startOfWeek(today);
  } else if (timeRange === 'month') {
    endDate = endOfMonth(today);
    startDate = startOfMonth(today);
  } else {
    endDate = today;
    startDate = subYears(today, 1);
  }
  
  // Format dates for API
  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(endDate);
  
  // Fetch habits
  const { 
    data: habits 
  } = useQuery<Habit[]>({
    queryKey: ['/api/habits', { userId }],
    queryFn: async () => {
      const res = await fetch(`/api/habits?userId=${userId}`);
      if (!res.ok) throw new Error('Failed to fetch habits');
      return res.json();
    }
  });
  
  // Fetch completions for the date range
  const { 
    data: completions 
  } = useQuery<HabitCompletion[]>({
    queryKey: ['/api/habit-completions', { userId, startDate: startDateStr, endDate: endDateStr }],
    queryFn: async () => {
      const res = await fetch(`/api/habit-completions?userId=${userId}&startDate=${startDateStr}&endDate=${endDateStr}`);
      if (!res.ok) throw new Error('Failed to fetch completions');
      return res.json();
    },
    enabled: !isLoading
  });
  
  // Generate chart data
  const chartData = useMemo(() => {
    if (!habits || !completions) return [];
    
    // Create a mapping of habits
    const habitMap = new Map(habits.map(h => [h.id, h]));
    
    // Group completions by date
    const dateGroups = new Map<string, Map<number, string>>();
    completions.forEach(completion => {
      const dateKey = new Date(completion.date).toISOString().split('T')[0];
      if (!dateGroups.has(dateKey)) {
        dateGroups.set(dateKey, new Map());
      }
      dateGroups.get(dateKey)?.set(completion.habitId, completion.level);
    });
    
    // Generate data points based on time range
    let dates: Date[] = [];
    if (timeRange === 'week') {
      // For week, show every day
      for (let i = 0; i < 7; i++) {
        dates.push(subDays(endDate, 6 - i));
      }
    } else if (timeRange === 'month') {
      // For month, show every other day
      const daysInMonth = endDate.getDate();
      for (let i = 0; i < daysInMonth; i += 2) {
        dates.push(new Date(endDate.getFullYear(), endDate.getMonth(), i + 1));
      }
    } else {
      // For year, show one day per month
      for (let i = 0; i < 12; i++) {
        dates.push(new Date(endDate.getFullYear(), endDate.getMonth() - 11 + i, 15));
      }
    }
    
    // Create the data points
    return dates.map(date => {
      const dateKey = date.toISOString().split('T')[0];
      const dateCompletions = dateGroups.get(dateKey) || new Map();
      
      const formatStr = timeRange === 'year' ? 'MMM' : 'MMM d';
      const dataPoint: any = { 
        date: format(date, formatStr) 
      };
      
      // Add data points for each habit
      habits.forEach(habit => {
        const level = dateCompletions.get(habit.id);
        dataPoint[habit.title] = level ? getLevelValue(level) : 0;
      });
      
      return dataPoint;
    });
  }, [habits, completions, timeRange, startDate, endDate]);

  return (
    <Card className="mb-8">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-800">Progress Overview</h2>
          <div className="flex space-x-2">
            <Tabs defaultValue={timeRange} onValueChange={(value) => setTimeRange(value as 'week' | 'month' | 'year')}>
              <TabsList>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="year">Year</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
        
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : !habits || habits.length === 0 ? (
          <div className="h-64 w-full flex items-center justify-center text-neutral-500">
            No habits to display. Start by creating some habits.
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  domain={[0, 3]} 
                  ticks={[0, 1, 2, 3]} 
                  tickFormatter={(value) => {
                    if (value === 0) return 'None';
                    if (value === 1) return 'Micro';
                    if (value === 2) return 'Standard';
                    if (value === 3) return 'Stretch';
                    return '';
                  }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    const level = Number(value);
                    if (level === 0) return ['Not Done', name];
                    if (level === 1) return ['Micro', name];
                    if (level === 2) return ['Standard', name];
                    if (level === 3) return ['Stretch', name];
                    return [value, name];
                  }}
                />
                <Legend />
                {habits.map((habit, index) => (
                  <Line
                    key={habit.id}
                    type="monotone"
                    dataKey={habit.title}
                    stroke={index === 0 ? '#4F46E5' : index === 1 ? '#3B82F6' : '#8B5CF6'}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
