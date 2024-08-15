class Users::Update
  attr_accessor :id, :params

  def initialize(id, params)
    @id = id
    @params = params
  end

  def execute
    user = User.find(id)
    user.update!(name: params[:name], email: params[:email])
    user
  end
end