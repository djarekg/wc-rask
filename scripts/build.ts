import { getPackageConfig } from '@jspm/generator';
import { $, type BuildConfig, type BuildOutput } from 'bun';
import dts from 'bun-plugin-dts';
import c from 'picocolors';
import ts from 'typescript';
import packageJson from '../package.json';
import tsconfig from '../tsconfig.types.json';

const isDebug = process.env.NODE_ENV === 'development';
const { version } = packageJson;
const projectPath = tsconfig.references.map(({ path }) => path);
const buildConfigBase: Omit<BuildConfig, 'entrypoints'> = {
  experimentalCss: true,
  sourcemap: 'external',
  splitting: true,
  target: 'browser',
  packages: 'external',
  banner: `${isDebug ? 'DEBUG BUILD ' : ''}v${version}`,
};

const builds = projectPath.map(async path => {
  const projectPackageConfigPath = `${path}/package.json`;

  console.log(`${c.green(`Getting package config from ${projectPackageConfigPath}`)}`);

  const resolvedPackageJsonPath = import.meta.resolve(projectPackageConfigPath, import.meta.dir);

  console.log(`${c.green(`Resolved package.json path ${resolvedPackageJsonPath}`)}`);

  const packageJson = await import(resolvedPackageJsonPath, {
    with: { type: 'json' },
  });

  const { name } = await getPackageConfig(packageJson);

  console.log(`${c.green(`Package name: ${name}`)}`);

  const file = Bun.file(`${path}/tsconfig.types.json`, { type: 'json' });
  const configJson = await file.json();
  const config = ts.parseJsonConfigFileContent(configJson, ts.sys, path);
  const { baseUrl } = config.options;
  const entrypointFiilePath = `${baseUrl}/index.ts`;
  const entrypointsExist = await Bun.file(entrypointFiilePath).exists();
  const entrypoints = entrypointsExist ? [entrypointFiilePath] : null;

  return Bun.build({
    ...buildConfigBase,
    ...(entrypoints && { entrypoints }),
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
    }
  }
};

main();
