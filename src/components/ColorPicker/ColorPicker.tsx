'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { SketchPicker,  RGBColor, HSLColor, ColorResult } from 'react-color';
import Color from 'color';
import { faRemove } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getLocalStorage, setLocalStorage } from '@/api/localStorage';

import styles from './ColorPicker.module.scss';

interface ColorsInterface {
  '--bg-color': string;
  '--second-bg-color': string;
  '--border-color':  string;
  '--current-color':  string;
  '--shadow-color':  string;
  '--error-bg-color':  string;
  '--error-border-color':  string;
  '--color':  string;
  '--item-color':  string;
  '--error-color':  string;
  '--link-color':  string;
  '--visited-color':  string;
};

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
  color: {
    r: 32,
    g: 33,
    b: 36,
    a: 1,
  },
  colorHex: '#202124'
};


const calculateColorScheme = (pickedColor: string) => {

  // console.log('>>> pickedColor', pickedColor);
  const pickedColorObject = Color(pickedColor);
  const pickedColorObjectHSL = pickedColorObject.hsl().object();

  const isDark = pickedColorObject.isDark() ? -1 : 1;

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
  // const [state, setState] = useState(getLocalStorage('colorState', defaultState));
  const [state, setState] = useState<StateInterface>(defaultState);

  const handleClick = () => {
    setState({ ...state, displayColorPicker: !state.displayColorPicker });
  };

  const handleClose = () => {
    setState({ ...state, displayColorPicker: false });
  };

  const handleChange = useCallback((color: ColorResult) => {
    calculateColorScheme(color.hex);

    setState({ ...state, color: color.rgb });
    
    setLocalStorage('colorState', {
      ...state,
      color: color.rgb,
      colorHex: color.hex,
      colorFull: color 
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetToDefault = () => {
    setState(defaultState);
    for (const color in colors) {
      document.documentElement.style.setProperty(color, null);
    }
    setLocalStorage('colorState', defaultState);
  };

  useEffect(() => {
    const colorState = getLocalStorage<StateInterface>('colorState', defaultState);
    // console.log('>> colorState.hex', colorState)

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
