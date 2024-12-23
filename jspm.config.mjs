import { pathToFileURL, fileURLToPath } from 'url';

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
  plugins: [{
    resolveId (specifier, parent) {
      if (parent && !specifier.startsWith('./') && !specifier.startsWith('../') && !specifier.startsWith('/'))
        return { id: specifier, external: true };
      return fileURLToPath(new URL(specifier, parent ? pathToFileURL(parent) : import.meta.url));
    }
  }],
  // disable external module warnings
  // (JSPM / the import map handles these for us instead)
  onwarn (warning, warn) {
    if (warning.code === 'UNRESOLVED_IMPORT') {
      return;
    }

    warn(warning);
  }
};
