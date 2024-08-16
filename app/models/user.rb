# frozen_string_literal: true

class User < ApplicationRecord
  include UserQuery

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtBlacklist

  validates :email, :name, :role, presence: true

  ADMIN_ROLE = 1
  EMPLOYEE_ROLE = 2

  belongs_to :company
  has_one :card, dependent: :destroy

  accepts_nested_attributes_for :company

  def admin?
    role == ADMIN_ROLE
  end

  def employee?
    role == EMPLOYEE_ROLE
  end
end
