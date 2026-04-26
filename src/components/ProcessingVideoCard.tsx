import React, { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface ProcessingCardProps {
  videoId: string;
  title: string;
  onComplete: () => void;
}

export default function ProcessingVideoCard({ videoId, title, onComplete }: ProcessingCardProps) {
  const [progress, setProgress] = useState<number>(0);
  const [status, setStatus] = useState<string>('Starting...');

  // 🚨 THE FIX: Store the callback in a ref!
  // This ensures we always call the latest version of onComplete, 
  // but it prevents React from endlessly restarting the WebSocket.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    // We add 'transports: ["websocket"]' to bypass HTTP long-polling and force a direct WS connection
    const socket: Socket = io('http://localhost:3000', {
      transports: ['websocket'],
    }); 

    socket.on('connect', () => {
      console.log('🔌 WebSocket Connected!');
      setStatus('Waiting for worker...');
    });

    socket.on('video-progress', (data: { jobId: string; percent: number }) => {
      if (data.jobId === videoId) {
        setProgress(data.percent);
        
        if (data.percent < 10) setStatus('Downloading...');
        else if (data.percent < 90) setStatus('Transcoding...');
        else if (data.percent < 100) setStatus('Finalizing...');
        else {
          setStatus('Ready!');
          socket.disconnect();
          
          setTimeout(() => {
             // 🚨 Call it via the ref!
            onCompleteRef.current();
          }, 1000); 
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  // 🚨 CRITICAL: We removed onComplete from this array. It only depends on videoId now!
  }, [videoId]); 

  return (
    <div className="relative min-w-[250px] h-[140px] bg-gray-900 rounded-md border border-gray-800 flex flex-col justify-center items-center p-4 shadow-inner">
      <div className="mb-3">
        <svg className="animate-spin h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <p className="text-white text-sm font-semibold truncate w-full text-center mb-2">
        {title || 'Uploading...'}
      </p>

      <div className="w-full bg-gray-700 rounded-full h-2 mb-1 overflow-hidden">
        <div 
          className="bg-red-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="flex justify-between w-full text-xs text-gray-400 font-mono">
        <span>{status}</span>
        <span>{progress}%</span>
      </div>
    </div>
  );
}