# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Categories::Update do
  let(:admin) { create(:user) }
  let(:category) { create(:category, company: admin.company) }
  let(:params) do
    {
      name: 'Update Test'
    }
  end

  describe '#initialize' do
    let(:instance) { described_class.new(category.id, params, admin) }

    it 'id to be instancied' do
      expect(instance.id).to eq(category.id)
    end

    it 'params to be instancied' do
      expect(instance.params).to eq(params)
    end

    it 'current_user to be instancied' do
      expect(instance.current_user).to eq(admin)
    end
  end

  describe '#execute' do
    context 'when name valid' do
      let(:old_category) { category }
      let(:response) { described_class.new(category.id, params, admin).execute }

      it 'returns category object' do
        expect(response.class).to eq(Category)
      end

      it 'name updated' do
        expect(old_category.name).not_to eq(params[:name])
        expect(response.name).to eq(params[:name])
      end
    end

    context 'when name invalid' do
      let(:params_invalid) do
        {
          name: nil
        }
      end
      let(:response) { described_class.new(category.id, params_invalid, admin).execute }

      it 'raises ActiveRecord::RecordInvalid exception' do
        expect { response }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    context 'when category from another company' do
      let(:other_admin) { create(:user) }
      let(:category_other_company) { create(:category, :with_statement, company: other_admin.company) }
      let(:response) { described_class.new(category_other_company.id, params, admin).execute }

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { response }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
