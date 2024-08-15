class AddDeletedAtToStatements < ActiveRecord::Migration[5.2]
  def change
    add_column :statements, :deleted_at, :datetime
    add_index :statements, :deleted_at
  end
end
