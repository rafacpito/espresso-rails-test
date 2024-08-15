class Statements::Destroy
  attr_accessor :id

  def initialize(id)
    @id = id
  end

  def execute
    statement = Statement.find(id)
    raise CustomException.new("Não é possível arquivar uma despesa comprovada") if statement.status == Statement::PROVEN_STATUS

    statement.destroy
  end
end