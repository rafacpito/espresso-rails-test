class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :name, :role

  belongs_to :company, serializer: CompanySerializer
end
