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

  create_table "friend_requests", force: :cascade do |t|
    t.integer "requestor_id", null: false
    t.integer "receiver_id", null: false
    t.string "status", default: "pending", null: false
  end

  create_table "guilds", force: :cascade do |t|
    t.string "title"
    t.integer "score"
    t.integer "owner"
    t.integer "officers", default: [], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "messages", force: :cascade do |t|
    t.text "content", null: false
    t.bigint "chat_id"
    t.bigint "channel_id"
    t.bigint "user_id"
    t.string "author"
    t.string "channelname"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["channel_id"], name: "index_messages_on_channel_id"
    t.index ["chat_id"], name: "index_messages_on_chat_id"
    t.index ["user_id"], name: "index_messages_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "nickname", null: false
    t.string "password_digest"
    t.string "avatar"
    t.integer "guild_id"
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
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["nickname"], name: "index_users_on_nickname", unique: true
    t.index ["uid"], name: "index_users_on_uid"
  end

  add_foreign_key "channels", "users"
  add_foreign_key "messages", "channels"
  add_foreign_key "messages", "chats"
end
