class Card < ApplicationRecord
  include CardQuery

  validates :last4, presence: true
  validates :user, :last4, uniqueness: true

  belongs_to :user
  delegate :company, to: :user
  has_many :statements
end
