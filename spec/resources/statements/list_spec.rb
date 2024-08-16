require 'rails_helper'

RSpec.describe Statements::List do
  let(:admin) { create(:user) }
  let(:employee) { create(:user, :employee, company: admin.company) }
  let(:card) { create(:card, user: employee) }
  let!(:statement) { create(:statement, card: card) }
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
    context 'sending admin with statements' do
      before do
        @response = described_class.new(admin, params).execute
      end

      it 'return list of statements' do
        expect(@response).to be_present
        @response.each do |statement|
          expect(statement.class).to eq(Statement)
          expect(statement.deleted_at).to be_nil
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

    context 'sending employee with statements' do
      before do
        @response = described_class.new(employee, params).execute
      end

      it 'return list of statements' do
        expect(@response).to be_present
        @response.each do |statement|
          expect(statement.class).to eq(Statement)
          expect(statement.deleted_at).to be_nil
        end
      end
    end

    context 'sending employee without statements' do
      let(:new_employee) { create(:user, :employee, company: admin.company) }

      before do
        @response = described_class.new(new_employee, params).execute
      end

      it 'return an empty array' do
        expect(@response).to be_empty
      end
    end
  end
end