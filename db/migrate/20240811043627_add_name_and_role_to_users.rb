# frozen_string_literal: true

class AddNameAndRoleToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :name, :string, null: false, default: 'Nome'
    add_column :users, :role, :integer, null: false, default: User::EMPLOYEE_ROLE
  end
end
