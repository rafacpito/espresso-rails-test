require 'rails_helper'

RSpec.describe Categories::Destroy do
  let(:admin) { create(:user) }
  let(:category) { create(:category, company: admin.company) }

  describe '#initialize' do
    before do
      @instance = described_class.new(category.id, admin)
    end

    it 'id to be instancied' do
      expect(@instance.id).to eq(category.id)
    end

    it 'current_user to be instancied' do
      expect(@instance.current_user).to eq(admin)
    end
  end

  describe '#execute' do
    context 'category does not have any statements and exists' do
      before do
        @response = described_class.new(category.id, admin).execute
      end

      it 'returns category object' do
        expect(@response.class).to eq(Category)
      end

      it 'category not exist anymore' do
        expect(Category.exists?(category.id)).to be_falsey
      end
    end

    context 'category id does not exists' do
      before do
        @instance = described_class.new('asd', admin)
      end

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'category have statements' do
      let(:category_with_statement) { create(:category, :with_statement, company: admin.company) }

      before do
        @instance = described_class.new(category_with_statement.id, admin)
      end

      it 'raises CustomException exception' do
        expect { @instance.execute }.to raise_error(CustomException)
      end
    end

    context 'category from another company' do
      let(:other_admin) { create(:user) }
      let(:category_other_company) { create(:category, :with_statement, company: other_admin.company) }

      before do
        @instance = described_class.new(category_other_company.id, admin)
      end

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end