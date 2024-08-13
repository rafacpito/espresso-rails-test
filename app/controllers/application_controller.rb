# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include ErrorsHandler::Handler

  skip_before_action :verify_authenticity_token
  before_action :configure_permitted_parameters, if: :devise_controller?

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: %i[name role])
    devise_parameter_sanitizer.permit(:account_update, keys: %i[name])
  end

  def authenticate_user!
    if user_signed_in?
      super
    else
      redirect_to root_path
    end
  end

  def check_signed_in
    redirect_to expenses_list_path if signed_in?
  end
end
