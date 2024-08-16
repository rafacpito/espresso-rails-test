require 'rails_helper'

RSpec.describe Attachment, type: :model do
  context 'validations' do
    it { is_expected.to validate_presence_of(:file) }
  end

  context 'associations' do
    it { should belong_to(:statement) }
  end
end
