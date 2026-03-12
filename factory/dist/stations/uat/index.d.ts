/**
 * UATStation — User Acceptance Testing station.
 *
 * Processes issues at 'station:qa' (after QA passes and flips to station:qa),
 * producing 'station:uat' → 'station:done'.
 *
 * Unlike QA (technical correctness), UAT simulates a non-technical business user
 * navigating the live app via agent-browser. Tests real user flows end-to-end:
 * login, navigate, interact, complete goals.
 *
 * Outcomes:
 *   - PASS → station:done
 *   - FAIL (critical) → creates change request issue with feedback
 *   - PASS with suggestions → station:done + enhancement comments
 */
import type { Issue, AgentTask } from '../../types/index.js';
import { BaseStation, type FactoryContext, type ShouldProcessResult } from '../base.js';
export declare class UATStation extends BaseStation {
    readonly id = "uat";
    readonly label = "station:qa";
    readonly nextLabel = "station:uat";
    readonly model = "claude-sonnet-4-6";
    readonly concurrency = 1;
    readonly ttl = 2400000;
    shouldProcess(issue: Issue, ctx: FactoryContext): Promise<ShouldProcessResult>;
    buildTask(issue: Issue, ctx: FactoryContext): Promise<AgentTask>;
}
//# sourceMappingURL=index.d.ts.map