class Cards::Update
  attr_accessor :id, :params, :current_user

  def initialize(id, params, current_user)
    @id = id
    @params = params
    @current_user = current_user
  end

  def execute
    card = Card.joins(:user).find_by!(id: id, users: { company_id: current_user.company_id })
    card.update!(user: find_user!)
    card
  end

  private

  def find_user!
    User.find_by!(email: params[:user_email], role: User::EMPLOYEE_ROLE)
  end
end