import { useState, useEffect } from 'react';

// Custom hook for localStorage integration
export const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to localStorage
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

// Hook for managing localStorage with expiration
export const useLocalStorageWithExpiry = (key, initialValue, expiryInMinutes = 60) => {
  const [value, setValue] = useLocalStorage(key, null);

  const setValueWithExpiry = (newValue) => {
    const now = new Date();
    const item = {
      value: newValue,
      expiry: now.getTime() + expiryInMinutes * 60 * 1000,
    };
    setValue(item);
  };

  const getCurrentValue = () => {
    if (!value) {
      return initialValue;
    }

    const now = new Date();
    if (now.getTime() > value.expiry) {
      setValue(null);
      return initialValue;
    }

    return value.value;
  };

  return [getCurrentValue(), setValueWithExpiry];
};

// Hook for localStorage array operations
export const useLocalStorageArray = (key, initialValue = []) => {
  const [array, setArray] = useLocalStorage(key, initialValue);

  const addItem = (item) => {
    setArray(prev => [...prev, item]);
  };

  const removeItem = (index) => {
    setArray(prev => prev.filter((_, i) => i !== index));
  };

  const removeItemById = (id, idKey = 'id') => {
    setArray(prev => prev.filter(item => item[idKey] !== id));
  };

  const updateItem = (index, newItem) => {
    setArray(prev => prev.map((item, i) => (i === index ? newItem : item)));
  };

  const updateItemById = (id, updates, idKey = 'id') => {
    setArray(prev =>
      prev.map(item =>
        item[idKey] === id ? { ...item, ...updates } : item
      )
    );
  };

  const clearArray = () => {
    setArray([]);
  };

  const findItemById = (id, idKey = 'id') => {
    return array.find(item => item[idKey] === id);
  };

  return {
    array,
    setArray,
    addItem,
    removeItem,
    removeItemById,
    updateItem,
    updateItemById,
    clearArray,
    findItemById,
    length: array.length,
  };
};
