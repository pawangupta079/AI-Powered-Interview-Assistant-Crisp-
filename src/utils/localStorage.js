// Local storage utilities for data persistence

// Storage keys
export const STORAGE_KEYS = {
  INTERVIEW_SESSION: 'interviewSession',
  CANDIDATES: 'candidates',
  APP_SETTINGS: 'appSettings',
  USER_PREFERENCES: 'userPreferences',
};

// Save data to localStorage with error handling
export const saveToLocalStorage = (key, data) => {
  try {
    const serializedData = JSON.stringify(data);
    localStorage.setItem(key, serializedData);
    return true;
  } catch (error) {
    console.error(`Failed to save to localStorage (${key}):`, error);
    return false;
  }
};

// Load data from localStorage with error handling
export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const serializedData = localStorage.getItem(key);
    if (serializedData === null) {
      return defaultValue;
    }
    return JSON.parse(serializedData);
  } catch (error) {
    console.error(`Failed to load from localStorage (${key}):`, error);
    return defaultValue;
  }
};

// Remove item from localStorage
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove from localStorage (${key}):`, error);
    return false;
  }
};

// Clear all app data from localStorage
export const clearAllAppData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Failed to clear app data:', error);
    return false;
  }
};

// Check localStorage availability
export const isLocalStorageAvailable = () => {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, 'test');
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    console.warn('localStorage is not available:', error);
    return false;
  }
};

// Get localStorage usage stats
export const getStorageStats = () => {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  let totalSize = 0;
  const itemSizes = {};

  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const size = new Blob([localStorage[key]]).size;
      totalSize += size;
      itemSizes[key] = size;
    }
  }

  return {
    totalSize,
    itemSizes,
    totalSizeFormatted: formatBytes(totalSize),
    availableSpace: 5 * 1024 * 1024 - totalSize, // Assuming 5MB limit
  };
};

// Format bytes to human readable format
const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Save interview session with timestamp
export const saveInterviewSession = (sessionData) => {
  const dataWithTimestamp = {
    ...sessionData,
    lastSaved: new Date().toISOString(),
  };

  return saveToLocalStorage(STORAGE_KEYS.INTERVIEW_SESSION, dataWithTimestamp);
};

// Load interview session
export const loadInterviewSession = () => {
  return loadFromLocalStorage(STORAGE_KEYS.INTERVIEW_SESSION);
};

// Save candidates data
export const saveCandidatesData = (candidates) => {
  const dataWithTimestamp = {
    candidates,
    lastUpdated: new Date().toISOString(),
  };

  return saveToLocalStorage(STORAGE_KEYS.CANDIDATES, dataWithTimestamp);
};

// Load candidates data
export const loadCandidatesData = () => {
  const data = loadFromLocalStorage(STORAGE_KEYS.CANDIDATES);
  return data?.candidates || [];
};

// Save app settings
export const saveAppSettings = (settings) => {
  return saveToLocalStorage(STORAGE_KEYS.APP_SETTINGS, settings);
};

// Load app settings
export const loadAppSettings = () => {
  return loadFromLocalStorage(STORAGE_KEYS.APP_SETTINGS, {
    theme: 'light',
    notifications: true,
    autoSave: true,
    soundEnabled: true,
  });
};

// Save user preferences
export const saveUserPreferences = (preferences) => {
  return saveToLocalStorage(STORAGE_KEYS.USER_PREFERENCES, preferences);
};

// Load user preferences
export const loadUserPreferences = () => {
  return loadFromLocalStorage(STORAGE_KEYS.USER_PREFERENCES, {
    language: 'en',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: 'MM/dd/yyyy',
    timeFormat: '12h',
  });
};

// Export data for backup
export const exportAppData = () => {
  const data = {};

  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    data[name] = loadFromLocalStorage(key);
  });

  return {
    exportedAt: new Date().toISOString(),
    version: '1.0.0',
    data,
  };
};

// Import data from backup
export const importAppData = (backupData) => {
  try {
    if (!backupData.data) {
      throw new Error('Invalid backup data format');
    }

    let successCount = 0;
    let errorCount = 0;

    Object.entries(backupData.data).forEach(([name, value]) => {
      const key = STORAGE_KEYS[name];
      if (key && value !== null) {
        if (saveToLocalStorage(key, value)) {
          successCount++;
        } else {
          errorCount++;
        }
      }
    });

    return {
      success: true,
      successCount,
      errorCount,
      message: `Imported ${successCount} items successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      message: 'Failed to import backup data',
    };
  }
};

// Monitor storage changes
export const watchStorageChanges = (callback) => {
  const handleStorageChange = (e) => {
    if (Object.values(STORAGE_KEYS).includes(e.key)) {
      callback({
        key: e.key,
        oldValue: e.oldValue,
        newValue: e.newValue,
        url: e.url,
      });
    }
  };

  window.addEventListener('storage', handleStorageChange);

  // Return cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};
