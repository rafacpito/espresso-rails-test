# frozen_string_literal: true

class Attachment < ApplicationRecord
  validates :file, presence: true

  belongs_to :statement
end
