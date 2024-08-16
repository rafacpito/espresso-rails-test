class Cards::Create
  attr_accessor :params

  def initialize(params)
    @params = params
  end

  def execute
    user = User.find(params[:user_id])
    raise CustomException.new('Cartão não pode ser vinculado a conta administradora!') if user.role == User::ADMIN_ROLE

    Card.create!(mount_params(user))
  end

  private

  def mount_params(user)
    {
      last4: params[:last4],
      user: user
    }
  end
end