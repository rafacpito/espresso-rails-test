class Users::Update
  attr_accessor :params, :current_user

  def initialize(params, current_user)
    @params = params
    @current_user = current_user
  end

  def execute
    user = User.where(id: params[:id], company_id: current_user.company_id).first
    user.update!(name: params[:user][:name], email: params[:user][:email])
    user
  end
end