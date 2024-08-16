class Users::Update
  attr_accessor :id, :params, :current_user

  def initialize(id, params, current_user)
    @id = id
    @params = params
    @current_user = current_user
  end

  def execute
    user = User.find_by!(id: id, company_id: current_user.company_id)
    user.update!(name: params[:name], email: params[:email])
    user
  end
end