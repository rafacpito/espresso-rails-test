require 'rails_helper'

RSpec.describe HomeController do
  describe "GET index" do 
    context 'not signed in' do
      it "renders home#index" do 
        get :index
      end
    end

    context 'signed in' do
      let(:admin) { create(:user) }
      before { sign_in(admin) }

      it "redirect to statements list" do 
        get :index
        expect(response).to redirect_to statements_list_path
      end
    end
  end
end