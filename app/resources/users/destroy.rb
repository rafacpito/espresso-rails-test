class Users::Destroy
  attr_accessor :id

  def initialize(id)
    @id = id
  end

  def execute
    User.find(id).destroy
  end
end