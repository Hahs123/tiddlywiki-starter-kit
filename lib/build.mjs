#!/usr/bin/env node

import chalk from 'chalk';
import ora from 'ora';
import generateTiddlyWikiInfo from '../tiddlywiki.config.mjs';
import { spawn } from 'cross-spawn';
import dotenv from 'dotenv';
import { isCI, name as ciName } from 'ci-info';

dotenv.config();

const { TIDDLERSREPO, OUTPUTDIR } = process.env;
const hasBun = process.versions.bun;
const wikiLocation = process.env.wikiLocation;

const log = ora(
  chalk.cyan(`${isCI ? ciName : ''} ${hasBun ? '🥟' : '📦'} Building ...`),
);

function cloneTiddlers(callback) {
  log.start();

  if (isCI) {
    spawn('tiged', [TIDDLERSREPO, `${wikiLocation}/tiddlers`], {
      shell: true,
    }).on('close', () => {
      log.info(`tiddlers 文件夹复制完成(${ciName})`);
      spawn('lint-md', ['**', '--fix']).on('close', () => {
        log.info('markdown 文件格式化完成');
        callback();
      });
    });
  } else {
    callback();
  }
}

function copyFiles() {
  // cp and spawn on windows cannot use , need some npm package instead
  spawn('cp', ['-r', 'files', 'vercel.json', OUTPUTDIR]).on('close', () => {
    log.succeed('复制完成');
  });
}

const main = () => {
  generateTiddlyWikiInfo();
  // spawn('cp', ['dev', 'plugins/oeyoews']);
  // TODO: build empty.html and full.html
  // on windows, need use pnpm dlx instead of npx
  // pnpm dlx 会用到缓存
  spawn('pnpm', ['tiddlywiki', '--build'], { shell: true }).on('close', () => {
    log.succeed(`构建完成 ${OUTPUTDIR}`);
    isCI && copyFiles();
  });
};

cloneTiddlers(main);
