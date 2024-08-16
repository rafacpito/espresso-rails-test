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
    before do
      @instance = described_class.new(category.id, params, admin)
    end

    it 'id to be instancied' do
      expect(@instance.id).to eq(category.id)
    end

    it 'params to be instancied' do
      expect(@instance.params).to eq(params)
    end
  
    it 'current_user to be instancied' do
      expect(@instance.current_user).to eq(admin)
    end
  end

  describe '#execute' do
    context 'name valid' do
      before do
        @old_category = category
        @response = described_class.new(category.id, params, admin).execute
      end

      it 'returns category object' do
        expect(@response.class).to eq(Category)
      end

      it 'name updated' do
        expect(@old_category.name).not_to eq(params[:name])
        expect(@response.name).to eq(params[:name])
      end
    end

    context 'name invalid' do
      let(:params_invalid) do
        {
          name: nil
        }
      end

      before do
        @instance = described_class.new(category.id, params_invalid, admin)
      end

      it 'raises ActiveRecord::RecordInvalid exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    context 'category from another company' do
      let(:other_admin) { create(:user) }
      let(:category_other_company) { create(:category, :with_statement, company: other_admin.company) }

      before do
        @instance = described_class.new(category_other_company.id, params, admin)
      end

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end