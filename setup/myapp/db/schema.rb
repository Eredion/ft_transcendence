# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_12_20_110141) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "channels", force: :cascade do |t|
    t.string "name", default: "default_chann", null: false
    t.bigint "user_id"
    t.string "password_digest"
    t.integer "users", default: [], array: true
    t.integer "members", default: [], array: true
    t.string "category", null: false
    t.integer "messages", default: [], array: true
    t.bigint "admins", default: [], array: true
    t.bigint "banned", default: [], array: true
    t.bigint "silenced", default: [], array: true
    t.index ["user_id"], name: "index_channels_on_user_id"
  end

  create_table "chats", force: :cascade do |t|
    t.string "name", null: false
    t.string "users", default: [], array: true
    t.integer "messages", default: [], array: true
  end

  create_table "guilds", force: :cascade do |t|
    t.string "title", null: false
    t.string "anagram", null: false
    t.string "guild_avatar"
    t.integer "score", default: 0
    t.bigint "owner_id", null: false
    t.integer "officers", default: [], array: true
    t.integer "members", default: [], array: true
    t.bigint "chat_id"
    t.bigint "war_id"
    t.boolean "inwar", default: false
    t.integer "warvictories", default: 0
    t.boolean "war_playing", default: false
    t.integer "missed_matches", default: 0
    t.string "war_history", default: [], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["chat_id"], name: "index_guilds_on_chat_id"
    t.index ["owner_id"], name: "index_guilds_on_owner_id"
    t.index ["war_id"], name: "index_guilds_on_war_id"
  end

  create_table "matches", force: :cascade do |t|
    t.string "match_type", null: false
    t.bigint "left_player_id", null: false
    t.bigint "right_player_id", null: false
    t.integer "left_score", default: 0
    t.integer "right_score", default: 0
    t.integer "winner_points"
    t.integer "loser_points"
    t.bigint "winner_id"
    t.bigint "loser_id"
    t.boolean "war", default: false
    t.boolean "finished", default: false
    t.datetime "created_at", precision: 6, null: false
    t.bigint "round_id"
    t.string "status", default: "waiting", null: false
    t.boolean "l_player_ready", default: false
    t.boolean "r_player_ready", default: false
    t.index ["left_player_id"], name: "index_matches_on_left_player_id"
    t.index ["loser_id"], name: "index_matches_on_loser_id"
    t.index ["right_player_id"], name: "index_matches_on_right_player_id"
    t.index ["round_id"], name: "index_matches_on_round_id"
    t.index ["winner_id"], name: "index_matches_on_winner_id"
  end

  create_table "matchmakings", force: :cascade do |t|
    t.bigint "user_id"
    t.integer "challenge", default: [], array: true
    t.string "match_type", default: "quick game", null: false
    t.index ["user_id"], name: "index_matchmakings_on_user_id"
  end

  create_table "messages", force: :cascade do |t|
    t.text "content", null: false
    t.bigint "chat_id"
    t.bigint "channel_id"
    t.bigint "user_id"
    t.string "author"
    t.string "dest"
    t.boolean "invisible", default: false
    t.string "channelname"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["channel_id"], name: "index_messages_on_channel_id"
    t.index ["chat_id"], name: "index_messages_on_chat_id"
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "requests", force: :cascade do |t|
    t.string "requestor_type"
    t.bigint "requestor_id"
    t.string "receiver_type"
    t.bigint "receiver_id"
    t.string "category", null: false
    t.string "status", default: "pending", null: false
    t.index ["receiver_type", "receiver_id"], name: "index_requests_on_receiver_type_and_receiver_id"
    t.index ["requestor_type", "requestor_id"], name: "index_requests_on_requestor_type_and_requestor_id"
  end

  create_table "tournaments", force: :cascade do |t|
    t.string "name", default: "tournament", null: false
    t.bigint "users"
    t.string "status", default: "closed"
    t.string "history"
    t.datetime "startdate", null: false
    t.datetime "finishdate", null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "nickname", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "avatar"
    t.integer "status", default: 0, null: false
    t.bigint "guild_id"
    t.bigint "tournament_id"
    t.string "name", default: ""
    t.integer "score", default: 0
    t.integer "matches_won", default: 0
    t.integer "matches_lost", default: 0
    t.integer "friends", default: [], array: true
    t.integer "blocked", default: [], array: true
    t.boolean "admin", default: false
    t.boolean "banned", default: false
    t.string "uid"
    t.string "provider"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "intournament", default: false
    t.integer "tournament_victories", default: 0
    t.integer "tournament_defeats", default: 0
    t.string "encrypted_otp_secret"
    t.string "encrypted_otp_secret_iv"
    t.string "encrypted_otp_secret_salt"
    t.integer "consumed_timestep"
    t.boolean "otp_required_for_login", default: false
    t.boolean "otp_validated", default: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["guild_id"], name: "index_users_on_guild_id"
    t.index ["nickname"], name: "index_users_on_nickname", unique: true
    t.index ["tournament_id"], name: "index_users_on_tournament_id"
    t.index ["uid"], name: "index_users_on_uid"
  end

  create_table "wars", force: :cascade do |t|
    t.datetime "startdate", null: false
    t.datetime "enddate", null: false
    t.integer "duration", null: false
    t.integer "wartimehour", default: 0, null: false
    t.bigint "guilds", array: true
    t.boolean "type_ranked", default: false
    t.boolean "type_tournament", default: false
    t.integer "bet", default: 0
    t.integer "missed_matches", default: 5
    t.integer "answer_time", default: 120
    t.string "status", default: "request_sent", null: false
    t.string "from", null: false
    t.string "to", null: false
  end

  add_foreign_key "channels", "users"
  add_foreign_key "matchmakings", "users"
  add_foreign_key "messages", "channels"
  add_foreign_key "messages", "chats"
end
