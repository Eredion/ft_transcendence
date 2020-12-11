class AddFieldToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :nick, :string
    add_column :users, :guild, :string
  end
end
