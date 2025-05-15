/**
 * setup.js
 */
const { existsSync, mkdirSync, appendFileSync, writeFileSync, readFileSync } = require('fs');
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');

const execSyncOptions = {
  shell: true,
  encoding: 'utf-8',
}

const _shell = (command) => {
  const result = execSync(command, execSyncOptions);
  return result;
}

const isWindows = process.platform === 'win32';

// Windows 上使用用户目录下的 bin 文件夹
const getBinPath = () => {
  if (isWindows) {
    const userBinPath = path.join(os.homedir(), 'bin');
    if (!existsSync(userBinPath)) {
      mkdirSync(userBinPath);
    }
    return userBinPath;
  }
  return '/usr/local/bin';
}

const tools = {
  // Windows: ~/bin, Unix: /usr/local/bin
  'bin': {
    'gpc': 'git-push-current-branch',
    'pnv': 'project-node-version',
  },
  // Windows: 添加到 PATH，Unix: 添加到 ~/.zshrc
  'shell': {
    'upnv': 'use-project-node-version',
  },
}

const setupBin = (toolKey) => {
  const binPath = getBinPath();
  const toolPath = path.join(binPath, toolKey + (isWindows ? '.cmd' : ''));

  // 如果已经存在，则不进行操作
  if (existsSync(toolPath)) {
    console.log(`${toolKey} already exists`);
    return;
  }

  const toolName = tools.bin[toolKey];
  const sourcePath = path.join(__dirname, 'src', `${toolName}.js`);

  if (isWindows) {
    // Windows 下创建 .cmd 文件
    const cmdContent = `@echo off\nnode "${sourcePath}" %*`;
    writeFileSync(toolPath, cmdContent);
    console.log(`Created ${toolPath}`);
  } else {
    // Unix 系统创建软链接
    _shell(`chmod +x ${sourcePath}`);
    _shell(`ln -s ${sourcePath} ${toolPath}`);
  }
}

const setupShell = (toolKey) => {
  const toolName = tools.shell[toolKey];

  if (isWindows) {
    try {
      // 获取 PowerShell 配置文件路径
      let profilePath = _shell('echo $PROFILE').toString().trim();
      
      // 如果配置文件不存在，创建所需的目录
      const profileDir = path.dirname(profilePath);
      if (!existsSync(profileDir)) {
        mkdirSync(profileDir, { recursive: true });
      }
      
      // 创建函数定义内容
      const functionContent = `
# 添加 ${toolKey} 命令支持
function Use-ProjectNodeVersion {
    $version = pnv
    if ($LASTEXITCODE -eq 0) {
        nvm use $version
    }
}

Set-Alias -Name ${toolKey} -Value Use-ProjectNodeVersion
`;
      
      // 如果配置文件不存在，创建它
      if (!existsSync(profilePath)) {
        writeFileSync(profilePath, functionContent, 'utf-8');
        console.log(`成功：已创建 PowerShell 配置文件并添加 ${toolKey} 命令`);
      } else {
        // 检查配置文件中是否已经包含了这个命令
        const profileContent = readFileSync(profilePath, 'utf-8');
        if (!profileContent.includes(`Set-Alias -Name ${toolKey}`)) {
          // 添加函数到 PowerShell 配置文件
          appendFileSync(profilePath, functionContent);
          console.log(`成功：已将 ${toolKey} 命令添加到 PowerShell 配置中`);
        } else {
          console.log(`${toolKey} 命令已经在 PowerShell 配置中`);
        }
      }
      
      console.log('提示：');
      console.log('1. 请重新打开 PowerShell 窗口来使用新命令');
      console.log('2. 如果遇到执行策略错误，请以管理员身份运行 PowerShell 并执行：');
      console.log('   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser');
      
    } catch (error) {
      console.error(`错误：无法设置 ${toolKey} 命令`);
      console.error('请手动将以下内容添加到你的 PowerShell 配置文件($PROFILE)中：');
      console.error(functionContent);
    }
  } else {
    // Unix 系统添加到 .zshrc
    _shell(`sh ./src/${toolName}.sh`);
  }
}

// 确保 bin 目录在 PATH 中的函数
const ensureBinInPath = () => {
  if (isWindows) {
    const binPath = getBinPath();
    const userPath = _shell('echo %PATH%').toString();
    
    if (!userPath.includes(binPath)) {
      try {
        _shell(`setx PATH "%PATH%;${binPath}"`);
        console.log(`成功：已将 ${binPath} 添加到系统 PATH 中`);
        console.log('提示：你需要重新打开命令行窗口才能使用新安装的工具');
      } catch (error) {
        console.error(`错误：无法将 ${binPath} 添加到 PATH 中`);
        console.error('请手动将以下路径添加到系统环境变量 PATH 中：');
        console.error(binPath);
      }
    } else {
      console.log(`${binPath} 已经在 PATH 中`);
    }
  }
}

// 安装所有工具
Object.keys(tools).forEach(key => {
  const tool = tools[key];
  if (key === 'bin') {
    Object.keys(tool).forEach(setupBin);
  } else if (key === 'shell') {
    Object.keys(tool).forEach(setupShell);
  }
});

// 确保 bin 目录在 PATH 中
ensureBinInPath();


