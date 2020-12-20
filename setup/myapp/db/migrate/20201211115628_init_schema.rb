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
      t.integer "msg_id"
      t.text "content"
      t.bigint "user_id"
      t.datetime "created_at", precision: 6, null: false
      t.datetime "updated_at", precision: 6, null: false
      t.index ["user_id"], name: "index_messages_on_user_id"
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
      t.index ["email"], name: "index_users_on_email", unique: true
      t.index ["nickname"], name: "index_users_on_nickname", unique: true
      t.index ["provider"], name: "index_users_on_provider"
      t.index ["uid"], name: "index_users_on_uid"
    end
    add_foreign_key "messages", "users"
  end

  def down
    raise ActiveRecord::IrreversibleMigration, "The initial migration is not revertable"
  end
end
