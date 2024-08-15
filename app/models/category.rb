class Category < ApplicationRecord
  include CategoryQuery

  validates :name, presence: true

  belongs_to :company
  has_many :statements
end
