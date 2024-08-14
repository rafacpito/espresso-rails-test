class Card < ApplicationRecord
  validates :last4, presence: true

  belongs_to :user
  delegate :company, to: :user
end
