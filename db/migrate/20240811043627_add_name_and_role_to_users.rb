class AddNameAndRoleToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :name, :string, null: false
    add_column :users, :role, :integer, null: false
  end
end
