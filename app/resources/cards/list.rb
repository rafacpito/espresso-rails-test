class Cards::List
  attr_accessor :current_user

  def initialize(current_user)
    @current_user = current_user
  end

  def execute
    Card.joins(:user).where(users: {company_id: current_user.company_id})
  end
end