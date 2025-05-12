import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface HelpProps {
  user: {
    id: number;
    username: string;
  };
}

export default function Help({ user }: HelpProps) {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800 mb-2">Help & Support</h1>
        <p className="text-neutral-500">Find answers to common questions and learn how to use Elastic Habits</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary-50 border-primary-100">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-primary-100 text-primary-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-800 mb-2">Getting Started</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Learn the basics of Elastic Habits and how to set up your first habit.
              </p>
              <Button variant="outline" className="w-full">
                View Guide
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-800 mb-2">FAQ</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Find answers to commonly asked questions about using Elastic Habits.
              </p>
              <Button variant="outline" className="w-full">
                View FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 rounded-full bg-green-100 text-green-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-800 mb-2">Contact Support</h3>
              <p className="text-sm text-neutral-600 mb-4">
                Still need help? Contact our support team for assistance.
              </p>
              <Button variant="outline" className="w-full">
                Contact Us
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Common questions about using Elastic Habits</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is the concept of "elastic habits"?</AccordionTrigger>
              <AccordionContent>
                <p className="text-neutral-600">
                  Elastic habits are flexible routines that allow for different levels of commitment based on your energy, time, and motivation on any given day. Unlike rigid habits that are either done or not done, elastic habits give you three options for completion: a mini version (micro), a standard version, and an advanced version (stretch). This flexibility makes it easier to maintain consistency even on challenging days.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I create a new habit?</AccordionTrigger>
              <AccordionContent>
                <p className="text-neutral-600">
                  To create a new habit, click the "Create Habit" button on the dashboard. You'll need to provide a name for your habit, select a category, and define the three levels of commitment: micro, standard, and stretch. The micro level should be very easy to accomplish (taking only 1-2 minutes), the standard level represents your normal goal, and the stretch level challenges you to do more when you have extra time or energy.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>How do streaks work with elastic habits?</AccordionTrigger>
              <AccordionContent>
                <p className="text-neutral-600">
                  With elastic habits, your streak continues as long as you complete any level of your habit (micro, standard, or stretch). This approach helps maintain momentum and consistency even on days when you can only accomplish the minimum. The app tracks your streaks for each habit individually, and also shows your longest active streak across all habits.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>What are the benefits of the micro level?</AccordionTrigger>
              <AccordionContent>
                <p className="text-neutral-600">
                  The micro level serves several important purposes:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-neutral-600">
                  <li>It provides a low barrier to entry on difficult days</li>
                  <li>It helps maintain your habit streak even when you're busy or low on energy</li>
                  <li>It reinforces the habit loop in your brain</li>
                  <li>It often leads to doing more once you've started</li>
                  <li>It eliminates the "all or nothing" mindset that causes many habit attempts to fail</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>How are recommendations generated?</AccordionTrigger>
              <AccordionContent>
                <p className="text-neutral-600">
                  The recommendations are based on patterns in your habit completion data. The system analyzes factors such as:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-neutral-600">
                  <li>Which days of the week you're most/least successful</li>
                  <li>Which habits have the highest/lowest completion rates</li>
                  <li>Patterns of which habit levels you typically complete</li>
                  <li>Times of day when you tend to complete habits</li>
                  <li>Habits that may be at risk of breaking their streak</li>
                </ul>
                <p className="mt-2 text-neutral-600">
                  Based on this analysis, the system provides personalized suggestions to help you improve your consistency and success rate.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>Can't find what you're looking for? Send us a message</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Name</label>
                <Input id="name" placeholder="Your name" defaultValue={user.username} />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input id="email" type="email" placeholder="Your email address" defaultValue="alex@example.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="text-sm font-medium">Subject</label>
              <Input id="subject" placeholder="Brief summary of your issue" />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">Message</label>
              <textarea 
                id="message" 
                rows={5} 
                placeholder="Describe your issue in detail"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>
            
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="attach-logs" className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500" />
              <label htmlFor="attach-logs" className="text-sm text-neutral-600">Include app logs to help with troubleshooting</label>
            </div>
            
            <Separator />
            
            <div className="flex justify-end">
              <Button type="submit">
                Send Message
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
