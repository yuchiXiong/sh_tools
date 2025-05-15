#!/usr/bin/env node

/**
 * pnv: project node version
 */

const { existsSync, readFileSync } = require('fs');


// 1. 首先看项目里有没有 .nvmrc 文件，有就直接返回版本号
try {
  if (existsSync('.nvmrc')) {
    const nvmrc = readFileSync('.nvmrc', 'utf-8');
    console.log(nvmrc.toString().trim());
    process.exit(0);
  }
} catch (error) {
  // .nvmrc 文件不存在或无法读取，继续检查 Dockerfile
}

// 2. 没有 .nvmrc 文件，就看 Dockerfile 里 builder 镜像的 node 版本
try {
  if (existsSync('Dockerfile')) {
    const dockerContent = readFileSync('Dockerfile', 'utf-8');
    const nodeVersionMatch = dockerContent.match(/node:(\d+\.\d+\.\d+)/);
    // const nodeVersion = dockerFromSetting.toString().trim().split(' ')[1].split(':')[1].replaceAll('-slim', '');
    if (nodeVersionMatch) {
      console.log(nodeVersionMatch[1]);
      process.exit(0);
    }
  }
} catch (error) {
  // Dockerfile 不存在或无法读取
}

console.error('未找到 .nvmrc 或 Dockerfile 中的 Node.js 版本信息');
process.exit(1);
