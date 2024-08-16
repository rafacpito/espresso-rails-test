require 'rails_helper'

RSpec.describe Company, type: :model do
  context 'validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:cnpj) }
  end

  context 'should validate uniqueness of cnpj' do
    let!(:company) { create(:company) }

    it { should validate_uniqueness_of(:cnpj).case_insensitive }
  end

  context 'validate_cnpj' do
    context 'when CNPJ is valid' do
      let!(:company) { create(:company) }

      it 'valid? method returns true' do
        expect(company.valid?).to be_truthy
      end
    end

    context 'when CNPJ is invalid' do
      let!(:company) { build(:company, cnpj: 'invalid') }
      
      it 'valid? method returns false' do
        expect(company.valid?).to be_falsey
      end
    end
  end

  context 'associations' do
    it { should have_many(:users) }
    it { should have_many(:categories) }
    it { should have_many(:cards).through(:users) }
  end
end
