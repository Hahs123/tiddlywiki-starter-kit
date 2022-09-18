# options
ENABLESTATIC = false
PACKAGE = "TiddlyWiki5"
PKGNAME = "neotw"
CMD = @tiddlywiki
NEOTWTEMP = neotw-temp
PORT = 8099
HOST = "0.0.0.0"
SERVICECMD = "systemctl"
SERVICETEMPLATEFILE = "src/neotw-template.service"
SERVICEFILE = "neotw-user.service"
SERVICETARGETFILE = "$(HOME)/.config/systemd/user/$(SERVICEFILE)"
NEOTWBIN = "$(HOME)/.local/bin/$(PKGNAME)"
neotwdir-user= "$(PWD)"
repo-plateform = gitlab
subwiki-address = https://$(repo-plateform).com/$(USER)/subwiki.git

# adjust os, just test on linux
ifeq ($(shell uname),Linux)
	PLATFORM="🐧 Linux"
else
	PLATFORM="😭 Not supported"
endif

# startup tiddlywiki
run:
	@echo "ℹ️  Your current OS is $(PLATFORM) \
		🚀 startup $(PACKAGE)"
	# $(CMD) --listen port=$(PORT) anon-username=$(USER) 2>&1 &
	$(CMD) --build listen 2>&1 &

# startup to the world
run-to-the-world:
	@echo "👋 startup $(PACKAGE) to the world"
	$(CMD) --listen port=$(PORT) anon-username=$(USERNAME) host=$(HOST)

# generate index.html(support subwiki, but not build html no include subwiki)
# note: because use make, so can't read this `tiddlywiki` cmd from current project, recommend install tiddlywiki global, likw `yarn global add tiddlywiki`
# should before build
# sh ./lib.sh
build:
	@make clean;
	@mkdir $(NEOTWTEMP)
	@cp -r tiddlers/ plugins/ tiddlywiki.info $(NEOTWTEMP)
# if error how to exit
	@rm -rf $(NEOTWTEMP)/tiddlers/subwiki \
		$(NEOTWTEMP)/tiddlers/trashbin \
	 	$(NEOTWTEMP)/tiddlers/\$$__StoryLis*.tid
	$(CMD) $(NEOTWTEMP) --build index >> /tmp/neotw.log 2>&1  # build
# $(CMD) public --build favicon >> /tmp/neotw.log 2>&1  # favicon
# $(CMD) public --output dist/ --build debug >> /tmp/neotw.log 2>&1  # build
# $(CMD) public --output dist/ --build static >> /tmp/neotw.log 2>&1  # static giscus and commpand palette widget have a error
	@cp -r src/vercel.json library/ dist/; echo -e "🎉 `ls  -sh dist/index.html`" # patch
	@make clean;

build-lib:
	@sh ./lib.sh

# view
view:
	@google-chrome-stable dist/index.html

# bpview
bpview:
	@make build; google-chrome-stable dist/index.html

install-subwiki:
	@git clone --depth 1 $(subwiki-address) tiddlers/subwiki

# install service
install:
	@echo "tiddlywiki --listen anon-username='anonymous'" > $(NEOTWBIN)
	@chmod +x ~/.local/bin/$(PKGNAME)
	@echo "🎉 Installed neotw"

# or yay tidgi directly
install-tidgi:
	@mkdir tidgi/; cp src/PKGBUILD tidgi/
	@cd tidgi; makepkg; sudo pacman -U *.zst

update-tidgi:
	@cd tidgi; rm *.zst *.deb; makepkg; sudo pacman -U *.zst

edit-config:
	@nvim tiddlywiki.info

install-service:
	@cp $(SERVICETEMPLATEFILE) $(SERVICEFILE)
	@sed -i "s#neotwdir#$(neotwdir-user)#" $(SERVICEFILE)
	@mv -i $(SERVICEFILE) $(SERVICETARGETFILE)
	@echo "🎉 $(SERVICETARGETFILE) file has installed"

# use highlight color
# maybe should start byhand firstly
reload-service:
	$(SERVICECMD) --user daemon-reload
enable:
	$(SERVICECMD) enable --user $(SERVICEFILE)
disable:
	$(SERVICECMD) disable --user $(SERVICEFILE)
status:
	$(SERVICECMD) status --user $(SERVICEFILE)
start:
	$(SERVICECMD) start --user $(SERVICEFILE)
	@echo "$(SERVICEFILE) has started, Click this address https://127.0.0.1:$(PORT) to open"
	@make status
restart:
	$(SERVICECMD) restart --user $(SERVICEFILE)
	@echo "$(SERVICEFILE) has restared, Click this address https://127.0.0.1:$(PORT) to open"
	@make status
stop:
	$(SERVICECMD) stop --user $(SERVICEFILE)
	@echo $(SERVICEFILE) has stopped
uninstall:
	rm -i $(NEOTWBIN)
	@echo "👋 $(NEOTWBIN) file has uninstalled"
	# uninstall service
uninstall-service:
	@rm -f -i $(SERVICETARGETFILE);
	@echo "👋 $(SERVICETARGETFILE) file has removed"

# clean
.PHONY: clean
clean:
	@rm -rf $(NEOTWTEMP)
