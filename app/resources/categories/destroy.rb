class Categories::Destroy
  attr_accessor :id, :current_user

  def initialize(id, current_user)
    @id = id
    @current_user = current_user
  end

  def execute
    Category.where(id: id, company_id: current_user.company_id).first.destroy
  end
end