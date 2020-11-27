FROM ruby:2.6.3-alpine3.10

RUN apk add --update --no-cache \
                binutils-gold \
                build-base \
                curl \
                file \
                g++ \
                gcc \
                git \
                make \
                pkgconfig \
                postgresql-dev \
                yarn \
                nodejs \
                tzdata

WORKDIR /transcendence

RUN gem update --system
RUN gem install rails -v 6.0.3.2
RUN gem install rake
COPY ./backend/Gemfile /transcendence/Gemfile
COPY ./backend/Gemfile.lock /transcendence/Gemfile.lock
RUN gem install bundler -v "$(grep -A 1 "BUNDLED WITH" Gemfile.lock | tail -n 1)"
#RUN bundle update --bundler
#RUN gem install rails-backbone
RUN bundle install
#COPY ./backend/ /transcendence

COPY ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
EXPOSE 3000
#CMD ["rails", "server", "-b", "0.0.0.0"]
# Start the main process.
ENTRYPOINT ["sh", "/entrypoint.sh"]

