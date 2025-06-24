type ValueType = string | object | string[] ;

export const getLocalStorage = (key: string, initialValue?: ValueType): ValueType => {
  try {
    const item = (typeof window !== 'undefined') ? window.localStorage.getItem(key) : undefined;
    const preparedValue = item ? JSON.parse(item) : initialValue;

    return preparedValue as ValueType;
  } catch (error) {
    console.log(error);

    return initialValue as ValueType;
  }
};


export const setLocalStorage = (key: string, value: ValueType): void => {
  try {
    const valueToStore = value;
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  } catch (error) {
    console.log(error);
  }
};

