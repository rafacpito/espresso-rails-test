# frozen_string_literal: true

require 'rails_helper'

RSpec.describe User do
  context 'with validations' do
    it { is_expected.to validate_presence_of(:email) }
    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_presence_of(:role) }
  end

  context 'with associations' do
    it { is_expected.to belong_to(:company) }
    it { is_expected.to have_one(:card) }
  end

  describe '#admin?' do
    let(:user_admin) { create(:user) }
    let(:user_employee) { create(:user, :employee) }

    context 'when user is admin' do
      it 'returns true' do
        expect(user_admin).to be_admin
      end
    end

    context 'when user is employee' do
      it 'returns false' do
        expect(user_employee).not_to be_admin
      end
    end
  end
end
