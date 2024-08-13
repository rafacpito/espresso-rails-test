class Users::SessionsController < Devise::SessionsController
  respond_to :json
  
  private
  
  def respond_with(current_user, _opts = {})
    render json: {
      status: { 
        code: 200,
        message: 'Logado com sucesso.',
        data: { user: UserSerializer.new(current_user).serializable_hash }
      }
    }, status: :ok
  end

  def respond_to_on_destroy
    head :ok
  end
end
