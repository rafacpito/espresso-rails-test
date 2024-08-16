# frozen_string_literal: true

require 'rails_helper'

RSpec.describe StatementsController do
  let(:admin) { create(:user) }
  let(:employee) { create(:user, :employee, company: admin.company) }
  let(:card) { create(:card, last4: '1234', user: employee) }
  let(:statement) { create(:statement, card: card) }
  let(:response_keys) { %w[statement] }
  let(:statement_keys) { %w[id performed_at cost merchant transaction_id status user card category attachment] }

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
      it 'renders statements#list' do
        get :list
        expect(response).to render_template :list
      end
    end
  end

  describe 'POST create' do
    let(:params) do
      {
        merchant: 'Uber *UBER *TRIP',
        cost: 1790,
        created_at: '2024-07-04 12:15:52',
        last4: card.last4,
        transaction_id: '3e85a730-bb1f-451b-9a39-47c55aa054db'
      }
    end

    context 'with valid_params' do
      before do
        post :create, params: params
      end

      it 'returns ok status code' do
        expect(response).to have_http_status(:ok)
      end
    end

    context 'when last4 invalid/not exist' do
      let(:params) do
        {
          merchant: 'Uber *UBER *TRIP',
          cost: 1790,
          created_at: '2024-07-04 12:15:52',
          last4: '11111',
          transaction_id: '3e85a730-bb1f-451b-9a39-47c55aa054db'
        }
      end

      before do
        post :create, params: params
      end

      it 'returns not_found status code' do
        expect(response).to have_http_status(:not_found)
      end
    end
  end

  describe 'DELETE destroy' do
    context 'when not signed in' do
      before { sign_out(admin) }

      it 'redirect to home(login)' do
        delete :destroy, params: { id: statement.id }
        expect(response).to redirect_to root_path
      end
    end

    context 'when signed in' do
      context 'with valid_params' do
        let(:body) { JSON.parse(response.body) }

        before do
          delete :destroy, params: { id: statement.id }
        end

        it 'returns created status code' do
          expect(response).to have_http_status(:ok)
        end

        it 'response keys matchs body keys' do
          expect(body.keys).to match_array(response_keys)
        end

        it 'statement keys to match expected statement keys' do
          expect(body['statement'].keys).to match_array(statement_keys)
        end
      end

      context 'when statement id does not exist' do
        before do
          delete :destroy, params: { id: 'aa' }
        end

        it 'returns not_found status code' do
          expect(response).to have_http_status(:not_found)
        end
      end

      context 'when statement is proven' do
        let(:statement_proven) { create(:statement, :proven, card: card) }

        before do
          delete :destroy, params: { id: statement_proven.id }
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
        put :update, params: { id: statement.id, statement: { name: 'teste' } }
        expect(response).to redirect_to root_path
      end
    end

    context 'when signed in as employee' do
      let(:category) { create(:category, company: employee.company) }
      let(:params) do
        {
          category_id: category.id,
          file: ActionDispatch::Http::UploadedFile.new(
            tempfile: File.new(Rails.root.join('app/assets/images/logo.png')),
            filename: File.basename(File.new(Rails.root.join('app/assets/images/logo.png'))),
            type: 'image/png'
          )
        }
      end

      before do
        sign_out(admin)
        sign_in(employee)
      end

      context 'with valid_params' do
        let(:body) { JSON.parse(response.body) }

        before do
          allow_any_instance_of(Statements::Update).to receive(:handle_attachment).and_return(true)
          put :update, params: { id: statement.id, statement: params }
        end

        it 'returns created status code' do
          expect(response).to have_http_status(:ok)
        end

        it 'response keys matchs body keys' do
          expect(body.keys).to match_array(response_keys)
        end

        it 'statement keys to match expected statement keys' do
          expect(body['statement'].keys).to match_array(statement_keys)
        end
      end

      context 'when statement id does not exist' do
        before do
          put :update, params: { id: 'aa', statement: params }
        end

        it 'returns not_found status code' do
          expect(response).to have_http_status(:not_found)
        end
      end

      context 'when category id is from another company' do
        let(:other_category) { create(:category) }
        let(:params_invalid) do
          {
            category_id: other_category.id,
            file: ActionDispatch::Http::UploadedFile.new(
              tempfile: File.new(Rails.root.join('app/assets/images/logo.png')),
              filename: File.basename(File.new(Rails.root.join('app/assets/images/logo.png'))),
              type: 'image/png'
            )
          }
        end

        before do
          put :update, params: { id: statement.id, statement: params_invalid }
        end

        it 'returns not_found status code' do
          expect(response).to have_http_status(:not_found)
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
      let(:response_list_keys) { %w[statements meta] }
      let(:meta_keys) { %w[per_page current_page total_pages total_count] }
      let(:body) { JSON.parse(response.body) }

      before do
        create(:statement, card: card)
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

      it 'statement keys to match expected statement keys' do
        expect(body['statements']).to be_present
        body['statements'].each do |statement|
          expect(statement.keys).to match_array(statement_keys)
        end
      end
    end
  end

  describe 'GET index_archived' do
    context 'when not signed in' do
      before { sign_out(admin) }

      it 'redirect to home(login)' do
        get :index_archived, params: {}
        expect(response).to redirect_to root_path
      end
    end

    context 'when signed in' do
      let(:response_list_keys) { %w[statements meta] }
      let(:meta_keys) { %w[per_page current_page total_pages total_count] }
      let(:body) { JSON.parse(response.body) }

      before do
        create(:statement, card: card, deleted_at: DateTime.now)
        get :index_archived, params: {}
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

      it 'statement keys to match expected statement keys' do
        expect(body['statements']).to be_present
        body['statements'].each do |statement|
          expect(statement.keys).to match_array(statement_keys)
        end
      end
    end
  end
end
