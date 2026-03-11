/**
 * ReviewStation — third stage of the Content Pipeline.
 *
 * Triggered by: `station:review`
 * Produces:     `station:publish`
 *
 * Reads the draft comment and performs editorial review:
 * factual accuracy, style, grammar, SEO, readability.
 * Returns either an approved draft or revision requests.
 *
 * This is a documented skeleton — extend with your editorial standards.
 */
import type { Issue, AgentTask } from '../../types/index.js';
import { BaseStation, type FactoryContext, type ShouldProcessResult } from '../base.js';
export declare class ReviewStation extends BaseStation {
    readonly id = "review";
    readonly label = "station:review";
    readonly nextLabel = "station:publish";
    readonly model = "claude-sonnet-4-6";
    readonly concurrency = 1;
    readonly ttl = 3600000;
    shouldProcess(issue: Issue, _ctx: FactoryContext): Promise<ShouldProcessResult>;
    buildTask(issue: Issue, ctx: FactoryContext): Promise<AgentTask>;
}
//# sourceMappingURL=index.d.ts.map