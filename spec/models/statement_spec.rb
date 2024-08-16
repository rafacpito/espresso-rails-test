require 'rails_helper'

RSpec.describe Statement, type: :model do

  context 'validations' do
    it { is_expected.to validate_presence_of(:performed_at) }
    it { is_expected.to validate_presence_of(:cost) }
    it { is_expected.to validate_presence_of(:merchant) }
    it { is_expected.to validate_presence_of(:transaction_id) }
    it { is_expected.to validate_presence_of(:status) }
  end

  context 'associations' do
    it { should belong_to(:card) }
    it { should belong_to(:category).optional }
    it { should have_one(:attachment) }
  end
end
