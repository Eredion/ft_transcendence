FROM ruby

WORKDIR /home/app

ENV PORT 3000

EXPOSE $PORT

RUN apt update && apt upgrade -y
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN gem install rails bundler
RUN gem install rails
RUN gem install devise pg
RUN apt-get update -qq && apt-get install -y nodejs yarn tmux
#WORKDIR "/myapp"
#RUN bundle update && bundle install
#RUN curl -o- -L https://yarnpkg.com/install.sh | bash
#RUN export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
#RUN yarn install --check-files
COPY start.sh .
RUN chmod +x start.sh

ENTRYPOINT [ "sh", "start.sh"]
