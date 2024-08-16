require 'rails_helper'

RSpec.describe Users::ListEmployees do
  let(:admin) { create(:user) }
  let!(:user) { create(:user, :employee, company: admin.company) }
  let(:params) { {} }

  describe '#initialize' do
    before do
      @instance = described_class.new(admin, params)
    end

    it 'current_user to be instancied' do
      expect(@instance.current_user).to eq(admin)
    end

    it 'params to be instancied' do
      expect(@instance.params).to eq(params)
    end
  end

  describe '#execute' do
    context 'sending admin with users' do
      before do
        @response = described_class.new(admin, params).execute
      end

      it 'return list of users' do
        expect(@response).to be_present
        @response.each do |user|
          expect(user.class).to eq(User)
          expect(user.company_id).to eq(admin.company_id)
        end
      end
    end

    context 'sending another admin' do
      let(:other_admin) { create(:user) }
  
      before do
        @response = described_class.new(other_admin, params).execute
      end

      it 'return an empty array' do
        expect(@response).to be_empty
      end
    end
  end
end