/**
 * DraftStation — second stage of the Content Pipeline.
 *
 * Triggered by: `station:draft`
 * Produces:     `station:review`
 *
 * Reads the research comment from the ResearchStation and writes
 * a full article draft as a GitHub comment.
 *
 * This is a documented skeleton — extend buildTask() with your
 * style guide, word count requirements, tone, format, etc.
 */
import type { Issue, AgentTask } from '../../types/index.js';
import { BaseStation, type FactoryContext, type ShouldProcessResult } from '../base.js';
export declare class DraftStation extends BaseStation {
    readonly id = "draft";
    readonly label = "station:draft";
    readonly nextLabel = "station:review";
    readonly model = "claude-sonnet-4-6";
    readonly concurrency = 2;
    readonly ttl = 3600000;
    shouldProcess(issue: Issue, _ctx: FactoryContext): Promise<ShouldProcessResult>;
    buildTask(issue: Issue, ctx: FactoryContext): Promise<AgentTask>;
}
//# sourceMappingURL=index.d.ts.map