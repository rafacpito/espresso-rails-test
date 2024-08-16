# frozen_string_literal: true

require 'rails_helper'

RSpec.describe CategoriesController do
  let(:admin) { create(:user) }
  let(:category) { create(:category, company: admin.company) }
  let(:response_keys) { %w[category] }
  let(:category_keys) { %w[id name company statements] }

  before { sign_in(admin) }

  describe 'GET list' do
    context 'when not signed in' do
      before { sign_out(admin) }

      it 'redirect to home(login)' do
        get :list
        expect(response).to redirect_to root_path
      end
    end

    context 'when signed in' do
      it 'renders categories#list' do
        get :list
        expect(response).to render_template :list
      end
    end
  end

  describe 'POST create' do
    context 'when not signed in' do
      before { sign_out(admin) }

      it 'redirect to home(login)' do
        post :create, params: { category: { name: 'teste' } }
        expect(response).to redirect_to root_path
      end
    end

    context 'when signed in' do
      context 'with valid_params' do
        let(:body) { JSON.parse(response.body) }

        before do
          post :create, params: { category: { name: 'teste' } }
        end

        it 'returns created status code' do
          expect(response).to have_http_status(:created)
        end

        it 'response keys matchs body keys' do
          expect(body.keys).to match_array(response_keys)
        end

        it 'category keys to match expected category keys' do
          expect(body['category'].keys).to match_array(category_keys)
        end
      end

      context 'when name is nil' do
        before do
          post :create, params: { category: { name: nil } }
        end

        it 'returns unprocessable_entity status code' do
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end

  describe 'DELETE destroy' do
    context 'when not signed in' do
      before { sign_out(admin) }

      it 'redirect to home(login)' do
        delete :destroy, params: { id: category.id }
        expect(response).to redirect_to root_path
      end
    end

    context 'when signed in' do
      context 'with valid_params' do
        let(:body) { JSON.parse(response.body) }

        before do
          delete :destroy, params: { id: category.id }
        end

        it 'returns created status code' do
          expect(response).to have_http_status(:ok)
        end

        it 'response keys matchs body keys' do
          expect(body.keys).to match_array(response_keys)
        end

        it 'category keys to match expected category keys' do
          expect(body['category'].keys).to match_array(category_keys)
        end
      end

      context 'when category is does not exist' do
        before do
          delete :destroy, params: { id: 'aa' }
        end

        it 'returns not_found status code' do
          expect(response).to have_http_status(:not_found)
        end
      end

      context 'when category has statement' do
        let(:category_with_statement) { create(:category, :with_statement, company: admin.company) }

        before do
          delete :destroy, params: { id: category_with_statement.id }
        end

        it 'returns unprocessable_entity status code' do
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end

  describe 'PUT update' do
    context 'when not signed in' do
      before { sign_out(admin) }

      it 'redirect to home(login)' do
        put :update, params: { id: category.id, category: { name: 'teste' } }
        expect(response).to redirect_to root_path
      end
    end

    context 'when signed in' do
      context 'with valid_params' do
        let(:body) { JSON.parse(response.body) }

        before do
          put :update, params: { id: category.id, category: { name: 'teste' } }
        end

        it 'returns created status code' do
          expect(response).to have_http_status(:ok)
        end

        it 'response keys matchs body keys' do
          expect(body.keys).to match_array(response_keys)
        end

        it 'category keys to match expected category keys' do
          expect(body['category'].keys).to match_array(category_keys)
        end
      end

      context 'when category is does not exist' do
        before do
          put :update, params: { id: 'aa', category: { name: 'teste' } }
        end

        it 'returns not_found status code' do
          expect(response).to have_http_status(:not_found)
        end
      end

      context 'when name is nil' do
        before do
          put :update, params: { id: category.id, category: { name: nil } }
        end

        it 'returns unprocessable_entity status code' do
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end

  describe 'GET index' do
    context 'when not signed in' do
      before { sign_out(admin) }

      it 'redirect to home(login)' do
        get :index, params: {}
        expect(response).to redirect_to root_path
      end
    end

    context 'when signed in' do
      let(:response_list_keys) { %w[categories meta] }
      let(:meta_keys) { %w[per_page current_page total_pages total_count] }
      let(:body) { JSON.parse(response.body) }

      before do
        create(:category, company: admin.company)
        get :index, params: {}
      end

      it 'returns created status code' do
        expect(response).to have_http_status(:ok)
      end

      it 'response keys matchs body keys' do
        expect(body.keys).to match_array(response_list_keys)
      end

      it 'match with meta keys' do
        expect(body['meta'].keys).to match_array(meta_keys)
      end

      it 'category keys to match expected category keys' do
        expect(body['categories']).to be_present
        body['categories'].each do |category|
          expect(category.keys).to match_array(category_keys)
        end
      end
    end
  end
end
