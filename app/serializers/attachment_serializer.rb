# frozen_string_literal: true

class AttachmentSerializer < ActiveModel::Serializer
  attributes :id, :file

  belongs_to :statement, serializer: StatementSerializer
end
