import fs from 'node:fs';
import { join } from 'node:path';
import { $ } from 'bun';
import demoPackageJSON from '../apps/demo/package.json';
import packageJSON from '../package.json';
import corePackageJSON from '../packages/core/package.json';
import webPackageJSON from '../packages/web/package.json';

const oldVersion = packageJSON.packageManager.replace('bun@', '');

await $`bun upgrade`;

const version = (await $`bun --version`.text()).trim();

packageJSON.packageManager =
  corePackageJSON.packageManager =
  webPackageJSON.packageManager =
  demoPackageJSON.packageManager =
    `bun@${version}`;
packageJSON.engines =
  corePackageJSON.engines =
  webPackageJSON.engines =
  demoPackageJSON.engines =
    {
      bun: `>= ${version}`,
    };

// Update all the package.json files
fs.writeFileSync(join(import.meta.dir, '..', 'package.json'), JSON.stringify(packageJSON, null, 2));
fs.writeFileSync(
  join(import.meta.dir, '..', 'packages', 'core', 'package.json'),
  JSON.stringify(corePackageJSON, null, 2),
);
fs.writeFileSync(
  join(import.meta.dir, '..', 'packages', 'web', 'package.json'),
  JSON.stringify(webPackageJSON, null, 2),
);
fs.writeFileSync(
  join(import.meta.dir, '..', 'apps', 'demo', 'package.json'),
  JSON.stringify(demoPackageJSON, null, 2),
);

// Update docs
const quickStartMdPath = join(import.meta.dir, '..', 'docs', 'getting-started', 'quick-start.md');
const quickStartMd = fs
  .readFileSync(quickStartMdPath)
  .toString()
  .replace(`text="${oldVersion}"`, `text="${version}"`);

fs.writeFileSync(quickStartMdPath, quickStartMd);

console.log('Updated to version: ', version, '🎉');
