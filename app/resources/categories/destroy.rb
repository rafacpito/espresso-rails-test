class Categories::Destroy
  attr_accessor :id, :current_user

  def initialize(id, current_user)
    @id = id
    @current_user = current_user
  end

  def execute
    category = Category.find_by!(id: id, company_id: current_user.company_id)
    raise CustomException.new('Impossível deletar uma categoria com despesas vinculadas.') if category.statements.present?

    category.destroy
  end
end