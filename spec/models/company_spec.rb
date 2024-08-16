# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Company do
  context 'with validations' do
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:cnpj) }
  end

  context 'when validate uniqueness of cnpj' do
    before do
      create(:company)
    end

    it { is_expected.to validate_uniqueness_of(:cnpj).case_insensitive }
  end

  context 'when validate_cnpj' do
    context 'when CNPJ is valid' do
      let(:company) { create(:company) }

      it 'valid? method returns true' do
        expect(company).to be_valid
      end
    end

    context 'when CNPJ is invalid' do
      let(:company) { build(:company, cnpj: 'invalid') }

      it 'valid? method returns false' do
        expect(company).not_to be_valid
      end
    end
  end

  context 'with associations' do
    it { is_expected.to have_many(:users) }
    it { is_expected.to have_many(:categories) }
    it { is_expected.to have_many(:cards).through(:users) }
  end
end
