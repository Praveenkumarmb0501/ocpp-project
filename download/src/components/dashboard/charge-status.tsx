'use client';

import { useState, useEffect, useRef } from 'react';
import { Zap } from 'lucide-react';

type ChargeStatusProps = {
  isCharging: boolean;
};

export function ChargeStatus({ isCharging }: ChargeStatusProps) {
  const [battery, setBattery] = useState(0);
  const notificationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Effect for handling battery percentage simulation
  useEffect(() => {
    if (!isCharging) {
      return;
    }
    // Set a random starting point when charging begins or component mounts
    if (battery === 0) {
      const randomStart = Math.floor(Math.random() * 40) + 20;
      setBattery(randomStart);
    }
    
    const interval = setInterval(() => {
        setBattery(prev => (prev >= 100 ? 100 : prev + 1));
      }, 60000); // 1% per minute
      
    return () => clearInterval(interval);
  }, [isCharging, battery]);

  // Effect for handling notifications
  useEffect(() => {
    if (isCharging && battery > 0 && battery < 100) {
      // Request permission when charging starts
      if (Notification.permission !== 'granted') {
        Notification.requestPermission();
      }

      // Clear any existing interval
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
      }

      // Set up the notification interval
      notificationIntervalRef.current = setInterval(() => {
        if (Notification.permission === 'granted') {
          const progress = Math.floor(battery);
          const notification = new Notification('Charging Update', {
            body: `Your vehicle is now at ${progress}% charge.`,
            icon: '/favicon.ico', // Optional: you can add an icon
            silent: true, // To make it less intrusive
          });
        }
      }, 600000); // 10 minutes

    } else {
      // If not charging or charge is complete, clear the interval
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
        notificationIntervalRef.current = null;
      }
    }

    // Cleanup on component unmount
    return () => {
      if (notificationIntervalRef.current) {
        clearInterval(notificationIntervalRef.current);
      }
    };
  }, [isCharging, battery]);

  useEffect(() => {
    // Reset battery if charging stops
    if(!isCharging) {
        // Stays at the current level when stopped.
    } else {
        // If charging starts and battery is 100 or 0, reset it to a baseline
        if(battery >= 100 || battery === 0) {
            setBattery(20);
        }
    }
  }, [isCharging]);

  const circumference = 2 * Math.PI * 52;
  const offset = circumference - (battery / 100) * circumference;

  return (
    <div className="flex items-center justify-center py-4">
      <div className="relative w-48 h-48">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            className="text-secondary"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="52"
            cx="60"
            cy="60"
          />
          <circle
            className="text-primary"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="52"
            cx="60"
            cy="60"
            strokeLinecap="round"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 1.5s ease-in-out',
            }}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isCharging && battery < 100 && (
                <Zap className="w-6 h-6 text-primary mb-1 animate-pulse" />
            )}
          <span className="text-4xl font-bold text-primary">{battery}%</span>
          <span className="text-sm text-muted-foreground">{ isCharging && battery < 100 ? 'Charging' : (battery >= 100 ? 'Charged' : 'Paused')}</span>
        </div>
      </div>
    </div>
  );
}
