import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: {},
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.config({

    'env': {
      'browser': true,
      'es2021': true,
      'node': true
    },
    rules: {
      indent: ['warn', 2],
      quotes: ['warn', 'single'],
      semi: ['warn', 'always']
    }


  })
];

export default eslintConfig;
