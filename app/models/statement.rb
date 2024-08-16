# frozen_string_literal: true

class Statement < ApplicationRecord
  acts_as_paranoid

  include StatementQuery

  validates :performed_at, :cost, :merchant, :transaction_id, :status, presence: true

  PROVEN_STATUS = 'PROVEN'
  UNPROVEN_STATUS = 'UNPROVEN'

  belongs_to :card
  belongs_to :category, optional: true
  has_one :attachment, dependent: :destroy
end
