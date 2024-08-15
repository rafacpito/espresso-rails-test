class UserMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.user_mailer.welcome_message.subject
  #
  def welcome_message
    @user = params[:user]
    mail to: "couto1105@gmail.com", subject: 'Bem vindo ao Espresso! Aqui estão suas credenciais de acesso'
  end
end
