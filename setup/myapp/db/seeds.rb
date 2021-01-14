# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.create(nickname: 'marvin', email: 'marvin@marvin.com', score: 42, matches_won: 6, matches_lost: 1)
User.create(nickname: 'pabgonza', email: 'pabgonza@marvin.com', score: 27, matches_won: 3, matches_lost: 4)
User.create(nickname: 'apitaasdf', email: 'apita@marvin.com', score: 32, matches_won: 4, matches_lost: 2)
User.create(nickname: 'alemania', email: 'alemania@marvin.com', score: 5, matches_won: 1, matches_lost: 0)
User.create(nickname: 'marvina', email: 'marvina@marvin.com', score: 24, matches_won: 3, matches_lost: 1)
User.create(nickname: 'marvino', email: 'marvino@marvin.com', score: 15, matches_won: 3, matches_lost: 4)
User.create(nickname: 'marvinu', email: 'marvinu@marvin.com', score: 1, matches_won: 5, matches_lost: 6)
User.create(nickname: 'marvinx', email: 'marvinx@marvin.com', score: 78, matches_won: 8, matches_lost: 2)
User.create(nickname: 'marvinillo', email: 'marvinillo@marvin.com', score: 12, matches_won: 4, matches_lost: 2)
User.create(nickname: 'marvinete', email: 'marvinete@marvin.com', score: 56, matches_won: 6, matches_lost: 0)
User.create(nickname: 'marvinette', email: 'marvinette@marvin.com', score: 64, matches_won: 8, matches_lost: 3)
User.create(nickname: 'ledesma', email: 'xxxxgmail@marvin.com', score: 46, matches_won: 5, matches_lost: 2)
User.create(nickname: 'santana', email: 'blacked@marvin.com', score: 27, matches_won: 4, matches_lost: 3)
User.create(nickname: 'castela', email: 'castela@marvin.com', score: 40, matches_won: 5, matches_lost: 2)
User.create(nickname: 'luismicrack', email: 'luismicrack@marvin.com', score: 69, matches_won: 7, matches_lost: 2)


Chat.create("name": 'default')
Message.create(content: "Haz click en un usuario para enviarle un mensaje", chat_id: 1, user_id: 1)
Chat.create("name": '1-2')
Message.create(content: "1-2", chat_id: 2, user_id: 1)
Message.create(content: "second msg!", chat_id: 2, user_id: 1)
Message.create(content: "bye!", chat_id: 2, user_id: 1)
Chat.create("name": '1-3')
Message.create(content: "1-3", chat_id: 3, user_id: 1)
Message.create(content: "second msg!", chat_id: 3, user_id: 1)
Message.create(content: "bye!", chat_id: 3, user_id: 1)

Chat.create("name": '1-16')
Message.create(content: "Probando mi nuevo chat", chat_id: 4, user_id: 1)
Message.create(content: "second msg!", chat_id: 4, user_id: 1)
Message.create(content: "bye!", chat_id: 4, user_id: 1)
Chat.create("name": '2-16')
Message.create(content: "Probando mi segundo nuevo chat", chat_id: 5, user_id: 2)
Message.create(content: "second msg!", chat_id: 5, user_id: 2)
Message.create(content: "bye!", chat_id: 5, user_id: 2)

Channel.create(name: "channel-1", owner: 1, category: "protected", password_digest: "xxxxxxxxxxxx")
Channel.create(name: "channel-2", owner: 1, category: "public", password_digest: "")
