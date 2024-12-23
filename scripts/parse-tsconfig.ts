import ts, { type ParsedCommandLine } from 'typescript';

export const parseTsConfig = (configFileName: string): ParsedCommandLine | null => {
  const { config, error } = ts.readConfigFile(configFileName, ts.sys.readFile);

  if (error) {
    console.error(ts.formatDiagnosticsWithColorAndContext([error], ts.createCompilerHost({})));

    return null;
  }

  const parsedConfig = ts.parseJsonConfigFileContent(config, ts.sys, './');

  return parsedConfig;
};
