import type { BackoffEntry, BackoffManager } from '../types/index.js';
export declare class BackoffManagerImpl implements BackoffManager {
    private readonly backoffFile;
    private readonly log;
    private map;
    constructor(backoffFile: string, log: (msg: string) => void);
    load(): Map<string, BackoffEntry>;
    save(map: Map<string, BackoffEntry>): void;
    isInCrashBackoff(key: string): boolean;
    recordCrash(key: string, _fast: boolean, _logFile?: string): void;
    clearBackoff(key: string): void;
    getBackoff(key: string): BackoffEntry | undefined;
    /** Direct access to the internal map — used by LockManager */
    getMap(): Map<string, BackoffEntry>;
}
//# sourceMappingURL=backoff.d.ts.map