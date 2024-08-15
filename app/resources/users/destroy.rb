class Users::Destroy
  attr_accessor :id

  def initialize(id)
    @id = id
  end

  def execute
    user = User.find(id)
    raise CustomException.new('Impossível deletar um usuário vinculado a um cartão com despesas vinculadas.') if user.try(:card).try(:statements).try(:present?)

    user.destroy
  end
end