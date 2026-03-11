/**
 * Run a `gh` command that returns JSON output.
 * Automatically appends `--repo <REPO>` and `--json number,title,body,labels,url`.
 */
export declare function gh(cmd: string, repo: string): unknown;
/**
 * Run a `gh` write command (comment, edit, label) that doesn't support --json output.
 */
export declare function ghWrite(cmd: string, repo: string): void;
/**
 * Run an arbitrary gh command (no automatic --repo or --json injection).
 */
export declare function ghRaw(cmd: string, repo: string): string;
/**
 * Run an arbitrary gh command without a repo flag (e.g., `gh api ...`).
 */
export declare function ghNoRepo(cmd: string): string;
//# sourceMappingURL=client.d.ts.map