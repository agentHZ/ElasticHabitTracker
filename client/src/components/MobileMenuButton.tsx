import React from 'react';
import { useRTL } from '@/hooks/useRTL';
import { cn } from '@/lib/utils';

interface MobileMenuButtonProps {
  onClick: () => void;
}

export default function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  const { isRTL } = useRTL();
  
  return (
    <div className={cn(
      "lg:hidden fixed top-0 z-20 m-4",
      isRTL ? "right-0" : "left-0"
    )}>
      <button 
        className="p-2 bg-white rounded-md shadow-md text-neutral-500 hover:text-primary-500 focus:outline-none"
        onClick={onClick}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className={cn(
            "h-6 w-6",
            isRTL && "flip-in-rtl"
          )}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}