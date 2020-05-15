#!/bin/sh

source ~/.nvm/nvm.sh
nvm use v10.10.0
workspace=$(cd $(dirname $0) && pwd -P)
cd $workspace

# echo $PATH;
function build() {
  npm config set registry http://npm.intra.xiaojukeji.com
  rm -rf node_modules
  npm install
  echo 'install success'
}


function make_output() {
  local output="/tmp/midwayserver/output"
  rm -rf $output
  mkdir -p $output
  (
        rm -rf "./output" &&

        cp -rf ./* $output &&

        mv $output ./ &&           # 将临时output目录 移动到workspace, 此即为我们的部署包内容

        echo -e "make output ok"
    ) || { echo -e "make output error"; exit 2; } # 填充output目录失败后, 退出码为 非0
}

# 1.进行编译
build

# 2.生成部署包output
make_output

# 编译成功
echo -e "build done"
exit 0
