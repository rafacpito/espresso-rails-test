class CardSerializer < ActiveModel::Serializer
  attributes :id, :last4

  belongs_to :user, serializer: UserSerializer
end
