const STATION_EMOJI = {
    spec: '📋',
    design: '🎨',
    build: '🔧',
    qa: '🔍',
    bugfix: '🐛',
    done: '✅',
    blocked: '🚫',
};
export async function notifyDiscord(msg, webhookUrl, log) {
    if (!webhookUrl)
        return;
    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: msg }),
        });
    }
    catch (e) {
        log(`Discord notify failed: ${e.message}`);
    }
}
export async function notifyStation(issueNumber, issueTitle, station, webhookUrl, log) {
    const emoji = STATION_EMOJI[station] ?? '⏳';
    const shortTitle = issueTitle.replace(/^\[.*?\]\s*/, '').substring(0, 60);
    await notifyDiscord(`${emoji} **#${issueNumber}** → \`station:${station}\` | ${shortTitle}`, webhookUrl, log);
}
//# sourceMappingURL=discord.js.map