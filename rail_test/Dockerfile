FROM ruby

WORKDIR /home/app

ENV PORT 3000

EXPOSE $PORT

# Instalamos rails y sus dependencias
RUN apt update && apt upgrade -y
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN gem install rails bundler
RUN gem install rails
RUN gem install devise pg
RUN apt-get update -qq && apt-get install -y nodejs yarn 

#Las ultimas dependencias y la ejecucion del servicio están en start.sh
ENTRYPOINT [ "sh", "start.sh"]
