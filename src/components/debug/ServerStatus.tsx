"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

interface ServerStatusProps {
  className?: string;
}

export default function ServerStatus({ className = "" }: ServerStatusProps) {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkServer = async () => {
      try {
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/health`);
        setStatus('online');
        setError(null);
      } catch (err) {
        setStatus('offline');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    checkServer();
  }, []);

  return (
    <div className={`text-xs ${className}`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          status === 'online' ? 'bg-green-500' : 
          status === 'offline' ? 'bg-red-500' : 
          'bg-yellow-500'
        }`} />
        <span>
          Server: {status === 'online' ? 'Online' : status === 'offline' ? 'Offline' : 'Checking...'}
        </span>
      </div>
      {error && (
        <div className="text-red-500 mt-1">
          Error: {error}
        </div>
      )}
      <div className="text-gray-500 mt-1">
        API URL: {process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}
      </div>
    </div>
  );
}
