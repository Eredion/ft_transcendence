#! /bin/bash

rails new myapp
cd myapp
bundle update && bundle install

export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
yarn install --check-files
rails webpacker:install
rails server -p $PORT -b 0.0.0.0

