.PHONY: init
init: certs certs/homeportal.key.pem public public/certs public/certs/rootCA.crt

certs:
	mkdir -p certs

certs/homeportal.key.pem:
	cd certs && mkcert -key-file homeportal.key.pem --cert-file homeportal.pem *.portal.tech portal.tech 192.168.0.2 localhost

public:
	mkdir -p public

public/certs:
	mkdir -p public/certs

public/certs/rootCA.crt:
	cp $(shell mkcert -CAROOT)/rootCA.pem public/certs/rootCA.crt