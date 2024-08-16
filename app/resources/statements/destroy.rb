class Statements::Destroy
  attr_accessor :id, :current_user

  def initialize(id, current_user)
    @id = id
    @current_user = current_user
  end

  def execute
    statement = Statement.joins(card: :user).find_by!(id: id, cards: { users: { company_id: current_user.company_id } })
    raise CustomException.new("Não é possível arquivar uma despesa comprovada") if statement.status == Statement::PROVEN_STATUS

    statement.destroy
  end
end