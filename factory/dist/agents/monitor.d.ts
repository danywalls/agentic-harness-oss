/**
 * ActivityMonitor tracks per-PID last-seen timestamps.
 * Used by LockManager to detect truly hung agents (not just agents
 * between API calls with no open connections).
 */
export declare class ActivityMonitor {
    private readonly activityFile;
    private activity;
    constructor(activityFile?: string);
    private load;
    private persist;
    updateActivity(pid: number): void;
    getLastSeen(pid: number, fallback: number): number;
    isHung(pid: number, startedAt: number, station: string, thresholds?: Record<string, number>): boolean;
    pruneStale(pid: number): void;
}
//# sourceMappingURL=monitor.d.ts.map