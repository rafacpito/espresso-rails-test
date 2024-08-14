class Cards::Destroy
  attr_accessor :id

  def initialize(id)
    @id = id
  end

  def execute
    Card.find(id).destroy
  end
end