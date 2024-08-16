require 'rails_helper'

RSpec.describe User, type: :model do

  context 'validations' do
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:role) }
  end
 
  context 'associations' do
    it { should belong_to(:company) }
    it { should have_one(:card) }
  end

  describe '#admin?' do
    let(:user_admin) { create(:user) }
    let(:user_employee) { create(:user, :employee) }

    context 'when user is admin' do
      it 'returns true' do
        expect(user_admin.admin?).to be_truthy
      end
    end

    context 'when user is employee' do
      it 'returns false' do
        expect(user_employee.admin?).to be_falsey
      end
    end
  end
end
