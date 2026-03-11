/**
 * Scheduler — startScheduler(intervalMs) / graceful shutdown.
 * Note: the factory is designed to be invoked by cron (runs once per minute).
 * This scheduler is for long-running mode (useful for testing/dev).
 */
import type { RunnerDeps } from './runner.js';
export declare function startScheduler(intervalMs: number, deps: RunnerDeps): () => void;
export declare function setupGracefulShutdown(stop: () => void, log: (msg: string) => void): void;
//# sourceMappingURL=scheduler.d.ts.map