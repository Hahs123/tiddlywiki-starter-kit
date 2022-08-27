<div align="center">

<h1>NeoTw</h1>

<img src="https://img.shields.io/badge/status-ing-blueviolet.svg?style=flat-square&logo=Chakra-Ui&color=90E59A&logoColor=green" alt="status" >

</div>

<div align="center">

<img src="./images/white-vanilla.png" height=128 alt="cat(gitlab not support
preview repo svg?)">

</div>

## What's the neotw

> It's the [tw5](https://oeyoew.fun) lite

> Compare to tw5, `neotw` remove vercel deploy and related deploy, no pwa, image optimize, no mobile
> optimize, not subwiki(private notes) etc, just for local, so it's more simplify, still worth trying

## FileStruct

```bash
📁 neotw
├──📁tiddlers
│   ├──📁builit-plugins
│   └──📁config
└─ 📝tiddlywiki.info
```

## Run

```bash
make or make start # port is 8099 default
make generate # generate puglic/index.html
```

## Configuration

The [makefile](makefile) file is used as the centeral configuration for `neotw`
with this syntax:

<details>
  <summary>makefile</summary>

```makefile
# options
PACKAGE = "TiddlyWiki5"
CMD = @tiddlywiki
OUTPUTDIR = public
PORT = 8099
USERNAME = $(USER)
HOST = "0.0.0.0"

# adjust os, just test on linux
ifeq ($(shell uname),Linux)
	PLATFORM="🐧 Linux"
else
	PLATFORM="😭 Not supported"
endif

# startup tiddlywiki
start:
	@echo "Your current OS is $(PLATFORM) and 🚀 startup $(PACKAGE)"
	$(CMD) --listen port=$(PORT) anon-username=$(USERNAME)
start-to-the-world:
	@echo "👋 startup $(PACKAGE) to the world"
	$(CMD) --listen port=$(PORT) anon-username=$(USERNAME) host=$(HOST)
# generate index.html
generate2html:
	$(CMD) --output $(OUTPUTDIR) --build index
	@echo "🎉 generated index.html"

# clean public/ folder
.PHONY: clean
clean:
	-rm -rf $(OUTPUTDIR)
```

</details>

## Preview

- Demo: https://neotw.tiddlyhost.com
