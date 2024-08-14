class Attachment < ApplicationRecord
  validates :file, presence: true

  belongs_to :statements
end
