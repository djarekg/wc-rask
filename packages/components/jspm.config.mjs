/**
 * @type {import('rollup').RollupOptions}
 * @default
 */
export default {
  input: ['./src/**/*.ts'],
  output: {
    dir: 'dist',
    format: 'esm',
  },
  // disable external module warnings
  // (JSPM / the import map handles these for us instead)
  onwarn (warning, warn) {
    if (warning.code === 'UNRESOLVED_IMPORT')
      return;
    warn(warning);
  },
  plugins: [],
};
