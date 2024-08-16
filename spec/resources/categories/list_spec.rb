# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Categories::List do
  let(:admin) { create(:user) }
  let(:params) { {} }

  before do
    create(:category, company: admin.company)
  end

  describe '#initialize' do
    let(:instance) { described_class.new(admin, params) }

    it 'current_user to be instancied' do
      expect(instance.current_user).to eq(admin)
    end

    it 'params to be instancied' do
      expect(instance.params).to eq(params)
    end
  end

  describe '#execute' do
    context 'when sending admin with categories' do
      let(:response) { described_class.new(admin, params).execute }

      it 'return list of categories' do
        expect(response).to be_present
        response.each do |category|
          expect(category.class).to eq(Category)
          expect(category.company_id).to eq(admin.company_id)
        end
      end
    end

    context 'when sending another admin' do
      let(:other_admin) { create(:user) }
      let(:response) { described_class.new(other_admin, params).execute }

      it 'return an empty array' do
        expect(response).to be_empty
      end
    end
  end
end
