require 'rails_helper'

RSpec.describe CardsController do
  let(:admin) { create(:user) }
  let(:employee) { create(:user, :employee, company: admin.company) }
  let(:card) { create(:card, user: employee) }
  let(:response_keys) { %w[card] }
  let(:card_keys) { %w[id last4 user] }

  before { sign_in(admin) }

  describe "GET list" do 
    context 'not signed in' do
      before { sign_out(admin) }
  
      it "redirect to home(login)" do 
        get :list
        expect(response).to redirect_to root_path
      end
    end

    context 'signed in' do
      it "renders cards#list" do 
        get :list
        expect(response).to render_template :list
      end
    end
  end

  describe 'POST create' do
    context 'not signed in' do
      before { sign_out(admin) }

      it "redirect to home(login)" do 
        post :create, params: { card: { user_id: employee.id, last4: '1234' } }
        expect(response).to redirect_to root_path
      end
    end

    context 'signed in' do
      context 'valid_params' do
        before do
          post :create, params: { card: { user_id: employee.id, last4: '1234' } }
          @body = JSON.parse(response.body)
        end

        it 'returns created status code' do
          expect(response).to have_http_status(:created)
        end

        it 'response keys matchs body keys' do
          expect(@body.keys).to contain_exactly(*response_keys)
        end

        it 'card keys to match expected card keys' do
          expect(@body['card'].keys).to contain_exactly(*card_keys)
        end
      end

      context 'when user_id does not exist' do
        before do
          post :create, params: { card: { user_id: 'aa', last4: '1234' } }
        end

        it 'returns not_found status code' do
          expect(response).to have_http_status(:not_found)
        end
      end

      context 'when user_id belongs to a admin' do
        before do
          post :create, params: { card: { user_id: admin.id, last4: '1234' } }
        end

        it 'returns unprocessable_entity status code' do
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end

      context 'when last4 have more than 4 digits' do
        before do
          post :create, params: { card: { user_id: employee.id, last4: '12345' } }
        end

        it 'returns unprocessable_entity status code' do
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end

  describe 'DELETE destroy' do
    context 'not signed in' do
      before { sign_out(admin) }

      it "redirect to home(login)" do 
        delete :destroy, params: { id: card.id }
        expect(response).to redirect_to root_path
      end
    end

    context 'signed in' do
      context 'valid_params' do
        before do
          delete :destroy, params: { id: card.id }
          @body = JSON.parse(response.body)
        end

        it 'returns created status code' do
          expect(response).to have_http_status(:ok)
        end

        it 'response keys matchs body keys' do
          expect(@body.keys).to contain_exactly(*response_keys)
        end

        it 'card keys to match expected card keys' do
          expect(@body['card'].keys).to contain_exactly(*card_keys)
        end
      end

      context 'when card is does not exist' do
        before do
          delete :destroy, params: { id: 'aa' }
        end

        it 'returns not_found status code' do
          expect(response).to have_http_status(:not_found)
        end
      end

      context 'when card has statement' do
        let(:card_with_statement) { create(:card, :with_statement, user: employee) }

        before do
          delete :destroy, params: { id: card_with_statement.id }
        end

        it 'returns unprocessable_entity status code' do
          expect(response).to have_http_status(:unprocessable_entity)
        end
      end
    end
  end

  describe 'PUT update' do
    let(:new_employee) { create(:user, :employee, company: admin.company) }
    context 'not signed in' do
      before { sign_out(admin) }

      it "redirect to home(login)" do 
        put :update, params: { id: card.id, card: { user_email: new_employee.email } }
        expect(response).to redirect_to root_path
      end
    end

    context 'signed in' do
      context 'valid_params' do
        before do
          put :update, params: { id: card.id, card: { user_email: new_employee.email } }
          @body = JSON.parse(response.body)
        end

        it 'returns created status code' do
          expect(response).to have_http_status(:ok)
        end

        it 'response keys matchs body keys' do
          expect(@body.keys).to contain_exactly(*response_keys)
        end

        it 'card keys to match expected card keys' do
          expect(@body['card'].keys).to contain_exactly(*card_keys)
        end
      end

      context 'when card is does not exist' do
        before do
          put :update, params: { id: 'aa', card: { user_email: new_employee.email } }
        end

        it 'returns not_found status code' do
          expect(response).to have_http_status(:not_found)
        end
      end

      context 'when user_email belongs to a admin' do
        before do
          put :update, params: { id: card.id, card: { user_email: admin.email } }
        end

        it 'returns not_found status code' do
          expect(response).to have_http_status(:not_found)
        end
      end
    end
  end

  describe 'GET index' do
    context 'not signed in' do
      before { sign_out(admin) }

      it "redirect to home(login)" do 
        get :index, params: {}
        expect(response).to redirect_to root_path
      end
    end

    context 'signed in' do
      let(:response_list_keys) { %w[cards meta] }
      let(:meta_keys) { %w[per_page current_page total_pages total_count] }
      let!(:card) { create(:card, user: employee) }

      before do
        get :index, params: {}
        @body = JSON.parse(response.body)
      end

      it 'returns created status code' do
        expect(response).to have_http_status(:ok)
      end

      it 'response keys matchs body keys' do
        expect(@body.keys).to contain_exactly(*response_list_keys)
      end

      it 'match with meta keys' do
        expect(@body['meta'].keys).to contain_exactly(*meta_keys)
      end

      it 'card keys to match expected card keys' do
        expect(@body['cards']).to be_present
        @body['cards'].each do |card|
          expect(card.keys).to contain_exactly(*card_keys)
        end
      end
    end
  end
end