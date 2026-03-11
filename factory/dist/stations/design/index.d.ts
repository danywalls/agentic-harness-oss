/**
 * DesignStation — processes issues at 'station:spec', produces 'station:design'.
 *
 * Ported from makeDesignTask() in factory-loop.js.
 *
 * Gates:
 *  1. Base checks (skip/paused/phase2)
 *  2. Manifest check (skip if invalid, unless internal/change/standalone)
 *  3. spec_approved gate (skip if not approved, unless internal/change/standalone)
 *  4. hasDesignComment (skip if design already posted)
 */
import type { Issue, AgentTask } from '../../types/index.js';
import { BaseStation, type FactoryContext, type ShouldProcessResult } from '../base.js';
export declare class DesignStation extends BaseStation {
    readonly id = "design";
    readonly label = "station:spec";
    readonly nextLabel = "station:design";
    readonly model = "claude-opus-4-5";
    readonly concurrency = 2;
    readonly ttl = 7200000;
    shouldProcess(issue: Issue, ctx: FactoryContext): Promise<ShouldProcessResult>;
    buildTask(issue: Issue, ctx: FactoryContext): Promise<AgentTask>;
}
//# sourceMappingURL=index.d.ts.map