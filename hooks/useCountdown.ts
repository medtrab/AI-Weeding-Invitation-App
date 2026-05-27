import { useState, useEffect } from "react";

interface CountdownValues { days: number; hours: number; minutes: number; seconds: number; isExpired: boolean; }

export function useCountdown(targetDate: string): CountdownValues {
  const [values, setValues] = useState<CountdownValues>({ days:0, hours:0, minutes:0, seconds:0, isExpired:false });
  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) { setValues({ days:0, hours:0, minutes:0, seconds:0, isExpired:true }); return; }
      setValues({ days:Math.floor(diff/86400000), hours:Math.floor((diff%86400000)/3600000), minutes:Math.floor((diff%3600000)/60000), seconds:Math.floor((diff%60000)/1000), isExpired:false });
    };
    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);
  return values;
}
