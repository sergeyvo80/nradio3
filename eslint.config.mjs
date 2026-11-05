import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/indent': ['warn', 2],
      '@stylistic/quotes': ['warn', 'single'],
      '@stylistic/semi': ['warn', 'always'],
      '@stylistic/comma-spacing': ['warn', { before: false, after: true }],
      // TODO: переделать код плеера/ColorPicker без setState в effect
      'react-hooks/set-state-in-effect': 'warn',
      // NOTE: import/order выключен - eslint-plugin-import ломается на ESLint 10
    },
  },
];

export default eslintConfig;
