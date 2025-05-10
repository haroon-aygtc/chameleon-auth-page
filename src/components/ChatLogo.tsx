
import React from 'react';
import { cn } from '@/lib/utils';

interface ChatLogoProps {
  className?: string;
  variant?: 'default' | 'compact';
}

const ChatLogo: React.FC<ChatLogoProps> = ({ className = "", variant = 'default' }) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="bg-chatgold/20 p-2 rounded-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={variant === 'compact' ? "18" : "24"}
          height={variant === 'compact' ? "18" : "24"}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-chatgold"
        >
          <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
        </svg>
      </div>
      {variant === 'default' && (
        <span className={cn("font-medium text-chatgold", variant === 'compact' ? 'text-sm' : '')}>
          ChatAdmin
        </span>
      )}
    </div>
  );
};

export default ChatLogo;
