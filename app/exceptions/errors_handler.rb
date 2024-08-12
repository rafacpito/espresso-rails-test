module ErrorsHandler
  module Handler
    def self.included(clazz)
      clazz.class_eval do
        # Trata o erro de quando o parametro principal nao e enviado
        rescue_from ActionController::ParameterMissing, with: :main_parameter_missing_exception
        # Trata o erro quando o objeto não é encontrado
        rescue_from ActiveRecord::RecordNotFound, with: :json_not_found_exception
        # Trata o erro quando os parametros não são enviados corretanebte
        rescue_from ActiveRecord::RecordInvalid, with: :json_record_not_valid
      end
    end

    protected

    def main_parameter_missing_exception(exception)
      render json: {
        message: exception.message
      }, status: :unprocessable_entity
    end

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
  end
end