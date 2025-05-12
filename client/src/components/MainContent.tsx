import React from 'react';
import { useRTL } from '@/hooks/useRTL';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  const { isRTL } = useRTL();
  
  return (
    <main className={cn(
      "flex-1 overflow-y-auto bg-neutral-50",
      isRTL ? "text-right" : "text-left"
    )}>
      {children}
    </main>
  );
}