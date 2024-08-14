class CreateAttachments < ActiveRecord::Migration[5.2]
  def change
    create_table :attachments do |t|
      t.json :file, null: false
      t.references :statement

      t.timestamps null: false
    end
  end
end
