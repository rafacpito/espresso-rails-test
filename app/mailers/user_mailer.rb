# frozen_string_literal: true

class UserMailer < ApplicationMailer
  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.welcome_message.subject
  #
  def welcome_message
    @user = params[:user]
    @password = params[:password]
    mail to: @user.email, subject: 'Bem vindo ao Espresso! Aqui estão suas credenciais de acesso' # rubocop:disable Rails/I18nLocaleTexts
  end
end
