# theadmin's password -> admin
# password for all other users -> 1234

User.create(nickname: 'theadmin', email: 'admin@marvin.com', admin: true, score: 5, matches_won: 1, encrypted_password: "$2a$12$cy3.o43J2yid6vbkXojSAe0x2enBfAn4NcgVOQfXjdtPOV7tKF/1e", matches_lost: 0, friends: [2, 3], guild_id: 1,)
User.create(nickname: 'marvin', email: 'marvin@marvin.com', score: 42, matches_won: 6, encrypted_password: "$2a$12$sIhkQS0Cd6UBHn.BIOoHTOeJ8C3KCqq4csE4N5H2LYJoXEwjEMpPq", matches_lost: 1, friends: [1, 3, 4], guild_id: 1)
User.create(nickname: 'pabgonza', email: 'pabgonza@marvin.com', score: 27, matches_won: 3, encrypted_password: "$2a$12$sIhkQS0Cd6UBHn.BIOoHTOeJ8C3KCqq4csE4N5H2LYJoXEwjEMpPq", matches_lost: 4, friends: [1, 2, 4], guild_id: 1)
User.create(nickname: 'ledesma', email: 'xxxxgmail@marvin.com', score: 46, matches_won: 5, encrypted_password: "$2a$12$sIhkQS0Cd6UBHn.BIOoHTOeJ8C3KCqq4csE4N5H2LYJoXEwjEMpPq", matches_lost: 2, friends: [2, 3, 5, 6], guild_id: 2)
User.create(nickname: 'santana', email: 'blacked@marvin.com', score: 27, matches_won: 4, encrypted_password: "$2a$12$sIhkQS0Cd6UBHn.BIOoHTOeJ8C3KCqq4csE4N5H2LYJoXEwjEMpPq", matches_lost: 3, friends: [4, 6, 7], guild_id: 2)
User.create(nickname: 'castela', email: 'castela@marvin.com', score: 40, matches_won: 5, encrypted_password: "$2a$12$sIhkQS0Cd6UBHn.BIOoHTOeJ8C3KCqq4csE4N5H2LYJoXEwjEMpPq", matches_lost: 2, friends: [4, 5, 7], guild_id: 2)
User.create(nickname: 'dorodrig', email: 'luismicrack@marvin.com', score: 69, matches_won: 7, encrypted_password: "$2a$12$sIhkQS0Cd6UBHn.BIOoHTOeJ8C3KCqq4csE4N5H2LYJoXEwjEMpPq", matches_lost: 2, friends: [5, 6], guild_id: 2)

ch = Channel.create(name: "canal7", user_id: 1, category: "public", admins: [8])
ch.messages.create(content: "Hola, soy Marvin, el androide paranoide", channel_id: 1, user_id: 1, author: "marvin")
ch.messages.create(content: "Me encanta ft_transcendence", channel_id: 1, user_id: 1, author: "marvin")

Channel.create(name: "canal8", user_id: 1, category: "public")
Channel.create(name: "private", user_id: 1, category: "protected", password_digest:"$2a$12$ADIVd921XhaeQYfVAFsv.ey8ok7aaXlVDdXvU7nubq2/q9zvfBCRm")

guild = Guild.create(title: "Pong Masters", anagram: "PM", score: 120, owner_id: 1, officers: [2], members: [3])
chat = Chat.create(:name => "guild#{guild.id}")
guild.chat_id = chat.id
guild.save

guild = Guild.create(title: "Crypto Pong", anagram: "CRYP", score: 60, owner_id: 4, officers: [5], members: [6, 7])
chat = Chat.create(:name => "guild#{guild.id}")
guild.chat_id = chat.id
guild.save
