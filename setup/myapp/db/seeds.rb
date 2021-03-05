# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

User.create(nickname: 'theadmin', email: 'admin@marvin.com', admin: true, score: 5, matches_won: 1, encrypted_password: "$2a$12$cy3.o43J2yid6vbkXojSAe0x2enBfAn4NcgVOQfXjdtPOV7tKF/1e", matches_lost: 0, friends: [1, 2, 3, 5])
user1 = User.create(nickname: 'marvin', email: 'marvin@marvin.com', score: 420, matches_won: 6, matches_lost: 1, friends: [2, 3, 4, 5], guild_id: 1)
user2 = User.create(nickname: 'pabgonza', email: 'pabgonza@marvin.com', score: 360, matches_won: 3, matches_lost: 4, friends: [1, 3, 4, 5], guild_id: 3)
User.create(nickname: 'amalia', email: 'apita@marvin.com', score: 130, matches_won: 4, matches_lost: 2, friends: [1, 2, 4, 5], guild_id: 2)
User.create(nickname: 'marvina', email: 'marvina@marvin.com', score: 1042, matches_won: 3, matches_lost: 1, friends: [1, 2, 3, 4], guild_id: 3)
User.create(nickname: 'marvino', email: 'marvino@marvin.com', score: 900, matches_won: 3, matches_lost: 4, friends: [7, 8], guild_id: 3)
User.create(nickname: 'marvinu', email: 'marvinu@marvin.com', score: 0, matches_won: 5, matches_lost: 6, friends: [6, 8], guild_id: 2)
User.create(nickname: 'marvinx', email: 'marvinx@marvin.com', score: 0, matches_won: 8, matches_lost: 2, friends: [6, 7])
User.create(nickname: 'marvinillo', email: 'marvinillo@marvin.com', score: 10, matches_won: 4, matches_lost: 2)
User.create(nickname: 'marvinete', email: 'marvinete@marvin.com', score: 100, matches_won: 6, matches_lost: 0, friends: [11])
User.create(nickname: 'marvinette', email: 'marvinette@marvin.com', score: 840, matches_won: 8, matches_lost: 3, friends: [10])

#Channel.create(name: "private", user_id: 1, category: "protected", password_digest:"$2a$12$ADIVd921XhaeQYfVAFsv.ey8ok7aaXlVDdXvU7nubq2/q9zvfBCRm")



Match.create(match_type: "quick game", left_player_id: 1, right_player_id: 2, left_score: 10, right_score: 5, winner_id: 1, loser_id: 2, finished: true, status: "finished", l_player_ready: true, r_player_ready: true)
Match.create(match_type: "quick game", left_player_id: 1, right_player_id: 3, left_score: 10, right_score: 7, winner_id: 1, loser_id: 3, finished: true, status: "finished", l_player_ready: true, r_player_ready: true)
Match.create(match_type: "quick game", left_player_id: 1, right_player_id: 4, left_score: 3, right_score: 10, winner_id: 4, loser_id: 1, finished: true, status: "finished", l_player_ready: true, r_player_ready: true)


guild = Guild.create(title: "Wakanda", anagram: "WKN", score: 120, owner_id: 2, officers: [], members: [],"war_history":["{\"winner\":\"Wakanda\",\"winner_victories\":2,\"winner_anagram\":\"WKND\",\"loser\":\"Atlantis\",\"loser_victories\":2,\"loser_anagram\":\"ATLN\",\"tie\":true}","{\"winner\":\"Wakanda\",\"winner_victories\":4,\"winner_anagram\":\"WKND\",\"loser\":\"Metropolis\",\"loser_victories\":2,\"loser_anagram\":\"MTR\",\"tie\":false}"])
chat = Chat.create(:name => "guild#{guild.id}")
guild.chat_id = chat.id
guild.save

