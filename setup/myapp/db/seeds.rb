# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.create(nickname: 'marvin', email: 'marvin@marvin.com')
User.create(nickname: 'stouf', email: 'pabgonza@marvin.com')
User.create(nickname: 'apita-da', email: 'apita@marvin.com')
User.create(nickname: 'migferna', email: 'migferna@marvin.com')
User.create(nickname: 'marvina', email: 'marvina@marvin.com')
User.create(nickname: 'marvino', email: 'marvino@marvin.com')
User.create(nickname: 'marvinu', email: 'marvinu@marvin.com')
User.create(nickname: 'marvinx', email: 'marvinx@marvin.com')
User.create(nickname: 'marvinillo', email: 'marvinillo@marvin.com')
User.create(nickname: 'marvinete', email: 'marvinete@marvin.com')
User.create(nickname: 'marvinette', email: 'marvinette@marvin.com')
User.create(nickname: 'ledesma', email: 'xxxxgmail@marvin.com')
User.create(nickname: 'santana', email: 'blacked@marvin.com')
User.create(nickname: 'castela', email: 'castela@marvin.com')
User.create(nickname: 'luismicrack', email: 'luismicrack@marvin.com')

Chat.create("name": 'default-chat')
Message.create(content: "Hola!", chat_id: 1, user_id: 1)