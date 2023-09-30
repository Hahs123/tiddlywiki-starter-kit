#!/usr/bin/env node

import chalk from 'chalk';
import ora from 'ora';
import generateTiddlyWikiInfo from '../tiddlywiki.config.mjs';
import { spawn } from 'child_process';
import dotenv from 'dotenv';
import ci from 'ci-info';

dotenv.config();

const { TIDDLERSREPO, OUTPUTDIR } = process.env;
const hasBun = process.versions.bun;

const log = ora(
  chalk.cyan(`${ci.isCI ? ci.name : ''} ${hasBun ? '🥟' : '📦'} Building ...`),
);

function cloneTiddlers(callback) {
  log.start();
  if (ci.isCI) {
    spawn('tiged', [TIDDLERSREPO, 'tiddlers']).on('close', () => {
      log.info(`tiddlers 文件夹复制完成(${ci.name})`);
      callback();
    });
  } else {
    callback();
  }
}

function copyFiles() {
  spawn('cp', ['-r', 'files', 'vercel.json', OUTPUTDIR]).on('close', () => {
    log.succeed('复制完成');
  });
}

const main = () => {
  generateTiddlyWikiInfo();
  // TODO: build empty.html and full.html
  spawn('npx', ['tiddlywiki', '--build']).on('close', () => {
    log.succeed(`构建完成 ${OUTPUTDIR}`);
    copyFiles();
  });
};

cloneTiddlers(main);
