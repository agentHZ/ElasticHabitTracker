import { Link, useLocation } from "wouter";
import { useRTL } from "@/hooks/useRTL";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: number;
    username: string;
  };
}

export default function Sidebar({ isOpen, onClose, user }: SidebarProps) {
  const [location] = useLocation();
  const { isRTL } = useRTL();
  
  const menuItems = [
    { 
      path: "/", 
      icon: "home", 
      label: isRTL ? "لوحة التحكم" : "Dashboard" 
    },
    { 
      path: "/analytics", 
      icon: "chart-line", 
      label: isRTL ? "التحليلات" : "Analytics" 
    },
    { 
      path: "/settings", 
      icon: "cog", 
      label: isRTL ? "الإعدادات" : "Settings" 
    },
    { 
      path: "/help", 
      icon: "question-circle", 
      label: isRTL ? "المساعدة" : "Help"
    }
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-neutral-900 bg-opacity-50 z-10"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          isOpen 
            ? `fixed inset-y-0 ${isRTL ? 'right-0' : 'left-0'} z-20` 
            : 'hidden',
          "lg:flex flex-col w-64 bg-white h-full",
          isRTL ? "border-l border-neutral-200" : "border-r border-neutral-200"
        )}
      >
        <div className="p-5 border-b border-neutral-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-500 rounded-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className={cn("h-5 w-5 text-white", isRTL && "flip-in-rtl")} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className={`${isRTL ? 'mr-3' : 'ml-3'} text-xl font-semibold text-neutral-800`}>
              {isRTL ? 'العادات المرنة' : 'Elastic Habits'}
            </h1>
          </div>
        </div>
        
        <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.path}>
              <Link 
                href={item.path}
                onClick={() => {
                  if (isOpen) onClose();
                }}
              >
                <div 
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-md cursor-pointer
                    ${location === item.path 
                      ? 'bg-primary-50 text-primary-600' 
                      : 'text-neutral-600 hover:bg-neutral-100'}
                  `}
                >
                  <i className={cn(
                    `fas fa-${item.icon}`,
                    location === item.path ? 'text-primary-500' : 'text-neutral-500',
                    isRTL ? 'ml-3' : 'mr-3',
                    isRTL && 'flip-in-rtl'
                  )}></i>
                  {item.label}
                </div>
              </Link>
            </div>
          ))}
        </nav>
        
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-neutral-300 flex items-center justify-center text-neutral-600">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
              <p className="text-sm font-medium text-neutral-800">{user.username}</p>
              <p className="text-xs text-neutral-500">alex@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
