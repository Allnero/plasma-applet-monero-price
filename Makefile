.PHONY: install
install:
	kpackagetool5 -t Plasma/Applet --install ./package/

.PHONY: run
run:
	plasmoidviewer --applet ./package/
