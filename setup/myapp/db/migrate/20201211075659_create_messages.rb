class CreateMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :messages do |t|
      t.integer :msg_id
      t.text :content
      t.references :user

      t.timestamps
    end
  end
end
