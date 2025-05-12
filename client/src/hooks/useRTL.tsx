import React, { createContext, useState, useContext, useEffect } from 'react';

type RTLContextType = {
  isRTL: boolean;
  toggleDirection: () => void;
  setDirection: (isRTL: boolean) => void;
};

const RTLContext = createContext<RTLContextType | undefined>(undefined);

export const RTLProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get initial direction from localStorage or default to LTR
  const [isRTL, setIsRTL] = useState<boolean>(() => {
    const savedDirection = localStorage.getItem('isRTL');
    return savedDirection ? JSON.parse(savedDirection) : false;
  });

  // Update document direction when isRTL changes
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    localStorage.setItem('isRTL', JSON.stringify(isRTL));
  }, [isRTL]);

  const toggleDirection = () => {
    setIsRTL((prev) => !prev);
  };

  const setDirection = (rtl: boolean) => {
    setIsRTL(rtl);
  };

  return (
    <RTLContext.Provider value={{ isRTL, toggleDirection, setDirection }}>
      {children}
    </RTLContext.Provider>
  );
};

export const useRTL = (): RTLContextType => {
  const context = useContext(RTLContext);
  if (context === undefined) {
    throw new Error('useRTL must be used within a RTLProvider');
  }
  return context;
};