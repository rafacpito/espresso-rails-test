require 'rails_helper'

RSpec.describe Card, type: :model do
  context 'validations' do
    it { is_expected.to validate_presence_of(:last4) }
  end

  context 'should validate uniqueness of last4' do
    let!(:card) { create(:card) }

    it { should validate_uniqueness_of(:last4).case_insensitive }
  end

  context 'should validate uniqueness of user' do
    let!(:card) { create(:card) }

    it { should validate_uniqueness_of(:user).case_insensitive }
  end

  context 'associations' do
    it { should belong_to(:user) }
    it { should delegate_method(:company).to(:user) }
    it { should have_many(:statements) }
  end
end
