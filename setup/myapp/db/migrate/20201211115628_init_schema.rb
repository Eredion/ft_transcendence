class InitSchema < ActiveRecord::Migration[6.0]
  def up
    # These are extensions that must be enabled in order to support this database
    enable_extension "plpgsql"
    create_table "guilds" do |t|
      t.string "title", null: false
      t.string "anagram", null: false
      t.string "guild_avatar"
      t.integer "score", default: 0
      t.references :owner, null: false
      t.integer "officers", default: [], array: true
      t.integer "members", default: [], array: true
      t.datetime "created_at", precision: 6, null: false
      t.datetime "updated_at", precision: 6, null: false
    end

    create_table "messages" do |t|
      t.text "content", null: false
      t.references :chat, index: true, optional: true
      t.references :channel, index:true, optional: true
      t.belongs_to "user"
      t.string "author"
      t.string "dest", optional:true
      t.boolean "invisible", default: false, optional:true
      t.string "channelname", optional: true
      t.datetime "created_at", precision: 6, null: false
      t.datetime "updated_at", precision: 6, null: false
    end

    create_table "users" do |t|
      t.string "email", default: "", null: false
      t.string "nickname", null: false
      t.string "password_digest"
      t.string "avatar"
      t.integer "status", default: 0, null: false # 0 -> offline 1 -> online
      t.references :guild
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

    create_table "friend_requests" do |t|
      t.integer "requestor_id", null: false
      t.integer "receiver_id", null: false
      t.string "status", default: "pending", null: false
    end

    create_table "chats" do |t|
      t.string "name", null: false, unique: true
      t.string "users", default: [], array: true
      t.integer "messages", default: [], array: true
    end

    create_table "channels" do |t|
      t.string "name", default: "default_chann", null: false, unique: true
      t.belongs_to :user
      t.string "password_digest", optional: true
      t.integer "users", default: [], array: true
      t.integer "members", default: [], array: true
      t.string "category", null: false
      t.integer "messages", default: [], array: true
      t.bigint "admins", references: :users, default: [], array: true
      t.bigint "banned", references: :users, default: [], array: true
      t.bigint "silenced", references: :users, default: [], array: true
    end

    create_table "matchmakings" do |t|
      t.belongs_to :user, foreign_key: true, unique: true
      t.string "match_type", default: "quick game", null: false
    end

    create_table "matches" do |t|
      t.string "match_type", null: false
      t.references :left_player, null: false
      t.references :right_player, null: false
      t.integer :left_score, default: 0
      t.integer :right_score, default: 0
      t.references :winner
      t.references :loser
      t.boolean :finished, default: false
      t.datetime "created_at", precision: 6, null: false
    end

    add_foreign_key :messages, :chats, column: :chat_id
    add_foreign_key :messages, :channels, column: :channel_id
    add_foreign_key :channels, :users, column: :user_id
  end

  def down
    raise ActiveRecord::IrreversibleMigration, "The initial migration is not revertable"
  end
end
