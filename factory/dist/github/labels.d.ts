export declare function addLabel(issueNumber: number, label: string, repo: string): void;
export declare function removeLabel(issueNumber: number, label: string, repo: string): void;
/** Remove one label and add another atomically (single gh invocation) */
export declare function transitionLabel(issueNumber: number, fromLabel: string, toLabel: string, repo: string): void;
//# sourceMappingURL=labels.d.ts.map