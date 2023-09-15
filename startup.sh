#!/bin/sh
set -e

# /app/wiki -> ${PWD}/wiki
if [ ! -f ./wiki/tiddlywiki.info ]; then
    cp ./tiddlywiki.info ./wiki/tiddlywiki.info
    cp ./files ./wiki/files
    echo '更新 tiddlywiki.info 文件成功'
fi

exec "$@"
