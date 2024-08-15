class Categories::Destroy
  attr_accessor :id

  def initialize(id)
    @id = id
  end

  def execute
    category = Category.find(id)
    raise CustomException.new('Impossível deletar uma categoria com despesas vinculadas.') if category.statements.present?

    category.destroy
  end
end