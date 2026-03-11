import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname_config = dirname(fileURLToPath(import.meta.url));
/** Default config path — resolved relative to factory/src/core/ → factory/config.json */
const DEFAULT_CONFIG_PATH = join(__dirname_config, '../../config.json');
export function loadConfig(configPath) {
    const path = configPath ?? process.env.FACTORY_CONFIG_PATH ?? DEFAULT_CONFIG_PATH;
    if (!existsSync(path)) {
        throw new Error(`Config file not found: ${path}`);
    }
    const raw = JSON.parse(readFileSync(path, 'utf8'));
    return validateConfig(raw);
}
export function validateConfig(raw) {
    if (!raw || typeof raw !== 'object') {
        throw new Error('Config must be a JSON object');
    }
    const cfg = raw;
    // Provide sensible defaults
    const config = {
        stations: cfg.stations ?? {},
        github: {
            repo: cfg.github?.repo ?? (process.env.GITHUB_REPO ?? 'owner/repo'),
            issueLabels: cfg.github?.issueLabels,
        },
        concurrency: {
            maxTasksPerRun: cfg.concurrency?.maxTasksPerRun ?? 2,
            build: cfg.concurrency?.build,
            qa: cfg.concurrency?.qa,
            design: cfg.concurrency?.design,
        },
        notify: cfg.notify,
    };
    return config;
}
//# sourceMappingURL=config.js.map