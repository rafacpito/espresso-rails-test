require "rails_helper"

RSpec.describe UserMailer, type: :mailer do
  describe "welcome_message" do
    let(:user) { create(:user) }
    let(:mail) { UserMailer.with(user: user, password: user.password).welcome_message }

    it "renders the headers" do
      expect(mail.subject).to eq('Bem vindo ao Espresso! Aqui estão suas credenciais de acesso')
      expect(mail.to).to eq([user.email])
      expect(mail.from).to eq(['couto1105@gmail.com'])
      expect(mail.attachments.present?).to be_truthy
    end

    it "renders the body" do
      expect(mail.html_part.body.raw_source).to match("É com grande satisfação que damos as boas-vindas ao Espresso.")
      expect(mail.html_part.body.raw_source).to match(user.name)
      expect(mail.html_part.body.raw_source).to match(user.email)
      expect(mail.html_part.body.raw_source).to match(BASE_URL)
      expect(mail.html_part.body.raw_source).to match(user.password)
    end
  end
end
