'use client';

import cx from 'classnames';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
} from 'recharts';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

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
};
function n(num: number): number {
  return Math.ceil(num);
}

const CustomTooltip = ({ active, payload, label, isDay }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`p-2 rounded-md shadow-lg ${isDay ? 'bg-white' : 'bg-gray-900'} border ${isDay ? 'border-gray-200' : 'border-gray-700'}`}
      >
        <p
          className={`text-sm font-medium ${isDay ? 'text-gray-900' : 'text-gray-100'}`}
        >
          {format(parseISO(label), 'MMM d, h:mm a')}
        </p>
        <p
          className={`text-sm font-bold ${isDay ? 'text-blue-600' : 'text-indigo-300'}`}
        >
          {`${payload[0].value}°C`}
        </p>
      </div>
    );
  }
  return null;
};

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

  const hoursToShow = isMobile ? 5 : 6;
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

  return (
    <div
      className={cx(
        'flex flex-col gap-6 rounded-2xl p-6 max-w-[600px] w-full shadow-lg border',
        {
          'bg-gray-100': isDay,
          'bg-gray-800': !isDay,
        },
        'border-gray-200 dark:border-gray-700',
      )}
    >
      {/* Current Weather Summary */}
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-3 items-center">
          {isDay ? (
            <SunIcon className="w-12 h-12 text-blue-600" />
          ) : (
            <MoonIcon className="w-12 h-12 text-indigo-300" />
          )}
          <div>
            <div
              className={cx('text-5xl font-bold', {
                'text-gray-900': isDay,
                'text-gray-100': !isDay,
              })}
            >
              {n(weatherAtLocation.current.temperature_2m)}
              {weatherAtLocation.current_units.temperature_2m}
            </div>
            <div
              className={cx('text-sm', {
                'text-gray-600': isDay,
                'text-gray-400': !isDay,
              })}
            >
              {format(
                parseISO(weatherAtLocation.current.time),
                'MMM d, h:mm a',
              )}
            </div>
          </div>
        </div>
        <div
          className={cx('font-medium px-3 py-1 rounded-full', {
            'bg-blue-100 text-blue-600': isDay,
            'bg-indigo-900 text-indigo-300': !isDay,
          })}
        >
          {`H:${n(currentHigh)}° L:${n(currentLow)}°`}
        </div>
      </div>

      {/* Temperature Chart */}
      <div className="h-48 w-full relative overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="dayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="nightGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="time"
              tick={{ fill: isDay ? '#374151' : '#d1d5db', fontSize: 10 }}
              tickFormatter={(time) => format(parseISO(time), 'ha')}
              axisLine={false}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
              interval={isMobile ? 3 : 2}
            />
            <YAxis
              tick={{ fill: isDay ? '#374151' : '#d1d5db', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(temp) => `${temp}°`}
              domain={['dataMin - 2', 'dataMax + 2']}
              width={25}
            />
            <Tooltip content={<CustomTooltip isDay={isDay} />} />
            <ReferenceLine
              x={weatherAtLocation.current.time}
              stroke={isDay ? '#2563eb' : '#818cf8'}
              strokeWidth={1}
              strokeDasharray="3 3"
              label={{
                value: 'Now',
                position: 'top',
                fill: isDay ? '#2563eb' : '#818cf8',
                fontSize: 10,
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke={isDay ? '#2563eb' : '#818cf8'}
              fill={isDay ? 'url(#dayGradient)' : 'url(#nightGradient)'}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly Forecast */}
      <div className="flex flex-row justify-between">
        {displayTimes.map((time, index) => (
          <div
            key={time}
            className={cx('flex flex-col items-center gap-1 p-2 rounded-lg', {
              'bg-blue-100': time === weatherAtLocation.current.time && isDay,
              'bg-indigo-900':
                time === weatherAtLocation.current.time && !isDay,
            })}
          >
            <div
              className={cx('text-xs', {
                'text-gray-600': isDay,
                'text-gray-400': !isDay,
              })}
            >
              {format(new Date(time), 'ha')}
            </div>
            {isDay ? (
              <SunIcon className="w-5 h-5 text-blue-600" />
            ) : (
              <MoonIcon className="w-5 h-5 text-indigo-300" />
            )}
            <div
              className={cx('text-sm font-medium', {
                'text-gray-900': isDay,
                'text-gray-100': !isDay,
              })}
            >
              {n(displayTemperatures[index])}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
