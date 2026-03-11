export interface SupabaseHeaders {
    apikey: string;
    Authorization: string;
    [key: string]: string;
}
export declare function makeSupabaseHeaders(serviceRoleKey: string): SupabaseHeaders;
export declare function pushToThread(submissionId: string, type: string, payload: unknown, content: string, factoryAppUrl: string, factorySecret: string, log: (msg: string) => void): Promise<void>;
export declare function pushChangeRequestStatus(issueNumber: number, status: string, supabaseUrl: string, supabaseKey: string, log: (msg: string) => void): Promise<void>;
export declare function writeTokenUsageAsync(issueNumber: number, station: string, logFile: string, supabaseUrl: string, supabaseKey: string, log: (msg: string) => void): Promise<void>;
export declare function getSubmissionForIssue(issueNumber: number, supabaseUrl: string, supabaseKey: string, _log?: (msg: string) => void): Promise<Record<string, unknown> | null>;
export declare function isSpecApproved(issue: {
    number: number;
} | number, supabaseUrl: string, supabaseKey: string, _log?: (msg: string) => void): Promise<boolean>;
export declare function isClientApproved(issue: {
    number: number;
}, supabaseUrl: string, supabaseKey: string, log: (msg: string) => void): Promise<boolean>;
//# sourceMappingURL=supabase.d.ts.map