import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-amber-600 text-white text-xs sm:text-sm font-medium px-4 py-2 flex items-center justify-center gap-2 shadow-sm sticky top-0 z-50">
      <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
      <span>
        You are currently offline. Educational guides remain accessible, but online report submission requires an internet connection.
      </span>
    </div>
  );
};
