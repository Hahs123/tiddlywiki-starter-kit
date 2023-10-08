<center>
    <img src="https://cdn.jsdelivr.net/gh/oeyoews/neotw@main/img/snapshot02.png" alt="neotw banner" title="neotw"/>
</center>

## TiddlyWiki starter kit

> 面向但不限于(neo)vim用户的 tiddlywiki starter kit

## Installation :package:

```bash
## 此方式仅作为初始体验, 生产环境建议搭配 docker compose 使用
docker run -d --name tiddlywiki -p 8080:8080 -v $(pwd)/wiki:/app/wiki oeyoews/tiddlywiki:latest tiddlywiki wiki --listen port=8080 host=0.0.0.0
```

<details>
<summary>其他安装方式</summary>

```bash
# dependcies: git node bun docker docker-compose

# method 01: use docker-compose(推荐使用, 最为方便快捷的方法)
docker-compose up -d ## docker-compose.yml 参考 [docker-compose.yml](./docker-compose.yml)

# method 03: cli: neotw-app cli 零依赖, 包仅有450kb
pnpm dlx create-neotw-app@latest

# method 04: git
git clone --depth 1 https://github.com/oeyoews/tiddlywiki-starter-kit
cd tiddlywiki-starter-kit && pnpm install  # install packages
pnpm start  # start tiddlywiki on https://localhost:8099 or use pm2 with yarn pm2:start

# method 05: 单文件版本 打开 https://neotw.oeyoewl.top/editions, 直接保存网页到本地

# method 06: systemd https://www.freedesktop.org/software/systemd/man/systemd.service.html

# method 07: pnpm pm2 start（我目前使用的方式， 因为我主要在本地使用，需要频繁更新tiddlywiki-starter-kit源码，避免每次都要构建docker mirror的步骤）

```

```bash
📂 wiki(任意目录名字)
   ├── 🐋 docker-compose.yml(关键文件)
   └── 📂 wiki(wiki目录, 名字由docker-compose.yml决定)
       ├── 📂 files
       ├── 🔒 subwiki(私密wiki)
       ├── 📂 tiddlers(wiki内容)
       └── 📦 tiddlywiki.info(系统配置信息)
```

</details>

## 如何使用最新的 tiddlywiki-starter-kit docker 镜像？

```bash
git clone --depth 1 https://github.com/oeyoews/tiddlywiki-starter-kit.git 
docker-compose build
```

## Deploy :gear:

<!-- https://vercel.com/docs/deploy-button -->
<a target="_blank" href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Foeyoews%2Ftiddlywiki-starter-kit">
    <img src="https://vercel.com/button" alt="Deploy with Vercel" />
</a>

> NOTE: vercel不会进行浅克隆，很大几率导致部署失败，此仓库提交次数过多，建议用户手动潜浅克隆仓库，手动在vercel上进行部署


![cat](https://cdn.jsdelivr.net/gh/oeyoews/neotw@main/img/cat.svg 'cat')

<!-- - [ ] 配置ci https://github.com/elgohr/Publish-Docker-Github-Action -->
