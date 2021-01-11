class InitSchema < ActiveRecord::Migration[6.0]
  def up
    # These are extensions that must be enabled in order to support this database
    enable_extension "plpgsql"
    create_table "guilds" do |t|
      t.string "title"
      t.integer "score"
      t.integer "owner"
      t.integer "officers", default: [], array: true
      t.datetime "created_at", precision: 6, null: false
      t.datetime "updated_at", precision: 6, null: false
    end

    create_table "messages" do |t|
      t.text "content", null: false
      t.references :chat, index: true, optional: true
      t.references :channel, index:true, optional: true
      t.belongs_to "user"
      t.datetime "created_at", precision: 6, null: false
      t.datetime "updated_at", precision: 6, null: false
    end
    create_table "users" do |t|
      t.string "email", default: "", null: false
      t.string "nickname", null: false
      t.integer "guild_id"
      t.datetime "created_at", precision: 6, null: false
      t.datetime "updated_at", precision: 6, null: false
      t.string "provider"
      t.string "uid"
      t.string "password_digest"
      t.string "avatar"
      t.index ["email"], name: "index_users_on_email", unique: true
      t.index ["nickname"], name: "index_users_on_nickname", unique: true
      t.index ["provider"], name: "index_users_on_provider"
      t.index ["uid"], name: "index_users_on_uid"
    end
    
    create_table "chats" do |t|
      t.string "name", default: "default_chat", null: false, unique: true
      t.integer "users", default: [], array: true
      t.integer "messages", default: [], array: true
    end

    create_table "channels" do |t|
      t.string "name", default: "default_chann", null: false, unique: true
      t.integer "users", default: [], array: true
      t.string "password_digest", optional: true
      t.bigint "owner"
      t.string "category", null: false
      t.integer "messages", default: [], array: true
      t.bigint "admins", references: :users, default: [], array: true
      t.bigint "banned", references: :users, default: [], array: true
      t.bigint "silenced", references: :users, default: [], array: true
    end

    add_foreign_key :messages, :chats, column: :chat_id

  end

  def down
    raise ActiveRecord::IrreversibleMigration, "The initial migration is not revertable"
  end
end
