import { Skeleton } from "@/components/ui/skeleton";

interface QuickStatsProps {
  isLoading: boolean;
  currentStreak: number;
  completionRate: number;
  bestDay: string;
  totalHabits: number;
}

export default function QuickStats({ 
  isLoading, 
  currentStreak, 
  completionRate, 
  bestDay, 
  totalHabits 
}: QuickStatsProps) {
  const stats = [
    {
      icon: "fire",
      label: "Current Streak",
      value: `${currentStreak} days`,
      bgColor: "bg-primary-100",
      textColor: "text-primary-500",
    },
    {
      icon: "check-circle",
      label: "Completion Rate",
      value: `${completionRate}%`,
      bgColor: "bg-green-100",
      textColor: "text-green-500",
    },
    {
      icon: "bolt",
      label: "Best Day",
      value: bestDay,
      bgColor: "bg-amber-100",
      textColor: "text-amber-500",
    },
    {
      icon: "calendar-check",
      label: "Total Habits",
      value: totalHabits.toString(),
      bgColor: "bg-neutral-100",
      textColor: "text-neutral-500",
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg shadow p-5">
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${stat.bgColor} ${stat.textColor}`}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {stat.icon === "fire" && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                )}
                {stat.icon === "check-circle" && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                )}
                {stat.icon === "bolt" && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                )}
                {stat.icon === "calendar-check" && (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                )}
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
              {isLoading ? (
                <Skeleton className="h-6 w-20 mt-1" />
              ) : (
                <p className="text-xl font-semibold text-neutral-800">{stat.value}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
