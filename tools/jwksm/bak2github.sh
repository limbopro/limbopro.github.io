#!/bin/bash

cd /home/typecho/tools/jwksm
cp ./*.js NSFW
cp ./*.* NSFW/jwksm
cp -r bestrated NSFW/jwksm
cp -r mostwanted NSFW/jwksm
cp -r others NSFW/jwksm
rm /home/typecho/tools/jwksm/NSFW/jwksm/bak2github.sh
rm /home/typecho/tools/jwksm/NSFW/jwksm/run-daily.sh

echo -n "输入 1 确认提交GitHub，其他取消: "
read input

if [ "$input" = "1" ]; then
    cd /home/typecho/tools/jwksm/NSFW
    mkdir backup
    mv yaml.js ./backup
        mv thatJS.js ./backup
        rm /home/typecho/tools/jwksm/NSFW/jwksm/thatJS.js
rm /home/typecho/tools/jwksm/NSFW/jwksm/yaml.js

git add .
git pull
git commit -m 'jwksm'
git push
    echo "提交完成！"
else
    echo "已取消操作。"
fi


