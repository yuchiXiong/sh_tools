#!/usr/bin/env node

/**
 * pnv: project node version
 */

const { execSync } = require('child_process');

// 1. 首先看项目里有没有 .nvmrc 文件，有就直接 nvm use
try {
  const nvmrc = execSync('cat .nvmrc', { shell: true, encoding: 'utf-8' });
  if (nvmrc) {
    console.log(nvmrc.toString().trim());
    process.exit(0);
  }
} catch (error) {
  // .nvmrc 文件不存在，继续检查 Dockerfile
}

// 2. 没有 .nvmrc 文件，就看 Dockerfile 里 builder 镜像的 node 版本
try {
  const dockerFromSetting = execSync('cat Dockerfile | grep node', { shell: true, encoding: 'utf-8' });
  if (dockerFromSetting) {
    const nodeVersion = dockerFromSetting.toString().trim().split(' ')[1].split(':')[1].replaceAll('-slim', '');
    console.log(nodeVersion);
  }
} catch (error) {
  console.error('未找到 .nvmrc 或 Dockerfile');
  process.exit(1);
}
