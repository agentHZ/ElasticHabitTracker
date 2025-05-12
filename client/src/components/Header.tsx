import { Button } from "@/components/ui/button";

interface HeaderProps {
  userName: string;
  onCreateHabit: () => void;
}

export default function Header({ userName, onCreateHabit }: HeaderProps) {
  // Capitalize first letter of the username
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <header className="mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-800">Welcome back, {displayName}</h1>
          <p className="mt-1 text-neutral-500">Here's how your habits are looking today</p>
        </div>
        <div className="mt-4 md:mt-0 flex">
          <Button 
            className="inline-flex items-center" 
            onClick={onCreateHabit}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Create Habit
          </Button>
        </div>
      </div>
    </header>
  );
}