guild = Guild.create(title: "Atlantis", anagram: "ATLN", score: 60, owner_id: 7, officers: [4], members: [] ,"war_history":["{\"winner\":\"Metropolis\",\"winner_victories\":5,\"winner_anagram\":\"MTR\",\"loser\":\"Atlantis\",\"loser_victories\":1,\"loser_anagram\":\"ATLN\",\"tie\":false}","{\"winner\":\"Wakanda\",\"winner_victories\":2,\"winner_anagram\":\"WKND\",\"loser\":\"Atlantis\",\"loser_victories\":2,\"loser_anagram\":\"ATLN\",\"tie\":true}"])
chat = Chat.create(:name => "guild#{guild.id}")
guild.chat_id = chat.id
guild.save

guild = Guild.create(title: "Metropolis", anagram: "MTR", score: 100, owner_id: 3, officers: [5], members: [6], "war_history":["{\"winner\":\"Metropolis\",\"winner_victories\":5,\"winner_anagram\":\"MTR\",\"loser\":\"Atlantis\",\"loser_victories\":1,\"loser_anagram\":\"ATLN\",\"tie\":false}","{\"winner\":\"Wakanda\",\"winner_victories\":4,\"winner_anagram\":\"WKND\",\"loser\":\"Metropolis\",\"loser_victories\":2,\"loser_anagram\":\"MTR\",\"tie\":false}"])
chat = Chat.create(:name => "guild#{guild.id}")
guild.chat_id = chat.id
guild.save

War.create({"id":1,"startdate":"2021-03-05T00:00:00.000+01:00","enddate":"2021-03-12T00:00:00.000+01:00","duration":7,"wartimehour":12,"guilds":[],"type_ranked":true,"type_tournament":true,"bet":0,"missed_matches":5,"answer_time":2,"status":"finished","from":"Wakanda","to":"Atlantis"})
War.create({"id":2,"startdate":"2021-03-05T00:00:00.000+01:00","enddate":"2021-03-12T00:00:00.000+01:00","duration":7,"wartimehour":12,"guilds":[],"type_ranked":true,"type_tournament":true,"bet":0,"missed_matches":5,"answer_time":2,"status":"finished","from":"Metropolis","to":"Wakanda"})
War.create({"id":3,"startdate":"2021-03-05T00:00:00.000+01:00","enddate":"2021-03-12T00:00:00.000+01:00","duration":7,"wartimehour":12,"guilds":[],"type_ranked":true,"type_tournament":true,"bet":0,"missed_matches":5,"answer_time":2,"status":"finished","from":"Atlantis","to":"Metropolis"})

Tournament.create({"id":1,"name":"Hardcore","status":"finished","startdate":"2021-03-05T11:47:00.000+01:00","finishdate":"2021-03-05T11:52:00.000+01:00","history":"[{\"nickname\":\"marvina\",\"victories\":5,\"defeats\":2,\"id\":5},{\"nickname\":\"theadmin\",\"victories\":3,\"defeats\":2,\"id\":1},{\"nickname\":\"marvin\",\"victories\":1,\"defeats\":6,\"id\":2},{\"nickname\":\"pabgonza\",\"victories\":0,\"defeats\":1,\"id\":3}]"})
Tournament.create({"id":2,"name":"Christmas","status":"finished","startdate":"2021-03-05T11:47:00.000+01:00","finishdate":"2021-03-05T11:52:00.000+01:00","history":"[{\"nickname\":\"marvina\",\"victories\":5,\"defeats\":2,\"id\":5},{\"nickname\":\"theadmin\",\"victories\":3,\"defeats\":2,\"id\":1},{\"nickname\":\"marvin\",\"victories\":1,\"defeats\":6,\"id\":2},{\"nickname\":\"pabgonza\",\"victories\":0,\"defeats\":1,\"id\":3}]"})
Tournament.create({"id":3,"name":"Telefonica","status":"finished","startdate":"2021-03-05T11:47:00.000+01:00","finishdate":"2021-03-05T11:52:00.000+01:00","history":"[{\"nickname\":\"marvina\",\"victories\":5,\"defeats\":2,\"id\":5},{\"nickname\":\"theadmin\",\"victories\":3,\"defeats\":2,\"id\":1},{\"nickname\":\"marvin\",\"victories\":1,\"defeats\":6,\"id\":2},{\"nickname\":\"pabgonza\",\"victories\":0,\"defeats\":1,\"id\":3}]"})