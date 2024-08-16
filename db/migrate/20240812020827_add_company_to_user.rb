# frozen_string_literal: true

class AddCompanyToUser < ActiveRecord::Migration[5.2]
  def change
    add_reference :users, :company
  end
end
