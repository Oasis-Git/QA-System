import { useCallback, useEffect, useState } from "react";

const useLocalStorage = <Value>(
  key: string,
  defaultValue: Value
): [Value, (newValue: Value | null) => void] => {
  const [value, setValue] = useState(() => {
    const value = window.localStorage.getItem(key);
    return value === null ? defaultValue : (JSON.parse(value) as Value);
  });

  useEffect(() => {
    const listener = (event: StorageEvent) => {
      if (event.storageArea === window.localStorage && event.key === key) {
        setValue(event.newValue === null ? null : JSON.parse(event.newValue));
      }
    };
    window.addEventListener("storage", listener);
    return () => {
      window.removeEventListener("storage", listener);
    };
  }, [key, defaultValue]);

  const setValueInLocalStorage = useCallback(
    (newValue: Value | null) => {
      if (newValue === null) {
        setValue(defaultValue);
        window.localStorage.removeItem(key);
      } else {
        setValue(newValue);
        window.localStorage.setItem(key, JSON.stringify(newValue));
      }
    },
    [defaultValue, key]
  );

  return [value, setValueInLocalStorage];
};

export default useLocalStorage;
