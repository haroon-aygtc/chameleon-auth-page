
import { useState } from 'react';

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };
  
  return {
    isCollapsed,
    toggleSidebar
  };
}
