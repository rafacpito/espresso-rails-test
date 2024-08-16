class Card < ApplicationRecord
  include CardQuery

  validates :last4, presence: true
  validates :last4, length: {minimum: 4, maximum: 4}
  validates :user, :last4, uniqueness: true, case_sensitive: false

  belongs_to :user
  delegate :company, to: :user
  has_many :statements
end
