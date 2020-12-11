class CreateGuilds < ActiveRecord::Migration[6.0]
  def change
    create_table :guilds do |t|

      t.string :title
      t.integer :score
      t.integer :owner
      t.integer :officers, :array => true, :default => []

      t.timestamps
    end
  end
end
