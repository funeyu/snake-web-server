#!/bin/bash

# source ~/.nvm/nvm.sh
# nvm use v10.10.0
source ~/.bashrc
export PATH=/usr/local/bin:$PATH

export NODE_ENV="production" # 设置环境变量

declare -r VERSION=`date "+%Y%m%d%H%M%S"`

WORKER_DIR=$(cd $(dirname $0) && pwd -P)  # 当前目录

WORKER_NAME=`basename ${WORKER_DIR}`

LOGS_DIR=/home/xiaoju/data1/midwayserver/logs

function create_dir() { # 创建目录
  [ ! -d $LOGS_DIR ] && mkdir -p $LOGS_DIR &>/dev/null  # 创建log目录
}

function start() {
  create_dir
  local logfile=${LOGS_DIR}/stdout-${WORKER_NAME}.log
  [ -f $logfile ] && mv $logfile ${logfile}_${VERSION}.log
  npm start >> ${logfile} 2>&1
  s=$?
  echo ${s}
  if [ ${s} -ne 0 ];then
    echo "${WORKER_NAME} start failed, please check"
    exit 1
  fi
  echo "${WORKER_NAME} start ok, pid=$!"
  exit 0
}


function stop() {
  local logfile=${LOGS_DIR}/stdout-${WORKER_NAME}.log
  [ -f $logfile ] && mv $logfile ${logfile}_${VERSION}.log
  for(( i=0;i<60;i++ ));do
    npm stop >> ${logfile} 2>&1
    s=$?
    # 停止成功
    if [ ${s} -eq 0 ]; then
      exit 0
    fi
    sleep 1
  done
  echo "stop timeout(60s)"
  exit 1
}


function execute()
{
    command=$1
    case $command in
        start)
            start $2
            ;;
        stop)
            stop
            ;;
        *)
            echo "unknown command $command"
            exit 0
            ;;
    esac
}
if [ $# -lt 1 ]; then
    echo "ERROR:usage ./control.sh start|stop "
    exit 0
fi
execute $@
