class CategorySerializer < ActiveModel::Serializer
  attributes :id, :name

  belongs_to :company, serializer: CompanySerializer
  has_many :statements, serializer: StatementSerializer
end
