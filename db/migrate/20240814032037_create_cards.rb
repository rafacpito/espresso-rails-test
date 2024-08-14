class CreateCards < ActiveRecord::Migration[5.2]
  def change
    create_table :cards do |t|
      t.string :last4, null: false
      t.references :user

      t.timestamps null: false
    end
  end
end
