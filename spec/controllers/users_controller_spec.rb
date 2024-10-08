# frozen_string_literal: true

require 'rails_helper'

RSpec.describe UsersController do
  let(:admin) { create(:user) }
  let(:employee) { create(:user, :employee, company: admin.company) }
  let(:response_keys) { %w[user] }
  let(:user_keys) { %w[id email name role company] }

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
      it 'renders users#list' do
        get :list
        expect(response).to render_template :list
      end
    end
  end

  describe 'POST create' do
    let(:params) do
      {
        name: 'teste',
        email: Faker::Internet.email,
        password: Faker::Internet.password,
        role: User::ADMIN_ROLE,
        company: {
          name: 'teste empresa',
          cnpj: Faker::CNPJ.pretty
        }
      }
    end

    context 'when valid_params sending company values' do
      let(:body) { JSON.parse(response.body) }

      before do
        post :create, params: { user: params }
      end

      it 'returns created status code' do
        expect(response).to have_http_status(:created)
      end

      it 'response keys matchs body keys' do
        expect(body.keys).to match_array(response_keys)
      end

      it 'user keys to match expected user keys' do
        expect(body['user'].keys).to match_array(user_keys)
      end
    end

    context 'when valid_params sending company id' do
      let(:params) do
        {
          name: 'teste',
          email: Faker::Internet.email,
          password: Faker::Internet.password,
          role: User::EMPLOYEE_ROLE,
          company_id: admin.company_id
        }
      end
      let(:body) { JSON.parse(response.body) }

      before do
        post :create, params: { user: params }
      end

      it 'returns created status code' do
        expect(response).to have_http_status(:created)
      end

      it 'response keys matchs body keys' do
        expect(body.keys).to match_array(response_keys)
      end

      it 'user keys to match expected user keys' do
        expect(body['user'].keys).to match_array(user_keys)
      end
    end

    context 'when company_id is invalid' do
      let(:params_invalid) do
        {
          name: nil,
          email: Faker::Internet.email,
          password: Faker::Internet.password,
          role: User::EMPLOYEE_ROLE,
          company_id: 'aa'
        }
      end

      before do
        post :create, params: { user: params_invalid }
      end

      it 'returns not_found status code' do
        expect(response).to have_http_status(:not_found)
      end
    end

    context 'when name is nil' do
      let(:params_invalid) do
        {
          name: nil,
          email: Faker::Internet.email,
          password: Faker::Internet.password,
          role: User::EMPLOYEE_ROLE,
          company_id: admin.company_id
        }
      end

      before do
        post :create, params: { user: params_invalid }
      end

      it 'returns unprocessable_entity status code' do
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'DELETE destroy' do
    context 'when not signed in' do
      before { sign_out(admin) }

      it 'redirect to home(login)' do
        delete :destroy, params: { id: employee.id }
        expect(response).to redirect_to root_path
      end
    end

    context 'when signed in' do
      context 'with valid_params' do
        let(:body) { JSON.parse(response.body) }

        before do
          delete :destroy, params: { id: employee.id }
        end

        it 'returns created status code' do
          expect(response).to have_http_status(:ok)
        end

        it 'response keys matchs body keys' do
          expect(body.keys).to match_array(response_keys)
        end

        it 'user keys to match expected user keys' do
          expect(body['user'].keys).to match_array(user_keys)
        end
      end

      context 'when user id does not exist' do
        before do
          delete :destroy, params: { id: 'aa' }
        end

        it 'returns not_found status code' do
          expect(response).to have_http_status(:not_found)
        end
      end

      context 'when user has card with statement' do
        let(:employee_with_card_with_statement) do
          create(:user, :employee, :with_card_with_statement, company: admin.company)
        end

        before do
          delete :destroy, params: { id: employee_with_card_with_statement.id }
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
        put :update, params: { id: employee.id, user: { name: 'teste' } }
        expect(response).to redirect_to root_path
      end
    end

    context 'when signed in' do
      context 'with valid_params' do
        let(:body) { JSON.parse(response.body) }

        before do
          put :update, params: { id: employee.id, user: { name: 'teste', email: Faker::Internet.email } }
        end

        it 'returns created status code' do
          expect(response).to have_http_status(:ok)
        end

        it 'response keys matchs body keys' do
          expect(body.keys).to match_array(response_keys)
        end

        it 'user keys to match expected user keys' do
          expect(body['user'].keys).to match_array(user_keys)
        end
      end

      context 'when user id does not exist' do
        before do
          put :update, params: { id: 'aa', user: { name: 'teste' } }
        end

        it 'returns not_found status code' do
          expect(response).to have_http_status(:not_found)
        end
      end

      context 'when name is nil' do
        before do
          put :update, params: { id: employee.id, user: { name: nil } }
        end

        it 'returns unprocessable_entity status code' do
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end

  describe 'GET index_employees' do
    context 'when not signed in' do
      before { sign_out(admin) }

      it 'redirect to home(login)' do
        get :index_employees, params: {}
        expect(response).to redirect_to root_path
      end
    end

    context 'when signed in' do
      let(:response_list_keys) { %w[users meta] }
      let(:meta_keys) { %w[per_page current_page total_pages total_count] }
      let(:body) { JSON.parse(response.body) }

      before do
        create(:user, :employee, company: admin.company)
        get :index_employees, params: {}
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

      it 'user keys to match expected user keys' do
        expect(body['users']).to be_present
        body['users'].each do |user|
          expect(user.keys).to match_array(user_keys)
        end
      end
    end
  end
end
