/**
 * BaseStation — abstract base class for all factory stations.
 *
 * Each concrete station:
 *  - Declares its own id, label, nextLabel, model, concurrency, ttl
 *  - Implements shouldProcess() with station-specific gates
 *  - Implements buildTask() with the full agent prompt
 *  - Inherits shared utility methods from this class
 */
import type { Issue, AgentTask, Config } from '../types/index.js';
export interface ShouldProcessResult {
    process: boolean;
    /** Reason why skipped, for logging */
    reason?: string;
}
/** Minimal context passed to station methods */
export interface FactoryContext {
    config: Config;
    env: FactoryEnv;
    log: (msg: string) => void;
}
export interface FactoryEnv {
    repo: string;
    supabaseUrl: string;
    supabaseKey: string;
    factorySecret: string;
    factoryAppUrl: string;
    discordWebhookUrl: string;
    useClaudeCli: boolean;
    logFile: string;
}
export declare abstract class BaseStation {
    /** Unique station identifier (e.g., 'spec', 'design', 'build') */
    abstract readonly id: string;
    /** GitHub label that triggers this station (e.g., 'station:intake') */
    abstract readonly label: string;
    /** GitHub label to apply on completion (e.g., 'station:spec') */
    abstract readonly nextLabel: string;
    /** Claude model to use */
    abstract readonly model: string;
    /** Max concurrent agents for this station */
    abstract readonly concurrency: number;
    /** Max ms before a lock is considered hung (normal issues) */
    abstract readonly ttl: number;
    /**
     * Decide whether to process this issue at this station.
     * Return { process: false, reason } to skip with logging.
     */
    abstract shouldProcess(issue: Issue, ctx: FactoryContext): Promise<ShouldProcessResult>;
    /**
     * Build the agent task (full prompt) for this issue.
     * Called only when shouldProcess returns { process: true }.
     */
    abstract buildTask(issue: Issue, ctx: FactoryContext): Promise<AgentTask>;
    protected hasLabel(issue: Issue, label: string): boolean;
    protected hasAnyLabel(issue: Issue, labels: string[]): boolean;
    protected isSimple(issue: Issue): boolean;
    /**
     * Effective TTL: use shorter LOCK_TTL_SIMPLE for complexity:simple issues.
     * Matches the getLockTTL() logic from the monolith exactly.
     */
    protected getEffectiveTTL(issue: Issue): number;
    protected log(ctx: FactoryContext, msg: string): void;
    /**
     * Common shouldProcess checks shared by all stations:
     *   - station:skip → skip
     *   - status:paused → skip
     *   - type:phase2 → skip
     *
     * Returns null if all checks pass (caller should continue with its own checks).
     */
    protected baseCheck(issue: Issue, _ctx: FactoryContext): Promise<ShouldProcessResult | null>;
    /**
     * Manifest check: skip if invalid manifest (unless internal/change/standalone).
     * Ports the shouldProcess() logic from the monolith exactly.
     */
    protected manifestCheck(issue: Issue, env: FactoryEnv): ShouldProcessResult | null;
}
//# sourceMappingURL=base.d.ts.map