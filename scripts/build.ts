import { getPackageConfig } from '@jspm/generator';
import type { PackageConfig } from '@jspm/generator';
import { $, type BuildConfig, type BuildOutput } from 'bun';
import dts from 'bun-plugin-dts';
import c from 'picocolors';
import ts from 'typescript';
import tsconfig from '../tsconfig.types.json';

const projectPath = tsconfig.references.map(({ path }) => path);

const buildConfigBase: Omit<BuildConfig, 'entrypoints'> = {
  experimentalCss: true,
  sourcemap: 'external',
  splitting: true,
  target: 'browser',
  packages: 'external',
  // external: ['lit', '@lit-labs/router'],
};

const builds = projectPath.map(async path => {
  const projectPackageConfigPath = `${path}/package.json`;
  // const projectPackageConfigUrl = Bun.fileURLToPath(projectPackageConfigPath);

  console.log(`${c.green(`Getting package config from ${projectPackageConfigPath}`)}`);

  const resolvedPackageJsonPath = import.meta.resolve(projectPackageConfigPath, import.meta.dir);

  console.log(`${c.green(`Resolved package.json path ${resolvedPackageJsonPath}`)}`);

  const packageJson = await import(resolvedPackageJsonPath, {
    with: { type: 'json' },
  });

  // import(resolvedPackageJsonPath, { with: { type: 'json' } }).then(
  //   mod => mod.defaul as PackageConfig,
  // );
  // const resolvedProjectPackageConfigPath = Bun.resolveSync(
  //   projectPackageConfigPath,
  //   import.meta.dir,
  // );
  // console.log(`%cProject package.json path ${resolvedProjectPackageConfigPath}`, 'color:blue');

  // console.log(`${c.green(`Getting package config from ${JSON.stringify(packageJson)}`)}`);

  const { name, ...pkg } = await getPackageConfig(packageJson);

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
