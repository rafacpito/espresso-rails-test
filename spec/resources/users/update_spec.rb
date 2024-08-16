require 'rails_helper'

RSpec.describe Users::Update do
  let(:admin) { create(:user) }
  let(:user) { create(:user, :employee, company: admin.company) }
  let(:params) do
    {
      name: 'Update Test',
      email: Faker::Internet.email
    }
  end

  describe '#initialize' do
    before do
      @instance = described_class.new(user.id, params, admin)
    end

    it 'id to be instancied' do
      expect(@instance.id).to eq(user.id)
    end

    it 'params to be instancied' do
      expect(@instance.params).to eq(params)
    end
  
    it 'current_user to be instancied' do
      expect(@instance.current_user).to eq(admin)
    end
  end

  describe '#execute' do
    context 'params valids' do
      before do
        @old_user = user
        @response = described_class.new(user.id, params, admin).execute
      end

      it 'returns user object' do
        expect(@response.class).to eq(User)
      end

      it 'name updated' do
        expect(@old_user.name).not_to eq(params[:name])
        expect(@response.name).to eq(params[:name])
      end

      it 'email updated' do
        expect(@old_user.email).not_to eq(params[:email])
        expect(@response.email).to eq(params[:email])
      end
    end

    context 'email already exists' do
      let(:params_invalid) do
        {
          name: 'Update Test',
          email: admin.email
        }
      end

      before do
        @instance = described_class.new(user.id, params_invalid, admin)
      end

      it 'raises ActiveRecord::RecordInvalid exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    context 'user from another company' do
      let(:other_admin) { create(:user) }
      let(:user_other_company) { create(:user, company: other_admin.company) }

      before do
        @instance = described_class.new(user_other_company.id, params, admin)
      end

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end