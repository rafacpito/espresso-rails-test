# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Categories::Destroy do
  let(:admin) { create(:user) }
  let(:category) { create(:category, company: admin.company) }

  describe '#initialize' do
    let(:instance) { described_class.new(category.id, admin) }

    it 'id to be instancied' do
      expect(instance.id).to eq(category.id)
    end

    it 'current_user to be instancied' do
      expect(instance.current_user).to eq(admin)
    end
  end

  describe '#execute' do
    context 'when category does not have any statements and exists' do
      let(:response) { described_class.new(category.id, admin).execute }

      before do
        response
      end

      it 'returns category object' do
        expect(response.class).to eq(Category)
      end

      it 'category not exist anymore' do
        expect(Category).not_to exist(category.id)
      end
    end

    context 'when category id does not exists' do
      let(:response) { described_class.new('asd', admin).execute }

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { response }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'when category have statements' do
      let(:category_with_statement) { create(:category, :with_statement, company: admin.company) }
      let(:response) { described_class.new(category_with_statement.id, admin).execute }

      it 'raises CustomException exception' do
        expect { response }.to raise_error(CustomException)
      end
    end

    context 'when category from another company' do
      let(:other_admin) { create(:user) }
      let(:category_other_company) { create(:category, :with_statement, company: other_admin.company) }
      let(:response) { described_class.new(category_other_company.id, admin).execute }

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { response }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
