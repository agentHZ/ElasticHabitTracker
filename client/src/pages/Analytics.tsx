import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils/dateUtils";
import type { Habit, HabitCompletion } from "@shared/schema";

interface AnalyticsProps {
  user: {
    id: number;
    username: string;
  };
}

const getLevelValue = (level: string) => {
  switch (level) {
    case 'micro': return 1;
    case 'standard': return 2;
    case 'stretch': return 3;
    default: return 0;
  }
};

export default function Analytics({ user }: AnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Calculate date range based on selected time range
  const endDate = new Date();
  const startDate = new Date();
  
  if (timeRange === 'week') {
    startDate.setDate(endDate.getDate() - 7);
  } else if (timeRange === 'month') {
    startDate.setMonth(endDate.getMonth() - 1);
  } else {
    startDate.setFullYear(endDate.getFullYear() - 1);
  }
  
  // Format dates for API
  const startDateStr = formatDate(startDate);
  const endDateStr = formatDate(endDate);
  
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
  
  // Fetch habit completions for the selected time range
  const { 
    data: completions, 
    isLoading: isLoadingCompletions 
  } = useQuery<HabitCompletion[]>({
    queryKey: ['/api/habit-completions', { userId: user.id, startDate: startDateStr, endDate: endDateStr }],
    queryFn: async () => {
      const res = await fetch(`/api/habit-completions?userId=${user.id}&startDate=${startDateStr}&endDate=${endDateStr}`);
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
  
  // Process data for charts
  const prepareCompletionsByDay = () => {
    if (!completions || !habits) return [];
    
    // Group completions by date
    const groupedByDate: { [key: string]: { [habitId: number]: string } } = {};
    
    completions.forEach(completion => {
      const dateKey = formatDate(new Date(completion.date));
      if (!groupedByDate[dateKey]) {
        groupedByDate[dateKey] = {};
      }
      groupedByDate[dateKey][completion.habitId] = completion.level;
    });
    
    // Create chart data
    return Object.keys(groupedByDate)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map(date => {
        const formattedDate = new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        });
        
        const dataPoint: any = { date: formattedDate };
        
        habits.forEach(habit => {
          const level = groupedByDate[date][habit.id];
          dataPoint[habit.title] = level ? getLevelValue(level) : 0;
        });
        
        return dataPoint;
      });
  };
  
  const prepareCompletionsByHabit = () => {
    if (!completions || !habits) return [];
    
    // Count completions by habit and level
    const habitStats = habits.map(habit => {
      const habitCompletions = completions.filter(c => c.habitId === habit.id);
      
      const micro = habitCompletions.filter(c => c.level === 'micro').length;
      const standard = habitCompletions.filter(c => c.level === 'standard').length;
      const stretch = habitCompletions.filter(c => c.level === 'stretch').length;
      const total = micro + standard + stretch;
      
      return {
        name: habit.title,
        micro,
        standard,
        stretch,
        total
      };
    });
    
    return habitStats;
  };
  
  const getTrendData = () => {
    if (!completions || !habits) return [];
    
    // Group by date and count completions
    const dateMap: { [key: string]: number } = {};
    
    completions.forEach(completion => {
      const dateKey = formatDate(new Date(completion.date));
      dateMap[dateKey] = (dateMap[dateKey] || 0) + 1;
    });
    
    // Convert to chart data format
    return Object.keys(dateMap)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        completions: dateMap[date]
      }));
  };
  
  const completionsByDay = prepareCompletionsByDay();
  const completionsByHabit = prepareCompletionsByHabit();
  const trendData = getTrendData();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800 mb-2">Analytics</h1>
        <p className="text-neutral-500">Review your habit performance over time</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-primary-100 text-primary-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-500">Completion Rate</p>
                {isLoadingAnalytics ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className="text-xl font-semibold text-neutral-800">{analytics?.completionRate || 0}%</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-500">Total Tracked</p>
                {isLoadingCompletions ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className="text-xl font-semibold text-neutral-800">{completions?.length || 0}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-500">Best Streak</p>
                {isLoadingAnalytics ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className="text-xl font-semibold text-neutral-800">{analytics?.currentStreak || 0} days</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-neutral-500">Best Day</p>
                {isLoadingAnalytics ? (
                  <Skeleton className="h-6 w-16 mt-1" />
                ) : (
                  <p className="text-xl font-semibold text-neutral-800">{analytics?.bestDay || 'None'}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Habit Performance</CardTitle>
            <div className="flex space-x-2">
              <TabsList className="grid grid-cols-3 w-auto">
                <TabsTrigger value="week" onClick={() => setTimeRange('week')} data-state={timeRange === 'week' ? 'active' : 'inactive'}>
                  Week
                </TabsTrigger>
                <TabsTrigger value="month" onClick={() => setTimeRange('month')} data-state={timeRange === 'month' ? 'active' : 'inactive'}>
                  Month
                </TabsTrigger>
                <TabsTrigger value="year" onClick={() => setTimeRange('year')} data-state={timeRange === 'year' ? 'active' : 'inactive'}>
                  Year
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Daily View</TabsTrigger>
              <TabsTrigger value="habits">Habits View</TabsTrigger>
              <TabsTrigger value="trend">Trend</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily">
              {isLoadingCompletions || isLoadingHabits ? (
                <Skeleton className="h-64 w-full" />
              ) : completionsByDay.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={completionsByDay}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
                    {habits?.map((habit, index) => (
                      <Bar 
                        key={habit.id} 
                        dataKey={habit.title} 
                        fill={index === 0 ? '#4F46E5' : index === 1 ? '#3B82F6' : '#8B5CF6'} 
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-16 text-neutral-500">
                  No data available for the selected time range
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="habits">
              {isLoadingCompletions || isLoadingHabits ? (
                <Skeleton className="h-64 w-full" />
              ) : completionsByHabit.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={completionsByHabit}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="micro" stackId="a" fill="#10B981" name="Micro" />
                    <Bar dataKey="standard" stackId="a" fill="#3B82F6" name="Standard" />
                    <Bar dataKey="stretch" stackId="a" fill="#8B5CF6" name="Stretch" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-16 text-neutral-500">
                  No data available for the selected time range
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="trend">
              {isLoadingCompletions ? (
                <Skeleton className="h-64 w-full" />
              ) : trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart
                    data={trendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="completions" 
                      stroke="#4F46E5" 
                      name="Habits Completed"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-16 text-neutral-500">
                  No data available for the selected time range
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Habit Insights</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingHabits || isLoadingCompletions ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : habits?.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              No habits created yet. Start by creating a habit to see insights.
            </div>
          ) : completions?.length === 0 ? (
            <div className="text-center py-8 text-neutral-500">
              No completions yet. Start tracking your habits to see insights.
            </div>
          ) : (
            <div className="space-y-6">
              {habits?.map(habit => {
                const habitCompletions = completions?.filter(c => c.habitId === habit.id) || [];
                const totalDays = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
                const completedDays = new Set(habitCompletions.map(c => formatDate(new Date(c.date)))).size;
                const completionRate = Math.round((completedDays / totalDays) * 100);
                
                const microCount = habitCompletions.filter(c => c.level === 'micro').length;
                const standardCount = habitCompletions.filter(c => c.level === 'standard').length;
                const stretchCount = habitCompletions.filter(c => c.level === 'stretch').length;
                
                return (
                  <div key={habit.id} className="border-b pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center mb-2">
                      <div className={`p-2 rounded-md bg-${habit.color.replace('#', '')}-100 text-${habit.color.replace('#', '')}-500`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <h3 className="ml-3 text-lg font-medium text-neutral-800">{habit.title}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-neutral-50 p-4 rounded-md">
                        <div className="text-sm text-neutral-500 mb-1">Completion Rate</div>
                        <div className="text-xl font-semibold">{completionRate}%</div>
                        <div className="mt-1 text-xs text-neutral-500">{completedDays} out of {totalDays} days</div>
                      </div>
                      
                      <div className="bg-neutral-50 p-4 rounded-md">
                        <div className="text-sm text-neutral-500 mb-1">Most Common Level</div>
                        <div className="text-xl font-semibold">
                          {microCount >= standardCount && microCount >= stretchCount ? 'Micro' :
                           standardCount >= microCount && standardCount >= stretchCount ? 'Standard' : 'Stretch'}
                        </div>
                        <div className="mt-1 text-xs text-neutral-500">
                          Micro: {microCount}, Standard: {standardCount}, Stretch: {stretchCount}
                        </div>
                      </div>
                      
                      <div className="bg-neutral-50 p-4 rounded-md">
                        <div className="text-sm text-neutral-500 mb-1">Suggestion</div>
                        <div className="text-base font-medium">
                          {completionRate < 30 ? 
                            'Try focusing on the micro level to build consistency' : 
                           completionRate > 80 && stretchCount < (microCount + standardCount) / 2 ? 
                            'Challenge yourself with more stretch goals' : 
                            'Keep up the good work!'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
