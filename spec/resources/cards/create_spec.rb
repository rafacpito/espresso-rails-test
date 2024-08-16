require 'rails_helper'

RSpec.describe Cards::Create do
  let(:user) { create(:user, :employee) }
  let(:params) do
    {
      last4: '1234',
      user_id: user.id
    }
  end

  describe '#initialize' do
    before do
      @instance = described_class.new(params)
    end

    it 'params to be instancied' do
      expect(@instance.params).to eq(params)
    end
  end

  describe '#execute' do
    context 'when params are valids' do
      before do
        @response = described_class.new(params).execute
      end

      it 'returns card object' do
        expect(@response.class).to eq(Card)
      end

      it 'object persisted' do
        expect(@response.persisted?).to be_truthy
      end

      it 'has a user associated to card' do
        expect(@response.user).to be_present
      end
    end

    context 'when params are invalids' do
      let(:invalid_params) do
        {
          last4: '123456',
          user_id: user.id
        }
      end

      before do
        @instance = described_class.new(invalid_params)
      end

      it 'raises ActiveRecord::RecordInvalid exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    context 'when user id from a admin' do
      let(:admin) { create(:user) }
      let(:invalid_params) do
        {
          last4: '1234',
          user_id: admin.id
        }
      end

      before do
        @instance = described_class.new(invalid_params)
      end

      it 'raises CustomException exception' do
        expect { @instance.execute }.to raise_error(CustomException)
      end
    end
  end
end