# frozen_string_literal: true

class Company < ApplicationRecord
  validates :name, :cnpj, presence: true
  validates :cnpj, uniqueness: true, case_sensitive: false
  validate :validate_cnpj

  has_many :users, dependent: :destroy
  has_many :categories, dependent: :destroy
  has_many :cards, through: :users

  def validate_cnpj
    errors.add(:cnpj, :invalid) unless CNPJ.valid?(cnpj)
  end
end
