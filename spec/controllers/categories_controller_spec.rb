require 'rails_helper'

RSpec.describe CategoriesController do
  let(:admin) { create(:user) }
  let(:category) { create(:category, company: admin.company) }
  let(:response_keys) { %w[category] }
  let(:category_keys) { %w[id name company statements] }

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
      it "renders categories#list" do 
        get :list
        expect(response).to render_template :list
      end
    end
  end

  describe 'POST create' do
    context 'not signed in' do
      before { sign_out(admin) }

      it "redirect to home(login)" do 
        post :create, params: { category: { name: 'teste' } }
        expect(response).to redirect_to root_path
      end
    end

    context 'signed in' do
      context 'valid_params' do
        before do
          post :create, params: { category: { name: 'teste' } }
          @body = JSON.parse(response.body)
        end

        it 'returns created status code' do
          expect(response).to have_http_status(:created)
        end

        it 'response keys matchs body keys' do
          expect(@body.keys).to contain_exactly(*response_keys)
        end

        it 'category keys to match expected category keys' do
          expect(@body['category'].keys).to contain_exactly(*category_keys)
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
    context 'not signed in' do
      before { sign_out(admin) }

      it "redirect to home(login)" do 
        delete :destroy, params: { id: category.id }
        expect(response).to redirect_to root_path
      end
    end

    context 'signed in' do
      context 'valid_params' do
        before do
          delete :destroy, params: { id: category.id }
          @body = JSON.parse(response.body)
        end

        it 'returns created status code' do
          expect(response).to have_http_status(:ok)
        end

        it 'response keys matchs body keys' do
          expect(@body.keys).to contain_exactly(*response_keys)
        end

        it 'category keys to match expected category keys' do
          expect(@body['category'].keys).to contain_exactly(*category_keys)
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
    context 'not signed in' do
      before { sign_out(admin) }

      it "redirect to home(login)" do 
        put :update, params: { id: category.id, category: { name: 'teste' } }
        expect(response).to redirect_to root_path
      end
    end

    context 'signed in' do
      context 'valid_params' do
        before do
          put :update, params: { id: category.id, category: { name: 'teste' } }
          @body = JSON.parse(response.body)
        end

        it 'returns created status code' do
          expect(response).to have_http_status(:ok)
        end

        it 'response keys matchs body keys' do
          expect(@body.keys).to contain_exactly(*response_keys)
        end

        it 'category keys to match expected category keys' do
          expect(@body['category'].keys).to contain_exactly(*category_keys)
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
    context 'not signed in' do
      before { sign_out(admin) }

      it "redirect to home(login)" do 
        get :index, params: {}
        expect(response).to redirect_to root_path
      end
    end

    context 'signed in' do
      let(:response_list_keys) { %w[categories meta] }
      let(:meta_keys) { %w[per_page current_page total_pages total_count] }
      let!(:category) { create(:category, company: admin.company) }

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

      it 'category keys to match expected category keys' do
        expect(@body['categories']).to be_present
        @body['categories'].each do |category|
          expect(category.keys).to contain_exactly(*category_keys)
        end
      end
    end
  end
end