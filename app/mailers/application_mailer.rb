# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  helper(EmailHelper)

  default from: 'couto1105@gmail.com'
  layout 'mailer'
end
