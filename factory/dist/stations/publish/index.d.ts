/**
 * PublishStation — terminal stage of the Content Pipeline.
 *
 * Triggered by: `station:publish`
 * Produces:     null (terminal — no nextLabel)
 *
 * Takes the reviewed article and publishes it to the configured destination:
 * CMS, static site generator, blog platform, etc.
 *
 * This is a documented skeleton. Implementors must fill in:
 *   - Where to publish (CMS API, GitHub Pages, Contentful, Ghost, etc.)
 *   - Authentication method (API key from env or config)
 *   - Post-publish verification
 *
 * Since this is a terminal stage (nextLabel = null in pipelines.json),
 * the issue is closed or moved to 'station:done' by the agent itself.
 */
import type { Issue, AgentTask } from '../../types/index.js';
import { BaseStation, type FactoryContext, type ShouldProcessResult } from '../base.js';
export declare class PublishStation extends BaseStation {
    readonly id = "publish";
    readonly label = "station:publish";
    readonly nextLabel = "station:done";
    readonly model = "claude-sonnet-4-6";
    readonly concurrency = 1;
    readonly ttl = 1800000;
    shouldProcess(issue: Issue, _ctx: FactoryContext): Promise<ShouldProcessResult>;
    buildTask(issue: Issue, ctx: FactoryContext): Promise<AgentTask>;
}
//# sourceMappingURL=index.d.ts.map