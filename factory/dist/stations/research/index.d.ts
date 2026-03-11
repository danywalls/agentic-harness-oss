/**
 * ResearchStation — first stage of the Content Pipeline.
 *
 * Triggered by: `pipeline:content`
 * Produces:     `station:draft`
 *
 * This is a documented skeleton — content pipeline implementors should extend
 * the buildTask() prompt with domain-specific research instructions.
 *
 * To activate this station in a pipeline, add it to pipelines.json:
 *   { "stationId": "research", "label": "pipeline:content", "nextLabel": "station:draft" }
 *
 * Note: the label uses the `pipeline:*` prefix (not `station:*`) because this
 * is the content pipeline's entry label — it doubles as both detection signal
 * and stage trigger.
 */
import type { Issue, AgentTask } from '../../types/index.js';
import { BaseStation, type FactoryContext, type ShouldProcessResult } from '../base.js';
export declare class ResearchStation extends BaseStation {
    readonly id = "research";
    readonly label = "pipeline:content";
    readonly nextLabel = "station:draft";
    readonly model = "claude-sonnet-4-6";
    readonly concurrency = 2;
    readonly ttl = 1800000;
    shouldProcess(issue: Issue, _ctx: FactoryContext): Promise<ShouldProcessResult>;
    buildTask(issue: Issue, ctx: FactoryContext): Promise<AgentTask>;
}
//# sourceMappingURL=index.d.ts.map