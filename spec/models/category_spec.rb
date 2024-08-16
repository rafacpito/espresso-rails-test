# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Category do
  context 'with validations' do
    it { is_expected.to validate_presence_of(:name) }
  end

  context 'with associations' do
    it { is_expected.to belong_to(:company) }
    it { is_expected.to have_many(:statements) }
  end
end
