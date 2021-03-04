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
      t.references :chat, index: true, optional: true
      t.references :war, optional: true
      t.boolean :inwar, default: false #In war time
      t.integer :warvictories, default: 0
      t.boolean :war_playing, default: false #Currently someone playing a war game
      t.integer :missed_matches, default: 0  #Maches missed while war time
      t.string :war_history, array: true, default: []
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
      #t.string "password_digest", default: "", null: false
      t.string "encrypted_password", default: "", null: false
      t.string "avatar"
      t.integer "status", default: 0, null: false # 0 -> offline 1 -> online
      t.references :guild
      t.references :tournament
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
      t.index ["nickname"], name: "index_users_on_nickname", unique: true
      t.index ["uid"], name: "index_users_on_uid"
    end

    create_table "requests" do |t|
      t.references :requestor, polymorphic: true
      t.references :receiver, polymorphic: true
      t.string "category", null: false
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
      t.integer "challenge", array: true, default: []
      t.string "match_type", default: "quick game", null: false
    end

    create_table "matches" do |t|
      t.string "match_type", null: false
      t.references :left_player, null: false
      t.references :right_player, null: false
      t.integer :left_score, default: 0
      t.integer :right_score, default: 0
      t.integer :winner_points, optional: true
      t.integer :loser_points, optional: true
      t.references :winner
      t.references :loser
      t.boolean "war", optional: true, default: false #true if match counts for a war
      t.boolean :finished, default: false
      t.datetime "created_at", precision: 6, null: false
      t.references :round, optional: true
      t.string :status, default: "waiting", null: false # waiting, running, finished
      t.boolean :l_player_ready, default: false
      t.boolean :r_player_ready, default: false
    end

    create_table "tournaments" do |t|
      t.string "name", default: "tournament", null: false, unique: true
      t.bigint "users", references: :users
      t.string "status", default: "closed" #open, active, finished
      t.string "history"
      t.datetime "startdate", null: false
      t.datetime "finishdate", null: false
    end

    create_table "wars" do |t|
      t.datetime "startdate", null: false
      t.datetime "enddate", null: false
      t.integer "duration", null: false
      t.integer "wartimehour", null: false, min: 0, max: 23, default: 0
      t.bigint "guilds", references: :guilds, array: true
      t.boolean "type_ranked", default: false #Ranked counts for the war
      t.boolean "type_tournament", default: false #Tournament counts for the war
      t.integer "bet", default: 0
      t.integer "missed_matches", default: 5
      t.integer "answer_time", min: 1, max: 120, default: 120 #seconds,
      t.string :status, default: "request_sent", null: false # request_sent, accepted, active, wartime, finished
      t.string "from", null: false
      t.string "to", null: false
    end

    add_foreign_key :messages, :chats, column: :chat_id
    add_foreign_key :messages, :channels, column: :channel_id
    add_foreign_key :channels, :users, column: :user_id
  end

  def down
    raise ActiveRecord::IrreversibleMigration, "The initial migration is not revertable"
  end
end
