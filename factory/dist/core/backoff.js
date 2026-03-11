import { readFileSync, writeFileSync } from 'fs';
export class BackoffManagerImpl {
    backoffFile;
    log;
    map;
    constructor(backoffFile, log) {
        this.backoffFile = backoffFile;
        this.log = log;
        this.map = this.load();
    }
    load() {
        try {
            const raw = JSON.parse(readFileSync(this.backoffFile, 'utf8'));
            const m = new Map();
            const now = Date.now();
            for (const [k, v] of Object.entries(raw)) {
                if (v.until > now)
                    m.set(k, v); // prune expired entries on load
            }
            return m;
        }
        catch {
            return new Map();
        }
    }
    save(map) {
        try {
            const obj = {};
            for (const [k, v] of map.entries())
                obj[k] = v;
            writeFileSync(this.backoffFile, JSON.stringify(obj, null, 2));
        }
        catch (e) {
            this.log(`saveCrashBackoff error: ${e.message}`);
        }
    }
    isInCrashBackoff(key) {
        const b = this.map.get(key);
        if (!b)
            return false;
        if (Date.now() < b.until) {
            const remaining = ((b.until - Date.now()) / 60000).toFixed(1);
            this.log(`⏸ ${key} in crash backoff (${b.failures} fails, ${remaining}m remaining) — skipping spawn`);
            return true;
        }
        return false; // backoff expired
    }
    recordCrash(key, _fast, _logFile) {
        const prev = this.map.get(key) ?? { failures: 0, until: 0 };
        const failures = prev.failures + 1;
        const backoffMs = Math.min(failures * 5 * 60000, 30 * 60000);
        this.map.set(key, { failures, until: Date.now() + backoffMs });
        this.save(this.map);
    }
    clearBackoff(key) {
        this.map.delete(key);
        this.save(this.map);
    }
    getBackoff(key) {
        return this.map.get(key);
    }
    /** Direct access to the internal map — used by LockManager */
    getMap() {
        return this.map;
    }
}
//# sourceMappingURL=backoff.js.map