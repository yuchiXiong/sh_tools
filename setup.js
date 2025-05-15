/**
 * setup.js
 */
const { existsSync } = require('fs');
const { execSync } = require('child_process');

const execSyncOptions = {
  shell: true,
  encoding: 'utf-8',
}

const _shell = (command) => {
  const result = execSync(command, execSyncOptions);
  return result;
}

const tools = {
  // 直接放到 /usr/local/bin 目录下
  'bin': {
    'gpc': 'git-push-current-branch',
    'pnv': 'project-node-version',
  },
  // 放到 ~/.zshrc 文件中
  'zshrc': {
    'upnv': 'use-project-node-version',
  },
}

const setupBin = (toolKey) => {
  // 如果已经存在，则不进行操作
  if (existsSync(`/usr/local/bin/${toolKey}`)) {
    console.log(`${toolKey} already exists`);
    return;
  }

  const toolName = tools.bin[toolKey];
  // 添加执行权限
  _shell(`chmod +x ./src/${toolName}.js`);

  // 创建软链接
  const result = _shell(`ln -s ${__dirname}/src/${toolName}.js /usr/local/bin/${toolKey}`);
  console.log(result.toString());
}

const setupZshrc = (tookKey) => {
  const toolName = tools.zshrc[tookKey];

  const result = _shell(`sh ./src/${toolName}.sh`);
  console.log(result.toString());
}

Object.keys(tools).forEach(key => {
  const tool = tools[key];
  if (key === 'bin') {
    Object.keys(tool).forEach(setupBin);
  } else if (key === 'zshrc') {
    Object.keys(tool).forEach(setupZshrc);
  }
})


