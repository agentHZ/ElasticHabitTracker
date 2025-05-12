// This file provides a set of icon components used throughout the application

import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

export const HabitIcons = {
  Running: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M13 4v16"></path>
      <path d="M17 4v16"></path>
      <path d="M19 16V8"></path>
      <path d="M5 16c.5 0 1-.2 1.4-.6.4-.4.6-.9.6-1.4V5"></path>
      <path d="M8.5 9L5 6.5"></path>
      <path d="M5 8v8"></path>
    </svg>
  ),
  
  Book: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  ),
  
  Brain: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.5"></path>
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.5"></path>
      <path d="M12 15a2.5 2.5 0 1 0 0-5 2.5 2.5 0 1 0 0 5Z"></path>
      <path d="M7 9a2.5 2.5 0 1 0 0 5"></path>
      <path d="M17 9a2.5 2.5 0 1 1 0 5"></path>
    </svg>
  ),
  
  Briefcase: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
  ),
  
  Star: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
    </svg>
  ),
  
  Home: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  
  ChartLine: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18"></path>
      <path d="m19 9-5 5-4-4-3 3"></path>
    </svg>
  ),
  
  Cog: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"></path>
      <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"></path>
      <path d="M12 2v2"></path>
      <path d="M12 22v-2"></path>
      <path d="m17 20.66-1-1.73"></path>
      <path d="M11 10.27 7 3.34"></path>
      <path d="m20.66 17-1.73-1"></path>
      <path d="m3.34 7 1.73 1"></path>
      <path d="M14 12h8"></path>
      <path d="M2 12h2"></path>
      <path d="m20.66 7-1.73 1"></path>
      <path d="m3.34 17 1.73-1"></path>
      <path d="m17 3.34-1 1.73"></path>
      <path d="m7 20.66 1-1.73"></path>
    </svg>
  ),
  
  QuestionCircle: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
      <path d="M12 17h.01"></path>
    </svg>
  ),
  
  Fire: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
    </svg>
  ),
  
  CheckCircle: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  ),
  
  Lightning: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"></path>
    </svg>
  ),
  
  CalendarCheck: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
      <line x1="16" x2="16" y1="2" y2="6"></line>
      <line x1="8" x2="8" y1="2" y2="6"></line>
      <line x1="3" x2="21" y1="10" y2="10"></line>
      <path d="m9 16 2 2 4-4"></path>
    </svg>
  ),
  
  Lightbulb: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
      <path d="M9 18h6"></path>
      <path d="M10 22h4"></path>
    </svg>
  ),
  
  Trophy: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
      <path d="M4 22h16"></path>
      <path d="M10 14a2 2 0 0 0 4 0v-4h-4v4Z"></path>
      <path d="M18 9H6a4 4 0 0 0 0 8h12a4 4 0 0 0 0-8Z"></path>
    </svg>
  ),
  
  ExclamationCircle: ({ className, size = 24 }: IconProps) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="12" y1="8" x2="12" y2="12"></line>
      <line x1="12" y1="16" x2="12.01" y2="16"></line>
    </svg>
  )
};

export default HabitIcons;
