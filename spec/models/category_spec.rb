require 'rails_helper'

RSpec.describe Category, type: :model do
  context 'validations' do
    it { is_expected.to validate_presence_of(:name) }
  end

  context 'associations' do
    it { should belong_to(:company) }
    it { should have_many(:statements) }
  end
end
