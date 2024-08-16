# frozen_string_literal: true

require 'rails_helper'

RSpec.describe HomeController do
  describe 'GET index' do
    context 'when not signed in' do
      it 'renders home#index' do
        get :index
        expect(response).to render_template :index
      end
    end

    context 'when signed in' do
      let(:admin) { create(:user) }

      before { sign_in(admin) }

      it 'redirect to statements list' do
        get :index
        expect(response).to redirect_to statements_list_path
      end
    end
  end
end
