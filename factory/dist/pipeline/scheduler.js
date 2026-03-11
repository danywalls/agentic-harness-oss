/**
 * Scheduler — startScheduler(intervalMs) / graceful shutdown.
 * Note: the factory is designed to be invoked by cron (runs once per minute).
 * This scheduler is for long-running mode (useful for testing/dev).
 */
import { tick } from './runner.js';
let shuttingDown = false;
let currentTimer = null;
export function startScheduler(intervalMs, deps) {
    deps.log(`Scheduler starting (interval ${intervalMs / 1000}s)`);
    async function runTick() {
        if (shuttingDown)
            return;
        try {
            await tick(deps);
        }
        catch (e) {
            deps.log(`Tick error: ${e.message}`);
        }
        if (!shuttingDown) {
            currentTimer = setTimeout(runTick, intervalMs);
        }
    }
    // Run immediately, then schedule subsequent ticks
    void runTick();
    // Return a shutdown function
    return function shutdown() {
        shuttingDown = true;
        if (currentTimer)
            clearTimeout(currentTimer);
        deps.log('Scheduler stopped');
    };
}
export function setupGracefulShutdown(stop, log) {
    process.on('SIGTERM', () => {
        log('Received SIGTERM — shutting down gracefully');
        stop();
        process.exit(0);
    });
    process.on('SIGINT', () => {
        log('Received SIGINT — shutting down gracefully');
        stop();
        process.exit(0);
    });
}
//# sourceMappingURL=scheduler.js.map