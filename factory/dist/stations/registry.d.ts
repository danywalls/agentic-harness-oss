/**
 * StationRegistry — holds all registered stations, looked up by id or label.
 *
 * Usage:
 *   const registry = StationRegistry.createDefault(config);
 *   const station = registry.get('spec');
 *   const allStations = registry.getAll();
 *
 * To add a new station:
 *   1. Create src/stations/<name>/index.ts implementing BaseStation
 *   2. Import it in createDefault() below
 *   3. Call registry.register(new YourStation())
 *   4. Add the station to pipelines.json
 */
import type { Config } from '../types/index.js';
import { BaseStation } from './base.js';
export declare class StationRegistry {
    private stations;
    private byLabel;
    /**
     * Register a station.
     * Throws if a station with the same id is already registered.
     */
    register(station: BaseStation): void;
    /**
     * Look up a station by its unique id.
     * e.g. 'spec', 'design', 'research'
     */
    get(id: string): BaseStation | undefined;
    /**
     * Look up a station by its triggering GitHub label.
     * e.g. 'station:intake' → SpecStation
     *      'pipeline:content' → ResearchStation
     */
    getByLabel(label: string): BaseStation | undefined;
    /**
     * Return all stations in registration order.
     */
    getAll(): BaseStation[];
    /**
     * List all registered station IDs.
     */
    list(): string[];
    /**
     * Create and register all built-in stations.
     * Called once at startup.
     *
     * ─── Software Pipeline ────────────────────────────────────
     * spec     → intake → spec
     * design   → spec   → design
     * build    → design → build
     * qa       → build  → qa
     * bugfix   → bugfix → build
     *
     * ─── Content Pipeline ─────────────────────────────────────
     * research → pipeline:content → station:draft
     * draft    → station:draft    → station:review
     * review   → station:review   → station:publish
     * publish  → station:publish  → station:done
     */
    static createDefault(_config: Config): Promise<StationRegistry>;
}
//# sourceMappingURL=registry.d.ts.map