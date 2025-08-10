export const getLocalStorage =  <T>(key: string, initialValue?: T): T | undefined => {
  try {
    const item = (typeof window !== 'undefined') ? window.localStorage.getItem(key) : undefined;
    const preparedValue = item ? JSON.parse(item) : initialValue;

    return preparedValue;
  } catch (error) {
    console.log(error);

    return initialValue;
  }
};

export const setLocalStorage = <T>(key: string, value?: T): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
};
