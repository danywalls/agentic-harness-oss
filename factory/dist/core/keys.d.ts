import type { KeyManager, KeysConfig } from '../types/index.js';
export declare class KeyManagerImpl implements KeyManager {
    private readonly keysFile;
    private readonly claudeBin;
    private readonly log;
    constructor(keysFile: string, claudeBin: string, log: (msg: string) => void);
    loadKeys(): KeysConfig | null;
    getCurrentKey(): string;
    rotateKey(reason?: string): void;
    checkLogForKeyError(logPath: string): boolean;
    /**
     * Build the correct env for a given key.
     *
     * CRITICAL:
     *   OAuth token (sk-ant-oat*) → CLAUDE_CODE_OAUTH_TOKEN ONLY,
     *     ANTHROPIC_API_KEY must be absent.
     *   API key (sk-ant-api*) → ANTHROPIC_API_KEY ONLY,
     *     CLAUDE_CODE_OAUTH_TOKEN must be absent.
     * Setting the wrong env var causes silent hang: agent reads task,
     * makes zero network calls, 0-byte log.
     */
    buildAgentEnv(apiKey: string): NodeJS.ProcessEnv;
    validateKey(): Promise<{
        ok: boolean;
        reason?: string;
    }>;
}
//# sourceMappingURL=keys.d.ts.map