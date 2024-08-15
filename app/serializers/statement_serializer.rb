class StatementSerializer < ActiveModel::Serializer
  attributes :id, :performed_at, :cost, :merchant, :transaction_id, :status, :user

  belongs_to :card, serializer: CardSerializer
  belongs_to :category, optional: true, serializer: CategorySerializer
  has_one :attachment, optional: true, serializer: AttachmentSerializer

  def user
    UserSerializer.new(object.card.user)
  end
end
