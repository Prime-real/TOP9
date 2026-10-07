import { useState, useEffect } from 'react';

export interface LiveClockInfo {
  // USA Eastern Time
  usTime: string;
  usSeconds: string;
  usDate: string;
  usFullDate: string;
  usWeekday: string;
  usTz: string;
  usPacificTime: string;
  usPacificDate: string;

  // India Standard Time (IST)
  indiaTime: string;
  indiaSeconds: string;
  indiaDate: string;
  indiaFullDate: string;
  indiaWeekday: string;
  indiaTz: string;

  // Comparison & metadata
  isIndiaNextDay: boolean;
  timeOffsetSummary: string;
  dayDifferenceText: string;
  tickCount: number;
  rawNow: Date;
}

export function calculateClockInfo(tick = 0): LiveClockInfo {
  const now = new Date();

  // USA Eastern (America/New_York)
  let usTime = '11:00:00 PM';
  let usSeconds = '00';
  let usDate = 'Oct 6, 2026';
  let usFullDate = 'October 6, 2026';
  let usWeekday = 'Tuesday';
  let usTz = 'EDT';
  let usPacificTime = '08:00:00 PM';
  let usPacificDate = 'Oct 6, 2026';

  // India Standard Time (Asia/Kolkata)
  let indiaTime = '08:30:00 AM';
  let indiaSeconds = '00';
  let indiaDate = 'Oct 7, 2026';
  let indiaFullDate = 'October 7, 2026';
  let indiaWeekday = 'Wednesday';
  const indiaTz = 'IST';

  try {
    usTime = now.toLocaleTimeString('en-US', {
      timeZone: 'America/New_York',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    const secNum = now.getSeconds();
    usSeconds = String(secNum).padStart(2, '0');

    usDate = now.toLocaleDateString('en-US', {
      timeZone: 'America/New_York',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    usFullDate = now.toLocaleDateString('en-US', {
      timeZone: 'America/New_York',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    usWeekday = now.toLocaleDateString('en-US', {
      timeZone: 'America/New_York',
      weekday: 'long',
    });

    // Detect EDT vs EST
    const nyFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      timeZoneName: 'short',
    });
    const parts = nyFormatter.formatToParts(now);
    const tzPart = parts.find((p) => p.type === 'timeZoneName');
    if (tzPart) usTz = tzPart.value;

    usPacificTime = now.toLocaleTimeString('en-US', {
      timeZone: 'America/Los_Angeles',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    usPacificDate = now.toLocaleDateString('en-US', {
      timeZone: 'America/Los_Angeles',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    // browser fallback
  }

  try {
    indiaTime = now.toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });

    indiaSeconds = usSeconds;

    indiaDate = now.toLocaleDateString('en-US', {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    indiaFullDate = now.toLocaleDateString('en-US', {
      timeZone: 'Asia/Kolkata',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    indiaWeekday = now.toLocaleDateString('en-US', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
    });
  } catch (e) {
    // browser fallback
  }

  const isIndiaNextDay = indiaDate !== usDate;
  const dayDifferenceText = isIndiaNextDay
    ? 'India is 1 calendar day ahead of USA'
    : 'Same calendar day in USA & India';
  const timeOffsetSummary = '+9 hours 30 minutes ahead of US Eastern';

  return {
    usTime,
    usSeconds,
    usDate,
    usFullDate,
    usWeekday,
    usTz,
    usPacificTime,
    usPacificDate,
    indiaTime,
    indiaSeconds,
    indiaDate,
    indiaFullDate,
    indiaWeekday,
    indiaTz,
    isIndiaNextDay,
    timeOffsetSummary,
    dayDifferenceText,
    tickCount: tick,
    rawNow: now,
  };
}

export function useLiveClocks(): LiveClockInfo {
  const [clockInfo, setClockInfo] = useState<LiveClockInfo>(() => calculateClockInfo(0));

  useEffect(() => {
    let tick = 0;
    // Initial immediate sync
    setClockInfo(calculateClockInfo(tick));

    // Update every second with exact live ticks
    const interval = setInterval(() => {
      tick += 1;
      setClockInfo(calculateClockInfo(tick));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return clockInfo;
}
