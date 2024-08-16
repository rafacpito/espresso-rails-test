module ErrorsHandler
  module Handler
    def self.included(clazz)
      clazz.class_eval do
        # Trata o erro quando o objeto não é encontrado
        rescue_from ActiveRecord::RecordNotFound, with: :json_not_found_exception
        # Trata o erro quando os parametros não são enviados corretanebte
        rescue_from ActiveRecord::RecordInvalid, with: :json_record_not_valid
        rescue_from CustomException, with: :json_custom_error
        rescue_from CanCan::AccessDenied, with: :send_to_login
      end
    end

    protected

    def json_not_found_exception(exception)
      render json: {
        error: {
          message: exception.message
        }
      }, status: :not_found
    end

    def json_record_not_valid(exception)
      render json: {
        error: {
          message: exception.message,
          errors: exception.record.try(:errors).presence || ''
        }
      }, status: :unprocessable_entity
    end

    def json_custom_error(exception)
      render json: {
        error: {
          code: 422,
          message: exception.message
        }
      }, status: :unprocessable_entity
    end

    def send_to_login
      redirect_to root_path
    end
  end
end