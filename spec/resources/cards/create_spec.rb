# frozen_string_literal: true

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
    let(:instance) { described_class.new(params) }

    it 'params to be instancied' do
      expect(instance.params).to eq(params)
    end
  end

  describe '#execute' do
    context 'when params are valids' do
      let(:response) { described_class.new(params).execute }

      it 'returns card object' do
        expect(response.class).to eq(Card)
      end

      it 'object persisted' do
        expect(response).to be_persisted
      end

      it 'has a user associated to card' do
        expect(response.user).to be_present
      end
    end

    context 'when params are invalids' do
      let(:invalid_params) do
        {
          last4: '123456',
          user_id: user.id
        }
      end
      let(:response) { described_class.new(invalid_params).execute }

      it 'raises ActiveRecord::RecordInvalid exception' do
        expect { response }.to raise_error(ActiveRecord::RecordInvalid)
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
      let(:response) { described_class.new(invalid_params).execute }

      it 'raises CustomException exception' do
        expect { response }.to raise_error(CustomException)
      end
    end
  end
end
