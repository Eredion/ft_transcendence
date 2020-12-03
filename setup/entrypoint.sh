#!/bin/sh

# It is used to exit immediately if a command exits with a non-zero status.
set -e

# Remove a potentially pre-existing server.pid for Rails.
if [ -f /transcendence/tmp/pids/server.pid ]; then
  rm -f /transcendence/tmp/pids/server.pid
fi

cd /transcendence

bundle update --bundler && bundle install
yarn install
rails webpacker:install

#Database creation
rails db:drop && rails db:create && rails db:migrate && rails db:seed

#starts rails server
rails server -b 0.0.0.0
