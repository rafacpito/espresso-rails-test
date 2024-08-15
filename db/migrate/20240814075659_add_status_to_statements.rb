class AddStatusToStatements < ActiveRecord::Migration[5.2]
  def change
    add_column :statements, :status, :string, null: false
  end
end
