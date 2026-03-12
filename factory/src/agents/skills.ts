/**
 * Dynamic skill detection and installation for agent spawning.
 *
 * Detects the tech stack from issue content and installs relevant
 * skills into the agent's working directory before spawn.
 *
 * Also includes find-skills as a base skill so agents can
 * self-discover additional skills mid-task.
 */

import { execSync } from 'child_process';

/** Known stack → skill mappings */
const STACK_SKILLS: Record<string, string[]> = {
  // Frontend frameworks
  'react':     ['reactjs/react.dev@react-expert', 'vercel-labs/agent-skills@vercel-react-best-practices'],
  'next.js':   ['wsimmonds/claude-nextjs-skills@nextjs-app-router-fundamentals'],
  'nextjs':    ['wsimmonds/claude-nextjs-skills@nextjs-app-router-fundamentals'],

  // Backend / Database
  'supabase':  ['supabase/agent-skills@supabase-postgres-best-practices'],
  'postgres':  ['supabase/agent-skills@supabase-postgres-best-practices'],
  'postgresql': ['supabase/agent-skills@supabase-postgres-best-practices'],

  // Deployment
  'vercel':    ['vercel-labs/agent-skills@deploy-to-vercel'],

  // Design (Impeccable — enterprise-grade UI/UX)
  'ui':        ['pbakaus/impeccable@frontend-design'],
  'design':    ['pbakaus/impeccable@frontend-design'],
  'css':       ['pbakaus/impeccable@frontend-design'],
  'frontend':  ['pbakaus/impeccable@frontend-design'],
  'dashboard': ['pbakaus/impeccable@frontend-design'],
  'page':      ['pbakaus/impeccable@frontend-design'],
  'app':       ['pbakaus/impeccable@frontend-design'],
};

/** Keywords to scan for in issue title + body */
const STACK_KEYWORDS = Object.keys(STACK_SKILLS);

/**
 * Detect tech stack from issue content and return unique skill identifiers to install.
 */
export function detectSkills(title: string, body: string): string[] {
  const content = `${title} ${body}`.toLowerCase();
  const skills = new Set<string>();

  for (const keyword of STACK_KEYWORDS) {
    if (content.includes(keyword)) {
      for (const skill of STACK_SKILLS[keyword]) {
        skills.add(skill);
      }
    }
  }

  return Array.from(skills);
}

/**
 * Install skills globally for Claude Code if not already present.
 * Returns list of skills that were installed.
 */
export function ensureSkillsInstalled(
  skills: string[],
  log: (msg: string) => void,
): string[] {
  const installed: string[] = [];

  for (const skill of skills) {
    try {
      // Check if already installed by looking at the global skills dir
      const skillName = skill.includes('@') ? skill.split('@')[1] : skill;
      const checkResult = execSync(
        `ls ~/.agents/skills/${skillName} 2>/dev/null`,
        { encoding: 'utf8', timeout: 5000 },
      ).trim();

      if (checkResult) {
        // Already installed
        continue;
      }
    } catch {
      // Not installed — install it
    }

    try {
      log(`📦 Installing skill: ${skill}`);
      execSync(
        `npx skills add ${skill} -g -a claude-code -y 2>/dev/null`,
        { encoding: 'utf8', timeout: 30000, stdio: 'pipe' },
      );
      installed.push(skill);
    } catch (e: any) {
      log(`⚠️ Failed to install skill ${skill}: ${e.message?.slice(0, 100)}`);
    }
  }

  return installed;
}

/**
 * Pre-spawn hook: detect stack from issue, install missing skills.
 * Called by the harness before spawning a Build/QA/Bugfix agent.
 */
export function prepareSkillsForIssue(
  issueTitle: string,
  issueBody: string,
  station: string,
  log: (msg: string) => void,
): void {
  // Only install skills for build-related stations
  if (!['build', 'qa', 'bugfix'].includes(station)) return;

  const skills = detectSkills(issueTitle, issueBody);

  if (skills.length === 0) {
    log(`🔍 No stack-specific skills detected for this issue`);
    return;
  }

  log(`🔍 Detected skills for stack: ${skills.map(s => s.split('@')[1] || s).join(', ')}`);
  const newlyInstalled = ensureSkillsInstalled(skills, log);

  if (newlyInstalled.length > 0) {
    log(`📦 Installed ${newlyInstalled.length} new skill(s)`);
  }
}
