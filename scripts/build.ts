import { $, type BuildConfig, type BuildOutput } from 'bun';
// import dts from 'bun-plugin-dts';
import c from 'picocolors';
import packageJson from '../package.json';
import tsconfig from '../tsconfig.types.json';
import { parseTsConfig } from './parse-tsconfig.ts';

const isDebug = process.env.NODE_ENV === 'development';
const { version } = packageJson;
const projectPath = tsconfig.references
  .filter(({ path }) => !/chomp-extensions/.test(path))
  .map(({ path }) => path);
const defaultBuildConfig: Omit<BuildConfig, 'entrypoints'> = {
  sourcemap: 'external',
  splitting: true,
  target: 'bun',
  packages: 'external',
  banner: `${isDebug ? 'DEBUG BUILD ' : ''}v${version}`,
  experimentalCss: true,
};

const builds = projectPath.map(async path => {
  const projectPackageConfigPath = `${path}/package.json`;

  console.log(`${c.green(`Getting package config from ${projectPackageConfigPath}`)}`);

  const packageJson = await Bun.file(await Bun.resolve(projectPackageConfigPath, '../')).json();

  const { name } = packageJson;

  console.log(`${c.green(`Package name: ${name}`)}`);

  const tsconfigPath = await Bun.resolve(`${path}/tsconfig.types.json`, '../');

  console.log(`${c.green(`Getting tsconfig from ${tsconfigPath}`)}`);

  const parsedTsConfiig = parseTsConfig(tsconfigPath);
  const { baseUrl } = parsedTsConfiig.options;

  console.log(`${c.green(`Base URL: ${baseUrl}`)}`);
  const entrypointFiilePath = `${baseUrl}/index.ts`;
  console.log(`${c.green(`Entrypoint file path: ${entrypointFiilePath}`)}`);
  const entrypoints = [`${path}/${entrypointFiilePath}`];

  console.log(`${c.green(`Entrypoints: ${entrypoints}`)}`);

  await $`tsc --project ${path}/tsconfig.types.json`;

  return Bun.build({
    ...defaultBuildConfig,
    // ...(entrypoints && { entrypoints }),
    // entrypoints: entrypoints,
    entrypoints: entrypoints ?? ['src/*.ts'],
    root: `${path}/src`,
    outdir: `${path}/dist`,
    // plugins: [
    //   dts({
    //     compilationOptions: {
    //       preferredConfigPath: `${path}/tsconfig.types.json`,
    //     },
    //     failOnClass: true,
    //   }),
    // ],
  });
});

async function* runBuilds(): AsyncGenerator<BuildOutput> {
  for (const build of builds) {
    yield await build;
  }
}

const main = async (): Promise<void> => {
  for await (const { logs, success, outputs } of runBuilds()) {
    await $`echo "Package bundled... ${logs.join('\n')}"`;

    if (success) {
      outputs.map(({ path }) => console.log(`Built: ${path}`));
      console.log('Build succeeded 🎉');
    } else {
      console.error(logs);
      console.error('Build failed 😢');
    }
  }
};

await main();
