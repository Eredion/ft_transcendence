class CreateMuchachos < ActiveRecord::Migration[6.0]
  def change
    create_table :muchachos do |t|
      t.string :nick
      t.integer :wins
      t.integer :defeats
      t.integer :winrate
      t.string :guild

      t.timestamps
    end
  end
end
