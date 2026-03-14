import { intro, outro, text, select, confirm, spinner, isCancel, cancel, note } from '@clack/prompts';
import picocolors from 'picocolors';
import pc from 'picocolors';
import { exec, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

async function checkDependencies() {
  const s = spinner();
  s.start('Checking dependencies (Node.js, claude, gh)...');
  
  try {
    // Check Node.js >= 18
    const nodeVersionLine = process.version;
    const nodeMajor = parseInt(nodeVersionLine.replace('v', '').split('.')[0], 10);
    if (nodeMajor < 18) {
      throw new Error(`Node.js 18+ required (found: ${nodeVersionLine})`);
    }

    // Check claude CLI
    try {
      await execAsync('claude --version');
    } catch {
      s.stop(pc.yellow('claude CLI not found.'));
      const shouldInstall = await confirm({
        message: 'claude CLI is required but not installed. Do you want to install it now via npm?',
        initialValue: true,
      });

      if (!shouldInstall || isCancel(shouldInstall)) {
        throw new Error(`claude CLI not found.\nInstall via: ${pc.cyan('npm install -g @anthropic-ai/claude-code')}`);
      }

      s.start('Installing claude CLI (this may take a minute)...');
      try {
        await execAsync('npm install -g @anthropic-ai/claude-code');
      } catch (installErr: any) {
        throw new Error(`Failed to install claude CLI automatically. You may need sudo, or check your npm permissions.\nPlease install manually: ${pc.cyan('npm install -g @anthropic-ai/claude-code')}`);
      }
      
      // Resume spinner for remaining checks
      s.start('Checking remaining dependencies (gh)...');
    }

    // Check gh CLI
    let ghInstalled = false;
    try {
      await execAsync('gh --version');
      ghInstalled = true;
    } catch {}

    if (!ghInstalled) {
      s.stop(pc.yellow('GitHub CLI (gh) not found.'));
      const isMac = process.platform === 'darwin';
      
      if (isMac) {
        const installGh = await confirm({
          message: 'GitHub CLI is required but not installed. Do you want to try installing it via Homebrew?',
          initialValue: true,
        });

        if (installGh && !isCancel(installGh)) {
          s.start('Installing GitHub CLI (brew install gh)...');
          try {
            await execAsync('brew install gh');
            ghInstalled = true;
          } catch (e) {
            throw new Error(`Failed to install gh via brew. Please install from: ${pc.cyan('https://cli.github.com')}`);
          }
        } else {
          throw new Error(`Install gh manually from ${pc.cyan('https://cli.github.com')}`);
        }
      } else {
         throw new Error(`GitHub CLI not found. Please install manually from ${pc.cyan('https://cli.github.com')}`);
      }
    }

    // Check gh CLI auth
    s.start('Checking GitHub authentication...');
    let authSuccess = false;
    while (!authSuccess) {
      try {
        await execAsync('gh auth status');
        authSuccess = true;
      } catch {
        s.stop(pc.yellow('GitHub CLI is not authenticated.'));
        const authNow = await confirm({
          message: `Please open a new terminal, run ${pc.cyan('gh auth login')}, and then press Enter here once done. Ready?`,
          initialValue: true
        });
        
        if (!authNow || isCancel(authNow)) {
          throw new Error(`You must authenticate with GitHub CLI first. Run: ${pc.cyan('gh auth login')}`);
        }
        s.start('Re-checking GitHub authentication...');
      }
    }

    s.stop(pc.green('All dependencies are installed and authenticated!'));
  } catch (error: any) {
    s.stop(pc.red('Dependency check failed.'));
    cancel(error.message);
    process.exit(1);
  }
}

async function handleFiles() {
  const configExamplePath = path.join(REPO_ROOT, 'factory', 'config.example.json');
  const configPath = path.join(REPO_ROOT, 'factory', 'config.json');
  const envExamplePath = path.join(REPO_ROOT, '.env.example');
  const envPath = path.join(REPO_ROOT, '.env');

  try {
    await fs.access(configPath);
  } catch {
    await fs.copyFile(configExamplePath, configPath);
  }

  try {
    await fs.access(envPath);
  } catch {
    await fs.copyFile(envExamplePath, envPath);
  }
}

async function setupGithubLabels(repo: string) {
  const s = spinner();
  s.start(`Setting up GitHub labels for ${pc.cyan(repo)}...`);

  const labels = [
    "station:intake", "station:spec", "station:design", "station:build", 
    "station:qa", "station:uat", "station:bugfix", "station:done", "station:skip", 
    "station:blocked", "status:paused", "complexity:simple", "complexity:medium", 
    "complexity:complex"
  ];

  let successCount = 0;
  for (const label of labels) {
    try {
      await execAsync(`gh label create "${label}" --repo ${repo}`);
      successCount++;
    } catch (e: any) {
      // If it already exists, gh CLI will fail with an error. We can ignore it safely.
      // Usually the error contains: 'already exists'
    }
  }

  s.stop(pc.green(`GitHub labels checked/created successfully.`));
}

async function updateEnvAndConfig(repo: string, apiKey: string) {
  const configPath = path.join(REPO_ROOT, 'factory', 'config.json');
  const envPath = path.join(REPO_ROOT, '.env');

  // Update factory/config.json using JSON parsing
  try {
    let configContent = await fs.readFile(configPath, 'utf8');
    const config = JSON.parse(configContent);
    if (!config.github) config.github = {};
    config.github.repo = repo;
    await fs.writeFile(configPath, JSON.stringify(config, null, 2), 'utf8');
  } catch (e) {
    // If it fails to parse, fallback to safe regex against old values
    let configContent = await fs.readFile(configPath, 'utf8');
    configContent = configContent.replace(/"repo":\s*".*?"/, `"repo": "${repo}"`);
    await fs.writeFile(configPath, configContent, 'utf8');
  }

  // Update .env using robust anchors
  let envContent = await fs.readFile(envPath, 'utf8');
  
  if (envContent.match(/^GITHUB_REPO=.*/m)) {
    envContent = envContent.replace(/^GITHUB_REPO=.*/m, `GITHUB_REPO=${repo}`);
  } else {
    envContent += `\nGITHUB_REPO=${repo}`;
  }

  // Clear existing uncommented keys to avoid duplicates
  envContent = envContent.replace(/^ANTHROPIC_API_KEY=.*/gm, '# ANTHROPIC_API_KEY=');
  envContent = envContent.replace(/^CLAUDE_CODE_OAUTH_TOKEN=.*/gm, '# CLAUDE_CODE_OAUTH_TOKEN=');

  if (apiKey.startsWith('sk-ant-oat')) {
    envContent = envContent.replace(/^#?\s*CLAUDE_CODE_OAUTH_TOKEN=.*/m, `CLAUDE_CODE_OAUTH_TOKEN=${apiKey}`);
  } else {
    envContent = envContent.replace(/^#?\s*ANTHROPIC_API_KEY=.*/m, `ANTHROPIC_API_KEY=${apiKey}`);
  }

  await fs.writeFile(envPath, envContent, 'utf8');
}

async function main() {
  console.clear();
  
  intro(`${pc.bgBlue(pc.white(' agentic-harness installer '))} \n${pc.dim('SPEC → DESIGN → BUILD → QA → DONE')}`);

  await checkDependencies();

  await handleFiles();

  // Try to read existing values for defaults
  let currentRepo = '';
  let currentKey = '';
  try {
    const envContent = await fs.readFile(path.join(REPO_ROOT, '.env'), 'utf8');
    const repoMatch = envContent.match(/^GITHUB_REPO=(.+)$/m);
    if (repoMatch) currentRepo = repoMatch[1].trim();
    
    const oauthMatch = envContent.match(/^CLAUDE_CODE_OAUTH_TOKEN=(.+)$/m);
    const apiMatch = envContent.match(/^ANTHROPIC_API_KEY=(.+)$/m);
    if (oauthMatch && !oauthMatch[1].includes('your-vercel-token')) currentKey = oauthMatch[1].trim();
    else if (apiMatch && !apiMatch[1].includes('your-vercel-token')) currentKey = apiMatch[1].trim();
  } catch (e) {}

  if (currentRepo && currentRepo !== 'owner/your-repo' && currentKey && currentKey.startsWith('sk-ant')) {
    const shouldOverwrite = await confirm({
      message: `It looks like agentic-harness is already configured for ${pc.cyan(currentRepo)}. Do you want to overwrite the current configuration?`,
      initialValue: false,
    });

    if (isCancel(shouldOverwrite)) {
      cancel('Operation cancelled.');
      process.exit(0);
    }
    
    if (!shouldOverwrite) {
      outro(pc.green('Configuration left unchanged. ✅ agentic-harness is ready!'));
      process.exit(0);
    }
  }

  const repo = await text({
    message: 'What is your GitHub repository? (e.g. owner/repo)',
    placeholder: 'owner/repo',
    initialValue: currentRepo && currentRepo !== 'owner/your-repo' ? currentRepo : undefined,
    validate(value) {
      if (!value || value.length === 0) return 'Repository is required!';
      if (!value.includes('/')) return 'Please format as owner/repo';
    },
  });

  if (isCancel(repo)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  const apiKey = await text({
    message: 'What is your Anthropic API key? (sk-ant-... or sk-ant-oat01-...)',
    placeholder: 'sk-ant-...',
    initialValue: currentKey && currentKey.startsWith('sk-ant') ? currentKey : undefined,
    validate(value) {
      if (!value || value.length === 0) return 'API key is required!';
    },
  });

  if (isCancel(apiKey)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  const setupLabels = await confirm({
    message: 'Do you want to automatically set up the required GitHub labels in this repository?',
    initialValue: true,
  });

  if (isCancel(setupLabels)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  const sFiles = spinner();
  sFiles.start('Writing configuration files...');
  await updateEnvAndConfig(repo as string, apiKey as string);
  sFiles.stop(pc.green('Configuration files written.'));

  if (setupLabels) {
    await setupGithubLabels(repo as string);
  }

  note(
    `1. Review ${pc.cyan('.env')} and ${pc.cyan('factory/config.json')}\n` +
    `2. Create an issue in GitHub with the label 'station:intake' to trigger a pipeline!`,
    'Next steps'
  );

  const testIssue = await confirm({
    message: 'Do you want to create your first example issue now? (A simple "Todo App" task)',
    initialValue: true,
  });

  if (testIssue && !isCancel(testIssue)) {
    const sIssue = spinner();
    sIssue.start('Creating example issue on GitHub...');
    try {
      await execAsync(`gh issue create --repo ${repo} --title "Build a simple todo app with auth" --body "A task management app. Users can sign up, create todos, mark them done. Deploy to Vercel." --label "station:intake"`);
      sIssue.stop(pc.green('Example issue created with label "station:intake"!'));
    } catch (e: any) {
      sIssue.stop(pc.yellow('Failed to create example issue (maybe check your gh permissions).'));
    }
  }

  const startNow = await confirm({
    message: 'Do you want to start the factory loop now? (It will keep running in this terminal)',
    initialValue: true,
  });

  if (startNow && !isCancel(startNow)) {
    outro(pc.green('Starting the factory loop... 🚀'));
    
    const child = spawn('npm', ['run', 'dev'], {
      stdio: 'inherit',
      cwd: REPO_ROOT
    });

    child.on('close', (code) => {
      process.exit(code || 0);
    });

    return; // Prevent reaching the second outro
  }

  outro(pc.green('✅ agentic-harness is ready!'));
}

main().catch(console.error);
