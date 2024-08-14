class Categories::List
  attr_accessor :current_user

  def initialize(current_user)
    @current_user = current_user
  end

  def execute
    Category.where(company_id: current_user.company_id)
  end
end