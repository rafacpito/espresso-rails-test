class Cards::Destroy
  attr_accessor :id

  def initialize(id)
    @id = id
  end

  def execute
    card = Card.find(id)
    raise CustomException.new('Impossível deletar um cartão com despesas vinculadas.') if card.statements.present?

    card.destroy
  end
end