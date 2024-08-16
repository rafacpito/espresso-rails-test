# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Attachment do
  context 'with validations' do
    it { is_expected.to validate_presence_of(:file) }
  end

  context 'with associations' do
    it { is_expected.to belong_to(:statement) }
  end
end
