class Statement < ApplicationRecord
  acts_as_paranoid

  include StatementQuery

  validates :performed_at, :cost, :merchant, :transaction_id, :status, presence: true

  PROVEN_STATUS = 'PROVEN'.freeze
  UNPROVEN_STATUS = 'UNPROVEN'.freeze

  belongs_to :card
  belongs_to :category, optional: true
  has_one :attachment
end
