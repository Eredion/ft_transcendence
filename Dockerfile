FROM ruby:2.7.2-alpine3.12
LABEL authors="aserrano, asegovia, darodrig, pcuadrad"

RUN apk add --update --no-cache \
	binutils-gold \
	build-base \
    tree \
	curl \
	file \
	g++ \
	gcc \
	git \
	less \
	libstdc++ \
	libffi-dev \
	libc-dev \ 
	linux-headers \
	libxml2-dev \
	libxslt-dev \
	libgcrypt-dev \
	make \
	netcat-openbsd \
	openssl \
	pkgconfig \
	postgresql-dev \
	tzdata 

RUN mkdir /myapp

WORKDIR /myapp

RUN gem update --system
RUN gem install rails -v 6.0.3.4;

