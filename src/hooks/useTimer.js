import { useState, useEffect, useRef, useCallback } from 'react';

// Custom hook for countdown timer
export const useTimer = (initialTime = 0, onComplete = null, autoStart = false) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isActive, setIsActive] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const onCompleteRef = useRef(onComplete);

  // Update callback ref when onComplete changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  // Timer logic
  useEffect(() => {
    if (isActive && !isPaused && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setIsPaused(false);
            // Call completion callback
            if (onCompleteRef.current) {
              onCompleteRef.current();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeRemaining]);

  // Control functions
  const start = useCallback(() => {
    setIsActive(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    setIsPaused(false);
    setTimeRemaining(initialTime);
  }, [initialTime]);

  const reset = useCallback(() => {
    setTimeRemaining(initialTime);
    setIsActive(false);
    setIsPaused(false);
  }, [initialTime]);

  const addTime = useCallback((seconds) => {
    setTimeRemaining(prev => prev + seconds);
  }, []);

  const setTime = useCallback((seconds) => {
    setTimeRemaining(seconds);
  }, []);

  // Format time as MM:SS
  const formatTime = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const formattedTime = formatTime(timeRemaining);

  // Get timer status
  const getStatus = useCallback(() => {
    if (timeRemaining === 0) return 'completed';
    if (isActive && !isPaused) return 'running';
    if (isActive && isPaused) return 'paused';
    return 'stopped';
  }, [isActive, isPaused, timeRemaining]);

  // Get progress percentage
  const getProgress = useCallback(() => {
    if (initialTime === 0) return 0;
    return ((initialTime - timeRemaining) / initialTime) * 100;
  }, [initialTime, timeRemaining]);

  // Check if timer is in warning zone (last 25% of time)
  const isInWarningZone = timeRemaining <= initialTime * 0.25 && timeRemaining > 0;

  // Check if timer is in danger zone (last 10% of time)
  const isInDangerZone = timeRemaining <= initialTime * 0.1 && timeRemaining > 0;

  return {
    timeRemaining,
    formattedTime,
    isActive,
    isPaused,
    status: getStatus(),
    progress: getProgress(),
    isInWarningZone,
    isInDangerZone,
    start,
    pause,
    resume,
    stop,
    reset,
    addTime,
    setTime,
    formatTime,
  };
};

// Hook for multiple timers
export const useMultiTimer = () => {
  const [timers, setTimers] = useState(new Map());

  const createTimer = useCallback((id, initialTime, onComplete, autoStart = false) => {
    const timer = {
      id,
      timeRemaining: initialTime,
      initialTime,
      isActive: autoStart,
      isPaused: false,
      onComplete,
      intervalId: null,
    };

    setTimers(prev => new Map(prev.set(id, timer)));

    if (autoStart) {
      startTimer(id);
    }

    return id;
  }, []);

  const startTimer = useCallback((id) => {
    setTimers(prev => {
      const newTimers = new Map(prev);
      const timer = newTimers.get(id);
      if (timer) {
        timer.isActive = true;
        timer.isPaused = false;
        newTimers.set(id, timer);
      }
      return newTimers;
    });
  }, []);

  const pauseTimer = useCallback((id) => {
    setTimers(prev => {
      const newTimers = new Map(prev);
      const timer = newTimers.get(id);
      if (timer) {
        timer.isPaused = true;
        newTimers.set(id, timer);
      }
      return newTimers;
    });
  }, []);

  const stopTimer = useCallback((id) => {
    setTimers(prev => {
      const newTimers = new Map(prev);
      const timer = newTimers.get(id);
      if (timer) {
        timer.isActive = false;
        timer.isPaused = false;
        timer.timeRemaining = timer.initialTime;
        newTimers.set(id, timer);
      }
      return newTimers;
    });
  }, []);

  const removeTimer = useCallback((id) => {
    setTimers(prev => {
      const newTimers = new Map(prev);
      newTimers.delete(id);
      return newTimers;
    });
  }, []);

  const getTimer = useCallback((id) => {
    return timers.get(id);
  }, [timers]);

  const getAllTimers = useCallback(() => {
    return Array.from(timers.values());
  }, [timers]);

  // Update all active timers
  useEffect(() => {
    const interval = setInterval(() => {
      setTimers(prev => {
        const newTimers = new Map(prev);
        let hasChanges = false;

        for (const [id, timer] of newTimers) {
          if (timer.isActive && !timer.isPaused && timer.timeRemaining > 0) {
            timer.timeRemaining -= 1;
            hasChanges = true;

            if (timer.timeRemaining === 0) {
              timer.isActive = false;
              timer.isPaused = false;
              if (timer.onComplete) {
                timer.onComplete(id);
              }
            }
          }
        }

        return hasChanges ? newTimers : prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    createTimer,
    startTimer,
    pauseTimer,
    stopTimer,
    removeTimer,
    getTimer,
    getAllTimers,
    timers: Array.from(timers.values()),
  };
};

// Hook for stopwatch (count up instead of down)
export const useStopwatch = (autoStart = false) => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(autoStart);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const start = useCallback(() => setIsActive(true), []);
  const pause = useCallback(() => setIsActive(false), []);
  const reset = useCallback(() => {
    setTime(0);
    setIsActive(false);
  }, []);

  const formatTime = useCallback((seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return {
    time,
    formattedTime: formatTime(time),
    isActive,
    start,
    pause,
    reset,
    formatTime,
  };
};
