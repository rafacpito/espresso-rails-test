class Statement < ApplicationRecord
  validates :performed_at, :cost, :merchant, :transaction_id, presence: true

  belongs_to :card
  belongs_to :category
  has_one :attachment
end
