'use client';

import type React from 'react';

import { format, isWithinInterval, parseISO } from 'date-fns';
import { useEffect, useMemo, useState, useRef } from 'react';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import {
  MapPinIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  GlobeIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WeatherAtLocation {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
  };
  hourly_units: {
    time: string;
    temperature_2m: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
  daily_units: {
    time: string;
    sunrise: string;
    sunset: string;
  };
  daily: {
    time: string[];
    sunrise: string[];
    sunset: string[];
  };
  locationName: string;
  locationDetails?: {
    name: string;
    state?: string;
    country: string;
  };
}

const SAMPLE = {
  latitude: 37.763283,
  longitude: -122.41286,
  generationtime_ms: 0.027894973754882812,
  utc_offset_seconds: 0,
  timezone: 'GMT',
  timezone_abbreviation: 'GMT',
  elevation: 18,
  current_units: { time: 'iso8601', interval: 'seconds', temperature_2m: '°C' },
  current: { time: '2024-10-07T19:30', interval: 900, temperature_2m: 29.3 },
  hourly_units: { time: 'iso8601', temperature_2m: '°C' },
  hourly: {
    time: [
      '2024-10-07T00:00',
      '2024-10-07T01:00',
      '2024-10-07T02:00',
      '2024-10-07T03:00',
      '2024-10-07T04:00',
      '2024-10-07T05:00',
      '2024-10-07T06:00',
      '2024-10-07T07:00',
      '2024-10-07T08:00',
      '2024-10-07T09:00',
      '2024-10-07T10:00',
      '2024-10-07T11:00',
      '2024-10-07T12:00',
      '2024-10-07T13:00',
      '2024-10-07T14:00',
      '2024-10-07T15:00',
      '2024-10-07T16:00',
      '2024-10-07T17:00',
      '2024-10-07T18:00',
      '2024-10-07T19:00',
      '2024-10-07T20:00',
      '2024-10-07T21:00',
      '2024-10-07T22:00',
      '2024-10-07T23:00',
      '2024-10-08T00:00',
      '2024-10-08T01:00',
      '2024-10-08T02:00',
      '2024-10-08T03:00',
      '2024-10-08T04:00',
      '2024-10-08T05:00',
      '2024-10-08T06:00',
      '2024-10-08T07:00',
      '2024-10-08T08:00',
      '2024-10-08T09:00',
      '2024-10-08T10:00',
      '2024-10-08T11:00',
      '2024-10-08T12:00',
      '2024-10-08T13:00',
      '2024-10-08T14:00',
      '2024-10-08T15:00',
      '2024-10-08T16:00',
      '2024-10-08T17:00',
      '2024-10-08T18:00',
      '2024-10-08T19:00',
      '2024-10-08T20:00',
      '2024-10-08T21:00',
      '2024-10-08T22:00',
      '2024-10-08T23:00',
      '2024-10-09T00:00',
      '2024-10-09T01:00',
      '2024-10-09T02:00',
      '2024-10-09T03:00',
      '2024-10-09T04:00',
      '2024-10-09T05:00',
      '2024-10-09T06:00',
      '2024-10-09T07:00',
      '2024-10-09T08:00',
      '2024-10-09T09:00',
      '2024-10-09T10:00',
      '2024-10-09T11:00',
      '2024-10-09T12:00',
      '2024-10-09T13:00',
      '2024-10-09T14:00',
      '2024-10-09T15:00',
      '2024-10-09T16:00',
      '2024-10-09T17:00',
      '2024-10-09T18:00',
      '2024-10-09T19:00',
      '2024-10-09T20:00',
      '2024-10-09T21:00',
      '2024-10-09T22:00',
      '2024-10-09T23:00',
      '2024-10-10T00:00',
      '2024-10-10T01:00',
      '2024-10-10T02:00',
      '2024-10-10T03:00',
      '2024-10-10T04:00',
      '2024-10-10T05:00',
      '2024-10-10T06:00',
      '2024-10-10T07:00',
      '2024-10-10T08:00',
      '2024-10-10T09:00',
      '2024-10-10T10:00',
      '2024-10-10T11:00',
      '2024-10-10T12:00',
      '2024-10-10T13:00',
      '2024-10-10T14:00',
      '2024-10-10T15:00',
      '2024-10-10T16:00',
      '2024-10-10T17:00',
      '2024-10-10T18:00',
      '2024-10-10T19:00',
      '2024-10-10T20:00',
      '2024-10-10T21:00',
      '2024-10-10T22:00',
      '2024-10-10T23:00',
      '2024-10-11T00:00',
      '2024-10-11T01:00',
      '2024-10-11T02:00',
      '2024-10-11T03:00',
    ],
    temperature_2m: [
      36.6, 32.8, 29.5, 28.6, 29.2, 28.2, 27.5, 26.6, 26.5, 26, 25, 23.5, 23.9,
      24.2, 22.9, 21, 24, 28.1, 31.4, 33.9, 32.1, 28.9, 26.9, 25.2, 23, 21.1,
      19.6, 18.6, 17.7, 16.8, 16.2, 15.5, 14.9, 14.4, 14.2, 13.7, 13.3, 12.9,
      12.5, 13.5, 15.8, 17.7, 19.6, 21, 21.9, 22.3, 22, 20.7, 18.9, 17.9, 17.3,
      17, 16.7, 16.2, 15.6, 15.2, 15, 15, 15.1, 14.8, 14.8, 14.9, 14.7, 14.8,
      15.3, 16.2, 17.9, 19.6, 20.5, 21.6, 21, 20.7, 19.3, 18.7, 18.4, 17.9,
      17.3, 17, 17, 16.8, 16.4, 16.2, 16, 15.8, 15.7, 15.4, 15.4, 16.1, 16.7,
      17, 18.6, 19, 19.5, 19.4, 18.5, 17.9, 17.5, 16.7, 16.3, 16.1,
    ],
  },
  daily_units: {
    time: 'iso8601',
    sunrise: 'iso8601',
    sunset: 'iso8601',
  },
  daily: {
    time: [
      '2024-10-07',
      '2024-10-08',
      '2024-10-09',
      '2024-10-10',
      '2024-10-11',
    ],
    sunrise: [
      '2024-10-07T07:15',
      '2024-10-08T07:16',
      '2024-10-09T07:17',
      '2024-10-10T07:18',
      '2024-10-11T07:19',
    ],
    sunset: [
      '2024-10-07T19:00',
      '2024-10-08T18:58',
      '2024-10-09T18:57',
      '2024-10-10T18:55',
      '2024-10-11T18:54',
    ],
  },
  locationName: 'Dhaka',
  locationDetails: {
    name: 'Dhaka',
    state: 'Dhaka Division',
    country: 'Bangladesh',
  },
};

function n(num: number): number {
  return Math.ceil(num);
}
const CustomLabel = ({ viewBox, data, isDay }: any) => {
  if (!viewBox) return <g />; // Return empty group instead of null

  // Find the data point for current time
  if (!data) return <g />;

  // Get the y-coordinate for the current temperature
  const y = data.y || viewBox.y;
  const x = viewBox.x;

  return <CurrentTimeIndicator x={x} y={y} isDay={isDay} />;
};

const CustomTooltip = ({ active, payload, label, isDay }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`p-2 rounded-lg shadow-lg ${isDay ? 'bg-white' : 'bg-gray-900'} border ${isDay ? 'border-gray-100' : 'border-gray-700'}`}
      >
        <p
          className={`text-xs font-medium ${isDay ? 'text-gray-800' : 'text-gray-100'}`}
        >
          {format(parseISO(label), 'h:mm a')}
        </p>
        <p
          className={`text-sm font-bold ${isDay ? 'text-sky-600' : 'text-sky-400'}`}
        >{`${payload[0].value}°C`}</p>
      </div>
    );
  }
  return null;
};

