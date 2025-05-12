import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface SettingsProps {
  user: {
    id: number;
    username: string;
  };
}

export default function Settings({ user }: SettingsProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: user.username,
      email: "alex@example.com", // Demo email
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    }
  });
  
  const [notifications, setNotifications] = useState({
    habitReminders: true,
    habitSuggestions: true,
    weeklyReport: true,
    achievements: true
  });
  
  const [theme, setTheme] = useState('light');
  
  const onProfileSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    }, 1000);
  };
  
  const onPasswordSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
    }, 1000);
  };
  
  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleExportData = () => {
    toast({
      title: "Data export started",
      description: "Your data export is being prepared. You'll receive a download link soon.",
    });
  };
  
  const handleDeleteAccount = () => {
    // Show confirmation dialog
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast({
        title: "Account deleted",
        description: "Your account has been deleted successfully.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800 mb-2">Settings</h1>
        <p className="text-neutral-500">Manage your account settings and preferences</p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="data">Data & Privacy</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      {...register("username", { required: "Username is required" })}
                    />
                    {errors.username && (
                      <p className="text-sm text-red-500">{errors.username.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address"
                        }
                      })}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Password</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password"
                      {...register("currentPassword", { required: "Current password is required" })}
                    />
                    {errors.currentPassword && (
                      <p className="text-sm text-red-500">{errors.currentPassword.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password"
                      {...register("newPassword", { 
                        required: "New password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters"
                        }
                      })}
                    />
                    {errors.newPassword && (
                      <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password"
                      {...register("confirmPassword", { 
                        required: "Please confirm your new password",
                        validate: (value, formValues) => 
                          value === formValues.newPassword || "Passwords do not match"
                      })}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                  
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Update Password"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Habit Reminders</h3>
                  <p className="text-sm text-neutral-500">Get reminders for habits you haven't completed yet</p>
                </div>
                <Switch 
                  checked={notifications.habitReminders} 
                  onCheckedChange={() => handleNotificationChange('habitReminders')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Habit Suggestions</h3>
                  <p className="text-sm text-neutral-500">Receive personalized suggestions and insights</p>
                </div>
                <Switch 
                  checked={notifications.habitSuggestions} 
                  onCheckedChange={() => handleNotificationChange('habitSuggestions')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Weekly Progress Report</h3>
                  <p className="text-sm text-neutral-500">Get a summary of your habit progress each week</p>
                </div>
                <Switch 
                  checked={notifications.weeklyReport} 
                  onCheckedChange={() => handleNotificationChange('weeklyReport')}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Achievement Notifications</h3>
                  <p className="text-sm text-neutral-500">Be notified when you reach milestones and earn achievements</p>
                </div>
                <Switch 
                  checked={notifications.achievements} 
                  onCheckedChange={() => handleNotificationChange('achievements')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize how Elastic Habits looks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-base font-medium mb-3">Theme</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant={theme === 'light' ? "default" : "outline"}
                    onClick={() => setTheme('light')}
                    className="w-24"
                  >
                    Light
                  </Button>
                  <Button 
                    variant={theme === 'dark' ? "default" : "outline"}
                    onClick={() => setTheme('dark')}
                    className="w-24"
                  >
                    Dark
                  </Button>
                  <Button 
                    variant={theme === 'system' ? "default" : "outline"}
                    onClick={() => setTheme('system')}
                    className="w-24"
                  >
                    System
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-base font-medium mb-3">Color Scheme</h3>
                <div className="flex flex-wrap gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary-500 cursor-pointer border-2 border-primary-600"></div>
                  <div className="w-12 h-12 rounded-full bg-blue-500 cursor-pointer"></div>
                  <div className="w-12 h-12 rounded-full bg-green-500 cursor-pointer"></div>
                  <div className="w-12 h-12 rounded-full bg-purple-500 cursor-pointer"></div>
                  <div className="w-12 h-12 rounded-full bg-rose-500 cursor-pointer"></div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium">Compact Mode</h3>
                  <p className="text-sm text-neutral-500">Show more content with reduced spacing</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="data">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Data Export</CardTitle>
                <CardDescription>Download your habit data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-neutral-600">
                  Export all your habit data in CSV or JSON format. This includes habit details, 
                  completions, and analytics.
                </p>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleExportData}>
                    Export as CSV
                  </Button>
                  <Button onClick={handleExportData}>
                    Export as JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-base font-medium mb-2">Delete Account</h3>
                  <p className="text-sm text-neutral-600 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                  <Button variant="destructive" onClick={handleDeleteAccount}>
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
