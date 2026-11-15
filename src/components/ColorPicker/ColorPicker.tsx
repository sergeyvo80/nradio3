'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { SketchPicker, RGBColor, ColorResult } from 'react-color';
import { faRemove, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getLocalStorage, setLocalStorage } from '@/api/localStorage';
import { getTheme, setTheme, THEME_EVENT } from '@/theme/theme';
import { applyCustomColors } from '@/theme/customTheme';

import styles from './ColorPicker.module.scss';

interface StateInterface {
  displayColorPicker: boolean,
  color: RGBColor,
  colorHex: string;
  colorFull?: ColorResult,
}

const defaultState: StateInterface = {
  displayColorPicker: false,
  color: { r: 32, g: 33, b: 36, a: 1 },
  colorHex: '#202124'
};


const ColorPicker = (): React.ReactNode => {
  const [state, setState] = useState<StateInterface>(defaultState);

  const handleClick = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      displayColorPicker: !prevState.displayColorPicker,
    }));
  }, [setState]);

  const handleClose = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      displayColorPicker: false,
    }));
  }, [setState]);

  const handleChange = useCallback((color: ColorResult) => {
    applyCustomColors(color.hex);

    setState(prevState => {
      // colorHex нужен в состоянии: по нему определяем, что тема кастомная
      // (крест сброса показывается только тогда)
      const newState = { ...prevState, color: color.rgb, colorHex: color.hex };
      setLocalStorage('colorState', {
        ...prevState,
        color: color.rgb,
        colorHex: color.hex,
        colorFull: color
      });
      return newState;
    });
    // последняя custom-тема — в отдельный ключ: он НЕ удаляется при выборе
    // named-темы, поэтому custom остаётся в списке селектора
    setLocalStorage('customTheme', color);
    // произвольная тема через пикер перекрывает named-тему —
    // оповещаем переключатель тем
    window.dispatchEvent(new Event(THEME_EVENT));
  }, [setState]);

  const resetToDefault = () => {
    setState(defaultState);
    setLocalStorage('colorState', defaultState);
    // сброс = возврат к выбранной named-теме (Yaru/Aurora),
    // а не к старой жёсткой палитре; getTheme уже видит,
    // что colorState очищен, и вернёт named-тему
    setTheme(getTheme());
  };

  useEffect(() => {
    const colorState = getLocalStorage<StateInterface>('colorState', defaultState);

    if (colorState?.colorFull) {
      handleChange(colorState.colorFull);
    }
  }, [handleChange]);

  // событие темы: named-тема включена в другом месте (переключатель в меню «⋮»)
  // — приводим локальное состояние пикера к дефолту, чтобы свотч не показывал
  // цвет прежней custom-темы; custom включён повторно из селектора —
  // наоборот, показываем его цвет в свотче
  useEffect(() => {
    const onThemeChange = () => {
      const colorState = getLocalStorage<StateInterface>('colorState', defaultState);
      if (colorState?.colorFull) {
        setState(prevState => ({
          ...prevState,
          color: colorState.colorFull!.rgb,
          colorHex: colorState.colorFull!.hex,
          colorFull: colorState.colorFull,
        }));
      } else if (getTheme() !== 'custom') {
        setState(defaultState);
      }
    };
    window.addEventListener(THEME_EVENT, onThemeChange);
    return () => window.removeEventListener(THEME_EVENT, onThemeChange);
  }, []);

  // тема считается изменённой, когда её hex отличается от дефолтного —
  // крест сброса показываем только в этом случае
  const isCustomTheme = state.colorHex !== defaultState.colorHex;

  return (
    <div className={styles.ColorPicker}>
      <div>
        <div className={styles.swatch} onClick={handleClick}>
          <div className={styles.color} style={{ backgroundColor: `rgba(${state.color.r}, ${state.color.g}, ${state.color.b}, ${state.color.a})` }} />
        </div>
        {state.displayColorPicker ? (
          <>
            {/* подложка на весь экран — клик вне окна закрывает пикер;
                вне .popover, т.к. его transform делает fixed-детей
                относительными поповера, а не экрана */}
            <div className={styles.cover} onClick={handleClose} />
            <div className={styles.popover}>
              <FontAwesomeIcon
                icon={faXmark}
                className={styles.close}
                onClick={handleClose}
              />
              <SketchPicker color={state.color} onChange={handleChange} />
            </div>
          </>
        ) : null}
      </div>
      {isCustomTheme && (
        <div className={styles.remove}>
          <FontAwesomeIcon icon={faRemove} onClick={resetToDefault} />
        </div>
      )}
    </div>
  );

};

export default ColorPicker;
