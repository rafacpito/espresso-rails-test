class Card < ApplicationRecord
  validates :last4, presence: true
  validates :user, uniqueness: true

  belongs_to :user
  delegate :company, to: :user
end
