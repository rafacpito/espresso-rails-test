class Company < ApplicationRecord
  validates :name, :cnpj, presence: true
  validates :cnpj, uniqueness: true
  validate :validate_cnpj

  has_many :users

  def validate_cnpj
    errors.add(:cnpj, :invalid) unless CNPJ.valid?(cnpj)
  end
end
