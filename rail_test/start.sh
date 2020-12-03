#! /bin/bash

#Actualizamos los paquetes y las ultimas dependencias
cd myapp
bundle update && bundle install
export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
yarn install --check-files
rails webpacker:install

#Ejecutamos el servicio en localhost y el puerto indicado
rails server -p $PORT -b 0.0.0.0

