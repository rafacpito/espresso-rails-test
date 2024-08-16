# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Statement do
  context 'with validations' do
    it { is_expected.to validate_presence_of(:performed_at) }
    it { is_expected.to validate_presence_of(:cost) }
    it { is_expected.to validate_presence_of(:merchant) }
    it { is_expected.to validate_presence_of(:transaction_id) }
    it { is_expected.to validate_presence_of(:status) }
  end

  context 'with associations' do
    it { is_expected.to belong_to(:card) }
    it { is_expected.to belong_to(:category).optional }
    it { is_expected.to have_one(:attachment) }
  end
end
