import type { BuildConfig } from 'bun';
import dts from 'bun-plugin-dts';

const buildConfigBase: Omit<BuildConfig, 'entrypoints'> = {
  experimentalCss: true,
  sourcemap: 'external',
  splitting: true,
  target: 'browser',
  packages: 'external',
  // external: ['lit', '@lit-labs/router'],
};

const projectsPaths = ['packages/core', 'packages/web', 'apps/demo'];

const builds = projectsPaths.map(path =>
  Bun.build({
    ...buildConfigBase,
    entrypoints: [`${path}/src/index.ts`],
    root: `${path}/src`,
    outdir: `${path}/dist`,
    plugins: [
      dts({
        compilationOptions: {
          preferredConfigPath: `${path}/tsconfig.types.json`,
        },
        failOnClass: true,
      }),
    ],
  }),
);

const outputs = await Promise.all(builds);

outputs.map(({ logs, success, outputs }) => {
  if (success) {
    outputs.map(({ path }) => console.log(`Built: ${path}`));
    console.log('Build succeeded 🎉');
  } else {
    console.error(logs);
  }
});
