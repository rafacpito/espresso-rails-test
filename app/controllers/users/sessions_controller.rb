class Users::SessionsController < Devise::SessionsController
  respond_to :json
  
  private
  
  def respond_with(current_user, _opts = {})
    render json: {
      status: { 
        code: 200,
        message: 'Logado com sucesso.',
        data: { user: UserSerializer.new(current_user).serializable_hash[:data][:attributes] }
      }
    }, status: :ok
  end

  def respond_to_on_destroy    
    if current_user
      render json: {
        status: 200,
        message: 'Deslogado com sucesso.'
      }, status: :ok
    else
      render json: {
        status: 401,
        message: "Sem sessão ativa."
      }, status: :unauthorized
    end
  end
end
