class Cards::Update
  attr_accessor :params

  def initialize(params)
    @params = params
  end

  def execute
    card = Card.find(params[:id])
    card.update!(user: find_user)
    card
  end

  private

  def find_user
    User.find_by!(email: params[:card][:user_email], role: 2)
  end
end