/**
 * Dynamic skill detection and installation for agent spawning.
 *
 * Detects the tech stack from issue content and installs relevant
 * skills into the agent's working directory before spawn.
 *
 * Also includes find-skills as a base skill so agents can
 * self-discover additional skills mid-task.
 */
/**
 * Detect tech stack from issue content and return unique skill identifiers to install.
 */
export declare function detectSkills(title: string, body: string): string[];
/**
 * Install skills globally for Claude Code if not already present.
 * Returns list of skills that were installed.
 */
export declare function ensureSkillsInstalled(skills: string[], log: (msg: string) => void): string[];
/**
 * Pre-spawn hook: detect stack from issue, install missing skills.
 * Called by the harness before spawning a Build/QA/Bugfix agent.
 */
export declare function prepareSkillsForIssue(issueTitle: string, issueBody: string, station: string, log: (msg: string) => void): void;
//# sourceMappingURL=skills.d.ts.map