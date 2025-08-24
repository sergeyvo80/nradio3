'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { SketchPicker,  RGBColor, HSLColor, ColorResult } from 'react-color';
import Color from 'color';
import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getLocalStorage, setLocalStorage } from '@/api/localStorage';
import ColorsInterface from '@/types/ColorsInterface';

import styles from './ColorPicker.module.scss';

// TODO:  get from css variables
const colors: ColorsInterface = {
  '--bg-color': '#292A2D',
  '--second-bg-color': '#202124',
  '--border-color': '#4A4C50',
  '--current-color': '#E8AD47',
  '--shadow-color': '#000000bf',
  '--error-bg-color': '#250201',
  '--error-border-color': '#540C06',
  '--color': '#ffffff',
  '--item-color': '#ffffff',
  '--error-color': '#E98380',
  '--link-color': '#E59A6F',
  '--visited-color': '#6AD1C7',
};

type ColorKeys = keyof typeof colors;

interface ColorInterface  {
  hex:string;
  hsl: HSLColor;
  hsv: HSLColor;
  oldHue: number;
  rgb: RGBColor;
  source: string;
}

interface StateInterface {
  displayColorPicker: boolean,
  color: RGBColor,
  colorHex: string;
  colorFull?: ColorInterface,
}

const defaultState: StateInterface = {
  displayColorPicker: false,
  color: { r: 32, g: 33, b: 36, a: 1 },
  colorHex: '#202124'
};


const calculateColorScheme = (pickedColor: string) => {
  const pickedColorObject = Color(pickedColor);
  const pickedColorObjectHSL = pickedColorObject.hsl().object();

  const isDark = pickedColorObject.isDark() ? -1 : 1;

  // TODO: get color form css variables
  // for (let color in colors) {   
  //   colors[color] = document.documentElement.style.getPropertyValue(color);
  // }

  const baseColorObject = Color(colors['--bg-color']);
  const baseColorObjectHSL = baseColorObject.hsl().object();

  for (const color in colors) { 
    const currentColorHSL = Color(colors[color as ColorKeys]).hsl().object();

    const newColor = Color({
      h: pickedColorObjectHSL.h - (currentColorHSL.h - baseColorObjectHSL.h),
      s: pickedColorObjectHSL.s - (currentColorHSL.s - baseColorObjectHSL.s),
      l: pickedColorObjectHSL.l - (currentColorHSL.l - baseColorObjectHSL.l) * isDark,
    });

    document.documentElement.style.setProperty(color, newColor.hex());
  }
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
    calculateColorScheme(color.hex);

    setState(prevState => {
      const newState = { ...prevState, color: color.rgb };
      setLocalStorage('colorState', {
        ...prevState,
        color: color.rgb,
        colorHex: color.hex,
        colorFull: color
      });
      return newState;
    });
  }, [setState]);

  const resetToDefault = () => {
    setState(defaultState);
    for (const color in colors) {
      document.documentElement.style.setProperty(color, null);
    }
    setLocalStorage('colorState', defaultState);
  };

  useEffect(() => {
    const colorState = getLocalStorage<StateInterface>('colorState', defaultState);

    if (colorState?.colorFull) {
      handleChange(colorState.colorFull);
    }
  }, [handleChange]);

  return (
    <div className={styles.ColorPicker}>
      <div>
        <div className={styles.swatch} onClick={handleClick}>
          <div className={styles.color} style={{ backgroundColor: `rgba(${state.color.r}, ${state.color.g}, ${state.color.b}, ${state.color.a})` }} />
        </div>
        {state.displayColorPicker ? (
          <div className={styles.popover}>
            <div className={styles.cover} onClick={handleClose} />
            <SketchPicker color={state.color} onChange={handleChange} />
          </div>
        ) : null}
      </div>
      <div className={styles.remove}>
        <FontAwesomeIcon icon={faRemove} onClick={resetToDefault} />
      </div>
    </div>
  );

};

export default ColorPicker;
