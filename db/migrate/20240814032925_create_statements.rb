class CreateStatements < ActiveRecord::Migration[5.2]
  def change
    create_table :statements do |t|
      t.datetime :performed_at, null: false
      t.integer :cost, null: false
      t.string :merchant, null: false
      t.string :transaction_id, null: false
      t.references :category
      t.references :card

      t.timestamps null: false
    end
  end
end
