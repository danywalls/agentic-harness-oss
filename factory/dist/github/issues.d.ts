import type { GitHubIssue, Issue, ClientManifest } from '../types/index.js';
export declare function extractManifest(body: string | null | undefined): ClientManifest | null;
export declare function isValidManifest(issue: GitHubIssue): boolean;
export declare function isChangeRequestIssue(issue: GitHubIssue): boolean;
export declare function extractBuildRepo(issueBody: string | null | undefined): string | null;
export declare function extractSubmissionId(issueBody: string | null | undefined): string | null;
/** Enrich a raw GitHubIssue into the typed Issue shape */
export declare function enrichIssue(raw: GitHubIssue): Issue;
/** Fetch issues by label using the `gh` CLI */
export declare function getIssuesByLabel(label: string, repo: string, limit?: number): GitHubIssue[];
/** Fetch all open issues with a given label, enriched */
export declare function getEnrichedIssuesByLabel(label: string, repo: string, limit?: number): Issue[];
/** Check if the issue has a DESIGN.md comment */
export declare function hasDesignComment(issueNumber: number, repo: string): boolean;
/** Check DESIGN.md quality (word count + required sections) */
export declare function checkDesignQuality(issueNumber: number, repo: string, log: (msg: string) => void): {
    ok: boolean;
    reason?: string;
};
/** Get last QA info from issue comments */
export declare function getLastQAInfo(issueNumber: number, repo: string, log: (msg: string) => void): Promise<{
    hasFailedQA: boolean;
    lastQAAt?: string;
    buildRepo: string | null;
}>;
/** Check if the build repo has moved since last QA */
export declare function hasBuildMovedSinceLastQA(buildRepo: string | null, lastQAAt: string | undefined, log: (msg: string) => void): Promise<boolean>;
//# sourceMappingURL=issues.d.ts.map