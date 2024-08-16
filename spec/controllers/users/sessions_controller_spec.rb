# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Users::SessionsController do
  let(:admin) { create(:user) }

  before { sign_in(admin) }

  describe 'POST create' do
    context 'when not signed in' do
      before { sign_out(admin) }

      it 'redirect to home(login)' do
        request.env['devise.mapping'] = Devise.mappings[:user]

        post :create
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'when signed in' do
      it 'return http status ok' do
        request.env['devise.mapping'] = Devise.mappings[:user]

        post :create

        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe 'DELETE destroy' do
    context 'when signed in' do
      it 'return http status ok' do
        request.env['devise.mapping'] = Devise.mappings[:user]

        delete :destroy

        expect(response).to have_http_status(:ok)
      end
    end
  end
end
