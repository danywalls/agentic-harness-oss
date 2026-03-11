import type { AgentTask, AgentHandle } from '../types/index.js';
export declare function spawnAgent(task: AgentTask, useClaudeCli: boolean, buildAgentEnv: (apiKey: string) => NodeJS.ProcessEnv, getCurrentKey: () => string, log: (msg: string) => void): AgentHandle;
//# sourceMappingURL=spawn.d.ts.map