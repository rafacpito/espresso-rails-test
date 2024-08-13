class Users::ListEmployees
  attr_accessor :current_user

  def initialize(current_user)
    @current_user = current_user
  end

  def execute
    User.where(company_id: current_user.company_id, role: 2)
  end
end