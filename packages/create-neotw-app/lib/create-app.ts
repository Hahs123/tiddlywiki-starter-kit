import fs from 'fs';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import prompts from 'prompts';
import { validateNpmName } from './vaildate-pkg';
// import { notifyUpdate } from "./update-check";
import { onPromptState } from './onPromptState';
import { checkGitInstallation } from './check-git';

// @ts-ignore
import tiged from 'tiged';

const spinner = ora('Loading ...');

export default async function createApp() {
  checkGitInstallation();
  // await notifyUpdate();
  const user = 'oeyoews';
  const repo = 'tiddlywiki-starter-kit';
  const initial = `${user}/${repo}`;
  const { template } = await prompts({
    onState: onPromptState,
    type: 'select',
    name: 'template',
    message: 'Select template',
    choices: [{ title: initial, value: initial }],
  });
  let targetDir: string;
  const { projectName } = await prompts({
    onState: onPromptState,
    type: 'text',
    name: 'projectName',
    message: 'Project name',
    validate: (value) => {
      const validation = validateNpmName(path.basename(path.resolve(value)));
      if (!validation.valid) {
        return 'Invalid project name: ' + validation.problems![0];
      }
      if (fs.existsSync(value)) {
        return `${value} already exists`;
      }
      return true;
    },
    initial,
  });

  targetDir = projectName.trim();

  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: `Do you want to clone ${template}?`,
  });

  // 仓库路径
  const emitter = tiged(initial, {
    disableCache: true,
    force: true,
    verbose: false,
  });

  confirm &&
    spinner.start() &&
    // 仓库克隆到本地的路径
    emitter.clone(path.resolve('.', targetDir)).then(() => {
      spinner.succeed(chalk.green(`Cloned ${initial} to ${targetDir}\n`));
      spinner.succeed(
        chalk.cyan(
          'cd ' +
            chalk.green.underline(targetDir) +
            ' && pnpm install && pnpm dev\n',
        ),
      );
      process.exit(0);
    });
}
