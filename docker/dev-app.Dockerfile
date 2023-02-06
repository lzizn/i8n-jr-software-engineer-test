FROM node:16.16.0 AS app

WORKDIR /laian

ADD ./ /laian/

RUN \
	npm install

EXPOSE 4000

CMD /bin/bash
