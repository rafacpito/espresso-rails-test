class Users::Destroy
  attr_accessor :id, :current_user

  def initialize(id, current_user)
    @id = id
    @current_user = current_user
  end

  def execute
    user = User.find_by!(id: id, company_id: current_user.company_id)
    raise CustomException.new('Impossível deletar um usuário vinculado a um cartão com despesas vinculadas.') if user.try(:card).try(:statements).try(:present?)

    user.destroy
  end
end