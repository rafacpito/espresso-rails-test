# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Card do
  context 'with validations' do
    it { is_expected.to validate_presence_of(:last4) }
  end

  context 'when should validate uniqueness of last4' do
    before do
      create(:card)
    end

    it { is_expected.to validate_uniqueness_of(:last4).case_insensitive }
  end

  context 'when should validate uniqueness of user' do
    before do
      create(:card)
    end

    it { is_expected.to validate_uniqueness_of(:user).case_insensitive }
  end

  context 'with associations' do
    it { is_expected.to belong_to(:user) }
    it { is_expected.to delegate_method(:company).to(:user) }
    it { is_expected.to have_many(:statements) }
  end
end
