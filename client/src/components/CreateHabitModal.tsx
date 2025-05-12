import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { HABIT_CATEGORIES, FREQUENCY_TYPES, insertHabitSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { HABIT_COLORS, HABIT_ICONS } from "@/lib/constants";

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onHabitCreated: () => void;
  userId: number;
}

// Extend the schema to add some UI validations
const createHabitFormSchema = insertHabitSchema.extend({
  title: z.string().min(1, "Habit name is required").max(50, "Name cannot exceed 50 characters"),
  microLevel: z.string().min(1, "Micro level description is required"),
  standardLevel: z.string().min(1, "Standard level description is required"),
  stretchLevel: z.string().min(1, "Stretch level description is required"),
});

type CreateHabitFormData = z.infer<typeof createHabitFormSchema>;

export default function CreateHabitModal({ isOpen, onClose, onHabitCreated, userId }: CreateHabitModalProps) {
  const { toast } = useToast();
  const [selectedFrequency, setSelectedFrequency] = useState<string>("daily");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<CreateHabitFormData>({
    resolver: zodResolver(createHabitFormSchema),
    defaultValues: {
      userId: userId,
      title: "",
      category: "health",
      frequency: "daily",
      microLevel: "",
      standardLevel: "",
      stretchLevel: "",
      color: "#4F46E5", // Default primary color
      icon: "star",
      reminderTime: "",
      active: true
    }
  });
  
  const onSubmit = async (data: CreateHabitFormData) => {
    setIsSubmitting(true);
    
    try {
      await apiRequest("POST", "/api/habits", data);
      toast({
        title: "Success",
        description: "Habit created successfully",
      });
      reset();
      onHabitCreated();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create habit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    reset();
    onClose();
  };
  
  const handleFrequencyChange = (value: string) => {
    setSelectedFrequency(value);
    setValue("frequency", value);
  };
  
  const handleCategoryChange = (value: string) => {
    setValue("category", value);
    // Set icon based on category
    switch (value) {
      case "health":
        setValue("icon", "running");
        setValue("color", "#4F46E5"); // Primary color
        break;
      case "productivity":
        setValue("icon", "briefcase");
        setValue("color", "#10B981"); // Green color
        break;
      case "mindfulness":
        setValue("icon", "brain");
        setValue("color", "#8B5CF6"); // Purple color
        break;
      case "learning":
        setValue("icon", "book");
        setValue("color", "#3B82F6"); // Blue color
        break;
      default:
        setValue("icon", "star");
        setValue("color", "#F59E0B"); // Amber color
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Habit</DialogTitle>
          <DialogDescription>
            Create a new habit with flexible levels to accommodate different energy levels and days.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="habit-name">Habit Name</Label>
            <Input 
              id="habit-name" 
              placeholder="E.g., Exercise, Reading, Meditation" 
              {...register("title")}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="habit-category">Category</Label>
            <Select 
              defaultValue="health" 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger id="habit-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {HABIT_CATEGORIES.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input type="hidden" {...register("category")} />
            {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label>Frequency</Label>
            <div className="flex flex-wrap gap-2">
              {FREQUENCY_TYPES.map((frequency) => (
                <Button
                  key={frequency}
                  type="button"
                  variant={selectedFrequency === frequency ? "default" : "outline"}
                  onClick={() => handleFrequencyChange(frequency)}
                  className="px-3 py-1 h-auto"
                >
                  {frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                </Button>
              ))}
            </div>
            <input type="hidden" {...register("frequency")} />
            {errors.frequency && <p className="text-sm text-red-500">{errors.frequency.message}</p>}
          </div>
          
          <div className="space-y-3">
            <Label>Elastic Levels</Label>
            
            <div className="bg-neutral-50 rounded-md p-4 mb-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="ml-2 text-sm font-medium text-neutral-700">Micro Level</span>
                </div>
                <span className="text-xs text-neutral-500">Minimum viable action</span>
              </div>
              <Input 
                placeholder="E.g., 5 min walk, Read 1 page" 
                {...register("microLevel")}
              />
              {errors.microLevel && <p className="text-sm text-red-500 mt-1">{errors.microLevel.message}</p>}
            </div>
            
            <div className="bg-neutral-50 rounded-md p-4 mb-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="ml-2 text-sm font-medium text-neutral-700">Standard Level</span>
                </div>
                <span className="text-xs text-neutral-500">Regular target</span>
              </div>
              <Input 
                placeholder="E.g., 15 min workout, Read 10 pages" 
                {...register("standardLevel")}
              />
              {errors.standardLevel && <p className="text-sm text-red-500 mt-1">{errors.standardLevel.message}</p>}
            </div>
            
            <div className="bg-neutral-50 rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span className="ml-2 text-sm font-medium text-neutral-700">Stretch Level</span>
                </div>
                <span className="text-xs text-neutral-500">Challenge yourself</span>
              </div>
              <Input 
                placeholder="E.g., 30 min intense workout, Read 25 pages" 
                {...register("stretchLevel")}
              />
              {errors.stretchLevel && <p className="text-sm text-red-500 mt-1">{errors.stretchLevel.message}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="habit-reminder">Reminders</Label>
            <div className="flex gap-2">
              <Input 
                id="habit-reminder" 
                type="time" 
                className="flex-1" 
                {...register("reminderTime")}
              />
            </div>
          </div>
          
          <input type="hidden" {...register("userId")} value={userId} />
          <input type="hidden" {...register("active")} value="true" />
          <input type="hidden" {...register("icon")} />
          <input type="hidden" {...register("color")} />
          
          <DialogFooter className="pt-4 border-t border-neutral-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