// Weather icons based on time of day
const WeatherIcon = ({ isDay }: { isDay: boolean }) => {
  return (
    <div
      className={cn(
        'relative w-16 h-16 flex items-center justify-center',
        isDay
          ? 'bg-gradient-to-br from-amber-300 to-amber-500'
          : 'bg-gradient-to-br from-indigo-700 to-indigo-900',
        'rounded-full shadow-lg',
      )}
    >
      {isDay ? (
        // Sun icon with rays
        <>
          <div className="absolute inset-0 rounded-full bg-amber-400 opacity-30 animate-pulse" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-10 h-10"
          >
            <circle cx="12" cy="12" r="5" />
            <path
              d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
              strokeWidth="2"
            />
          </svg>
        </>
      ) : (
        // Moon icon with stars
        <>
          <div className="absolute inset-0 rounded-full bg-indigo-500 opacity-20 animate-pulse" />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="white"
            className="w-10 h-10"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
          <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full" />
          <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-white rounded-full" />
        </>
      )}
    </div>
  );
};

// Location display component
const LocationDisplay = ({
  locationDetails,
  isDay,
}: {
  locationDetails?: { name: string; state?: string; country: string };
  isDay: boolean;
}) => {
  if (!locationDetails) return null;

  const { name, state, country } = locationDetails;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5">
        <MapPinIcon className="w-5 h-5 text-white" />
        <h2 className="text-2xl font-bold text-white tracking-tight truncate">
          {name}
        </h2>
      </div>

      <div className="flex items-center mt-0.5 ml-6">
        <div
          className={cn(
            'text-xs font-medium px-2 py-0.5 rounded-full',
            isDay ? 'bg-white/20 text-white' : 'bg-white/10 text-white/90',
          )}
        >
          <span className="flex items-center gap-1">
            <GlobeIcon className="w-3 h-3" />
            {state ? `${state}, ${country}` : country}
          </span>
        </div>
      </div>
    </div>
  );
};

