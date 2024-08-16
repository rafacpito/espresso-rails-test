# frozen_string_literal: true

class AddStatusToStatements < ActiveRecord::Migration[5.2]
  def change
    add_column :statements, :status, :string, null: false, default: Statement::UNPROVEN_STATUS
  end
end
