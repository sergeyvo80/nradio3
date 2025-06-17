// @tslint:disable-next-line
import React from 'react'
import reactCSS from 'reactcss';
import { SketchPicker } from 'react-color';
import Color from 'color';

class ColorPicker extends React.Component {
    state = {
        displayColorPicker: false,
        color: {
            r: '32',
            g: '33',
            b: '36',
            a: '1',
        },
    };

    handleClick = () => {
        this.setState({ displayColorPicker: !this.state.displayColorPicker })
    };

    handleClose = () => {
        this.setState({ displayColorPicker: false })
    };

    handleChange = (color) => {

        const calculateColorScheme = (pickedColor) => {
            const pickedColorObject = Color(pickedColor);
            const pickedColorObjectHSL = pickedColorObject.hsl().object();


            const isDark = pickedColorObject.isDark() ? -1 : 1;

            //TODO get from document
            const colors = {
                1: {name: '--bg-color', value: '#292A2D'},
                2: {name: '--second-bg-color', value: '#202124'},
                3: {name: '--border-color', value: '#4A4C50'},
                4: {name: '--current-color', value: '#E8AD47'},
                5: {name: '--shadow-color', value: '#000000bf'},
                6: {name: '--error-bg-color', value: '#250201'},
                7: {name: '--error-border-color', value: '#540C06'},

                8: {name: '--color', value: '#fff'},
                9: {name: '--item-color', value: '#fff'},
                10: {name: '--error-color', value: '#E98380'},

                11: {name: '--link-color', value: '#E59A6F'},
                12: {name: '--visited-color', value: '#6AD1C7'},

            };

            const baseColorObject = Color(colors[1].value);
            const baseColorObjectHSL = baseColorObject.hsl().object();


            for(let color in colors) {

                const currentColorHSL = Color(colors[color].value).hsl().object();

                const newColor = Color({
                    h: pickedColorObjectHSL.h - (currentColorHSL.h - baseColorObjectHSL.h),
                    s: pickedColorObjectHSL.s - (currentColorHSL.s - baseColorObjectHSL.s),
                    l: pickedColorObjectHSL.l - (currentColorHSL.l - baseColorObjectHSL.l) * isDark,
                });

                console.log(`${colors[color].name} : ${colors[color].value}`);
                console.log('New HSL');
                console.log('h >>', newColor.hsl().object().h);
                console.log('s >>', newColor.hsl().object().s);
                console.log('l >>', newColor.hsl().object().l);
                document.documentElement.style.setProperty(colors[color].name, newColor.hex());
            }
        };

        calculateColorScheme(color.hex);
        
        this.setState({ color: color.rgb })
    };

    render() {

        const styles = reactCSS({
            'default': {
                color: {
                    width: '36px',
                    height: '14px',
                    borderRadius: '2px',
                    background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
                },
                swatch: {
                    padding: '5px',
                    background: '#fff',
                    borderRadius: '1px',
                    boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
                    display: 'inline-block',
                    cursor: 'pointer',
                },
                popover: {
                    position: 'absolute',
                    zIndex: '2',
                },
                cover: {
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                },
            },
        });

        return (
            <div>
                <div style={ styles.swatch } onClick={ this.handleClick }>
                    <div style={ styles.color } />
                </div>
                { this.state.displayColorPicker ? <div style={ styles.popover }>
                    <div style={ styles.cover } onClick={ this.handleClose }/>
                    <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
                </div> : null }

            </div>
        )
    }
}

export default ColorPicker;
