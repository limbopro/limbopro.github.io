#!/bin/bash

# 设置备份源文件夹和目标备份目录
cd /home/typecho/tools/
SOURCE_DIR="./jwksm"
BACKUP_DIR="./bak"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${DATE}.tar.gz"

# 检查源文件夹是否存在
if [ ! -d "$SOURCE_DIR" ]; then
    echo "错误：源文件夹 $SOURCE_DIR 不存在"
    exit 1
fi

# 检查备份目录是否存在，不存在则创建
if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
fi

# 创建压缩备份
tar -zcf "${BACKUP_DIR}/${BACKUP_NAME}" "$SOURCE_DIR"

# 检查备份是否成功
if [ $? -eq 0 ]; then
    echo "备份成功：${BACKUP_DIR}/${BACKUP_NAME}"
else
    echo "备份失败"
    exit 1
fi

# 可选：删除7天前的旧备份
find "$BACKUP_DIR" -name "backup_*.tar.gz" -mtime +7 -delete