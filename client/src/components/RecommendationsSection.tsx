import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useHabitRecommendations } from "@/hooks/useHabitRecommendations";

interface RecommendationsSectionProps {
  userId: number;
}

export default function RecommendationsSection({ userId }: RecommendationsSectionProps) {
  const { toast } = useToast();
  const { recommendations, isLoading } = useHabitRecommendations(userId);
  
  const handleRecommendationAction = (action: string) => {
    // In a real app, this would take different actions based on the recommendation type
    toast({
      title: "Action taken",
      description: `You've chosen to ${action}`,
    });
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-800">Personalized Insights</h2>
        <button className="text-primary-500 text-sm hover:text-primary-600 focus:outline-none">
          View all
        </button>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start">
                  <Skeleton className="h-10 w-10 rounded-md" />
                  <div className="ml-3 space-y-2 flex-1">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-8 w-28" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !recommendations || recommendations.length === 0 ? (
        <Card>
          <CardContent className="p-5 text-center">
            <p className="text-neutral-500">No insights available yet. Keep tracking your habits to receive personalized recommendations.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((rec, index) => (
            <Card key={index}>
              <CardContent className="p-5">
                <div className="flex items-start">
                  <div className={`p-2 rounded-md ${rec.iconBg} ${rec.iconColor}`}>
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      {rec.icon === "lightbulb" && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      )}
                      {rec.icon === "exclamation-circle" && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                      {rec.icon === "trophy" && (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      )}
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-neutral-800">{rec.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{rec.description}</p>
                    <Button 
                      variant="link" 
                      className="mt-2 p-0 h-auto text-xs text-primary-500 hover:text-primary-600"
                      onClick={() => handleRecommendationAction(rec.actionLabel)}
                    >
                      {rec.actionLabel}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
