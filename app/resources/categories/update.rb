class Categories::Update
  attr_accessor :params, :current_user

  def initialize(params, current_user)
    @params = params
    @current_user = current_user
  end

  def execute
    category = Category.where(id: params[:id], company_id: current_user.company_id).first
    category.update!(name: params[:category][:name])
    category
  end
end