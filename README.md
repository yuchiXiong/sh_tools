# Shell Tools

一些用 JS 实现的命令行小工具。

## Setup

```shell
# clone repo
git clone https://github.com/yuchiXiong/sh_tools.git

# setup command
npm run setup
```

## Tool List

| 命令 | 解释 |
| --- | --- |
| gpc | git push origin HEAD 的别名，使用当前分支执行 git push |
| pnv | 打印当前项目的 node 版本，优先从 .nvmrc 读取，如果没有 .nvmrc 则会尝试从 Dockerfile 中读取 |
| upnv | 基于 `pnv` 的结果，使用 `nvm use $(pnv)` 设置项目 Node 版本 |

