import type { TemplateResult } from 'lit';

declare global {
  export interface CmdOp {
    id: number;
    run: string;
    engine: 'deno' | 'node' | 'cmd';
    name?: string;
    cwd?: string;
    env: Record<string, string>;
  }

  interface BatchCmd {
    ids: number[];
    run: string;
    engine: 'deno' | 'node' | 'cmd';
    cwd?: string;
    env: BTreeMap<string, string>;
  }

  interface BatcherResult {
    queue?: number[];
    exec?: BatchCmd[];
    completionMap?: Record<number, number>;
  }

  export interface ChompTask {
    name: string;
    engine: 'cwd' | 'node' | 'deno';
    target: string;
    run: TemplateResult;
  }

  namespace Chomp {
    export function addExtension(name: string): void;
    export function registerTemplate(
      name: string,
      template: (...args: unknown[]) => TemplateResult,
    ): void;
    export function registerTask(
      options: TaskOptions,
      task: (task: ChompTask) => ChompTask[],
    ): void;
    export function registerBatcher(
      name: string,
      batcher: (batch: CmdOp[], running: BatchCmd[]) => BatcherResult | undefined,
    );
  }
}
