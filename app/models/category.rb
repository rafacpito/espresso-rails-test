# frozen_string_literal: true

class Category < ApplicationRecord
  include CategoryQuery

  validates :name, presence: true

  belongs_to :company
  has_many :statements, dependent: :destroy
end