// Custom current time indicator component
const CurrentTimeIndicator = ({
  x,
  y,
  isDay,
}: { x: number; y: number; isDay: boolean }) => {
  return (
    <g>
      {/* Vertical line */}
      <line
        x1={x}
        y1={0}
        x2={x}
        y2={y}
        stroke={isDay ? 'rgba(14, 165, 233, 0.8)' : 'rgba(129, 140, 248, 0.8)'}
        strokeWidth={2}
        strokeDasharray="4 2"
      />

      {/* Circle indicator at the data point */}
      <circle
        cx={x}
        cy={y}
        r={4}
        fill={isDay ? '#0ea5e9' : '#818cf8'}
        stroke={isDay ? '#ffffff' : '#1e293b'}
        strokeWidth={2}
        className="animate-pulse"
      />

      {/* "Now" label */}
      <text
        x={x}
        y={y - 10}
        textAnchor="middle"
        fill={isDay ? '#0369a1' : '#818cf8'}
        fontSize={10}
        fontWeight="bold"
        className="text-xs"
      >
        Now
      </text>
    </g>
  );
};

// Add a new wrapper component that completely isolates the weather widget
export function Weather({
  weatherAtLocation = SAMPLE,
}: {
  weatherAtLocation?: WeatherAtLocation;
}) {
  const currentHigh = Math.max(
    ...weatherAtLocation.hourly.temperature_2m.slice(0, 24),
  );
  const currentLow = Math.min(
    ...weatherAtLocation.hourly.temperature_2m.slice(0, 24),
  );
  const isDay = isWithinInterval(new Date(weatherAtLocation.current.time), {
    start: new Date(weatherAtLocation.daily.sunrise[0]),
    end: new Date(weatherAtLocation.daily.sunset[0]),
  });

  const [isMobile, setIsMobile] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Create a ref for the container
  const containerRef = useRef<HTMLDivElement>(null);
  // Create a ref for the chart
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Improved scroll handling to prevent propagation but allow natural scrolling
    const handleWheel = (e: WheelEvent) => {
      // Stop propagation to parent elements
      e.stopPropagation();

      // Don't prevent default scrolling behavior - this allows natural scrolling
      // Only prevent default if we're at the boundaries to avoid page scroll
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop <= 0 && e.deltaY < 0;
      const isAtBottom =
        scrollTop + clientHeight >= scrollHeight - 10 && e.deltaY > 0;

      if (isAtTop || isAtBottom) {
        e.preventDefault();
      }
    };

    container.addEventListener('wheel', handleWheel, {
      passive: false,
      capture: true,
    });

    return () => {
      container.removeEventListener('wheel', handleWheel, { capture: true });
    };
  }, []);

  // Add touch event handling for mobile scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let startY = 0;
    let startScrollTop = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startScrollTop = container.scrollTop;

      // Prevent parent elements from handling this touch
      e.stopPropagation();
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = startY - e.touches[0].clientY;
      container.scrollTop = startScrollTop + deltaY;

      // Prevent default only if we're scrolling inside the container
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop <= 0 && deltaY < 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight && deltaY > 0;

      if (!isAtTop && !isAtBottom) {
        e.preventDefault();
      }

      e.stopPropagation();
    };

    container.addEventListener('touchstart', handleTouchStart, {
      passive: false,
    });
    container.addEventListener('touchmove', handleTouchMove, {
      passive: false,
    });

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const chartData = useMemo(() => {
    const currentTimeIndex = weatherAtLocation.hourly.time.findIndex(
      (time) => new Date(time) >= new Date(weatherAtLocation.current.time),
    );
    const startIndex = Math.max(0, currentTimeIndex - 6);
    const sliceLength = 24;

    return weatherAtLocation.hourly.time
      .slice(startIndex, startIndex + sliceLength)
      .map((time, index) => ({
        time,
        temp: weatherAtLocation.hourly.temperature_2m[startIndex + index],
        unit: weatherAtLocation.hourly_units.temperature_2m,
        isCurrent: time === weatherAtLocation.current.time,
      }));
  }, [weatherAtLocation]);

  const hoursToShow = isMobile ? 5 : 8;
  const currentTimeIndex = weatherAtLocation.hourly.time.findIndex(
    (time) => new Date(time) >= new Date(weatherAtLocation.current.time),
  );
  const displayTimes = weatherAtLocation.hourly.time.slice(
    currentTimeIndex,
    currentTimeIndex + hoursToShow,
  );
  const displayTemperatures = weatherAtLocation.hourly.temperature_2m.slice(
    currentTimeIndex,
    currentTimeIndex + hoursToShow,
  );

  // Update these parts in your Weather component

  useEffect(() => {
    // Create style element with more aggressive isolation
    const style = document.createElement('style');
    style.innerHTML = `
    .weather-widget-container {
      position: relative;
      z-index: 50;
      isolation: isolate;
      touch-action: pan-y;
      max-height: 85vh;
      overflow-y: auto;
      width: 100%; /* Ensure it respects container width */
      box-sizing: border-box; /* Include padding in width calculations */
    }
    
    @media (max-width: 640px) {
      .weather-widget-container {
        max-width: 95%;
        margin: 0 auto;
      }
    }
    
    .weather-widget-container * {
      pointer-events: auto;
      touch-action: auto;
    }
    
    .chart-container {
      isolation: isolate;
      pointer-events: auto;
      width: 100%; /* Make chart container responsive */
    }
    
    .chart-container .recharts-wrapper {
      pointer-events: auto;
      touch-action: auto;
      width: 100% !important; /* Force chart to take full width */
    }
    
    /* Rest of your styles... */
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);
  // Create a function to handle all events
  const stopAllEvents = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    // Mark the element as being interacted with
    if (containerRef.current) {
      containerRef.current.dataset.interacting = 'true';

      // Set a global flag that can be checked by the scroll handler
      window.weatherComponentInteracting = true;

      // Clear the flag after a short delay
      clearTimeout(window.weatherInteractionTimer);
      window.weatherInteractionTimer = setTimeout(() => {
        window.weatherComponentInteracting = false;
        if (containerRef.current) {
          delete containerRef.current.dataset.interacting;
        }
      }, 500) as unknown as number;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        'w-full mx-auto overflow-y-auto rounded-2xl shadow-xl weather-widget-container',
        // Adjust width based on screen size
        'max-w-[95vw] sm:max-w-[85vw] md:max-w-3xl', // More adaptive width constraints
        isDay
          ? 'bg-gradient-to-br from-sky-50 via-white to-blue-50 border border-sky-100'
          : 'bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 border border-gray-700',
      )}
      onClick={stopAllEvents}
      onMouseDown={stopAllEvents}
      onMouseUp={stopAllEvents}
      onMouseMove={stopAllEvents}
      onMouseEnter={stopAllEvents}
      onMouseLeave={(e) => {
        stopAllEvents(e);
        // Clear the interaction flag
        window.weatherComponentInteracting = false;
        if (containerRef.current) {
          delete containerRef.current.dataset.interacting;
        }
      }}
      onWheel={(e) => {
        // Prevent wheel events from propagating
        e.stopPropagation();
      }}
      onTouchStart={stopAllEvents}
      onTouchMove={stopAllEvents}
      onTouchEnd={stopAllEvents}
    >
      {/* Enhanced Location Header with Detailed Information */}
      <div
        className={cn(
          'relative overflow-hidden',
          isDay
            ? 'bg-gradient-to-r from-sky-500 to-blue-600'
            : 'bg-gradient-to-r from-indigo-900 to-purple-900',
        )}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="weatherPattern"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="10" cy="10" r="1" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#weatherPattern)" />
          </svg>
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between py-3 px-5 gap-2">
          {/* Location information with name, state, country */}
          <LocationDisplay
            locationDetails={weatherAtLocation.locationDetails}
            isDay={isDay}
          />

          <div className="flex items-center gap-2 text-white/80 ml-6 sm:ml-0">
            <CalendarIcon className="w-4 h-4" />
            <span className="text-sm">
              {format(
                parseISO(weatherAtLocation.current.time),
                'MMM d, h:mm a',
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col sm:flex-row w-full">
        {/* Left Column - Current Weather */}
        <div className="w-full sm:w-1/3 p-4 flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700">
          <WeatherIcon isDay={isDay} />

          <div className="mt-3 text-center">
            <div
              className={cn(
                'text-4xl font-bold',
                isDay ? 'text-gray-900' : 'text-white',
              )}
            >
              {n(weatherAtLocation.current.temperature_2m)}
              {weatherAtLocation.current_units.temperature_2m}
            </div>

            <div className="flex items-center justify-center gap-4 mt-2">
              <div
                className={cn(
                  'flex items-center gap-1',
                  isDay ? 'text-amber-600' : 'text-sky-400',
                )}
              >
                <ArrowUpIcon className="w-3 h-3" />
                <span className="text-sm font-medium">{n(currentHigh)}°</span>
              </div>
              <div
                className={cn(
                  'flex items-center gap-1',
                  isDay ? 'text-sky-600' : 'text-indigo-400',
                )}
              >
                <ArrowDownIcon className="w-3 h-3" />
                <span className="text-sm font-medium">{n(currentLow)}°</span>
              </div>
            </div>

            <div
              className={cn(
                'mt-2 text-xs px-3 py-1 rounded-full inline-block',
                isDay
                  ? 'bg-sky-100 text-sky-800'
                  : 'bg-indigo-900/50 text-indigo-200',
              )}
            >
              {isDay ? 'Daytime' : 'Nighttime'}
            </div>

            {/* Timezone information */}
            <div className="mt-2 text-xs text-center">
              <span
                className={cn(
                  'text-xs',
                  isDay ? 'text-gray-500' : 'text-gray-400',
                )}
              >
                {weatherAtLocation.timezone} (
                {weatherAtLocation.timezone_abbreviation})
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Chart and Hourly Forecast */}
        <div className="w-full sm:w-2/3 p-4">
          {/* Temperature Chart */}
          <div className="h-24 mb-4 relative chart-container w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
                ref={chartRef}
              >
                <defs>
                  <linearGradient id="dayGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isDay ? '#0ea5e9' : '#818cf8'}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={isDay ? '#0ea5e9' : '#818cf8'}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  opacity={0.2}
                />
                <XAxis
                  dataKey="time"
                  tick={{ fill: isDay ? '#64748b' : '#94a3b8', fontSize: 9 }}
                  tickFormatter={(time) => format(parseISO(time), 'ha')}
                  axisLine={false}
                  tickLine={false}
                  padding={{ left: 5, right: 5 }}
                  interval={isMobile ? 3 : 2}
                />
                <YAxis
                  tick={{ fill: isDay ? '#64748b' : '#94a3b8', fontSize: 9 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(temp) => `${temp}°`}
                  domain={['dataMin - 1', 'dataMax + 1']}
                  width={30}
                  tickCount={3}
                  dx={3} // Add padding to move labels away from the divider
                />
                <Tooltip
                  content={<CustomTooltip isDay={isDay} />}
                  cursor={false}
                  isAnimationActive={false}
                  wrapperStyle={{ pointerEvents: 'none' }}
                />
                {/* Current time reference line */}
                <ReferenceLine
                  x={weatherAtLocation.current.time}
                  stroke={isDay ? '#0284c7' : '#818cf8'}
                  strokeWidth={1.5}
                  strokeDasharray="3 3"
                  label={(props) => {
                    // Find the data point for current time
                    const currentPoint = chartData.find(
                      (item) => item.time === weatherAtLocation.current.time,
                    );

                    // Get the y-coordinate for the current temperature
                    const yScale = chartRef.current?.state?.yAxis?.scale;
                    const y =
                      currentPoint && yScale
                        ? yScale(currentPoint.temp)
                        : props.viewBox?.y || 0;

                    return (
                      <CustomLabel
                        viewBox={props.viewBox}
                        data={{ y }}
                        isDay={isDay}
                      />
                    );
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke={isDay ? '#0284c7' : '#818cf8'}
                  fill="url(#dayGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Hourly Forecast */}
          <div
            className={cn(
              'grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 rounded-xl',
              isDay ? 'bg-white/50' : 'bg-gray-800/50',
            )}
          >
            {displayTimes.slice(0, 4).map((time, index) => (
              <div
                key={time}
                className={cn(
                  'flex flex-col items-center p-2 rounded-lg transition-all',
                  time === weatherAtLocation.current.time
                    ? isDay
                      ? 'bg-sky-100 shadow-sm'
                      : 'bg-indigo-900/50 shadow-sm'
                    : isDay
                      ? 'hover:bg-sky-50'
                      : 'hover:bg-gray-800',
                )}
              >
                <div
                  className={cn(
                    'text-xs font-medium',
                    isDay ? 'text-gray-600' : 'text-gray-400',
                  )}
                >
                  {format(new Date(time), 'ha')}
                </div>

                <div
                  className={cn(
                    'my-1 w-6 h-6 rounded-full flex items-center justify-center',
                    isDay ? 'bg-amber-100' : 'bg-indigo-900/50',
                  )}
                >
                  {isDay ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-amber-500"
                    >
                      <circle cx="12" cy="12" r="5" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4 text-indigo-400"
                    >
                      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                  )}
                </div>

                <div
                  className={cn(
                    'text-sm font-semibold',
                    isDay ? 'text-gray-900' : 'text-white',
                  )}
                >
                  {n(displayTemperatures[index])}°
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer with elevation information */}
      <div
        className={cn(
          'px-4 py-2 text-xs border-t',
          isDay
            ? 'bg-sky-50/50 border-sky-100 text-sky-700'
            : 'bg-gray-900/50 border-gray-700 text-gray-400',
        )}
      >
        <div className="flex items-center justify-between">
          <span>Elevation: {weatherAtLocation.elevation}m</span>
          <span>
            {weatherAtLocation.latitude.toFixed(2)}°N,{' '}
            {weatherAtLocation.longitude.toFixed(2)}°E
          </span>
        </div>
      </div>
    </div>
  );
}

export default function WeatherWidget() {
  // Sample data with enhanced location details
  const sampleData = {
    ...SAMPLE,
    locationDetails: {
      name: 'San Francisco',
      state: 'California',
      country: 'United States',
    },
  };

  return (
    <div className="w-full px-4 mx-auto">
      <Weather weatherAtLocation={sampleData} />
    </div>
  );
}
