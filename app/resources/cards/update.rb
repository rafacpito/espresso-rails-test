class Cards::Update
  attr_accessor :id, :params

  def initialize(id, params)
    @id = id
    @params = params
  end

  def execute
    card = Card.find(id)
    card.update!(user: find_user)
    card
  end

  private

  def find_user
    User.find_by!(email: params[:user_email], role: 2)
  end
end