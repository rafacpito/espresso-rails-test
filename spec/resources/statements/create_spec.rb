require 'rails_helper'

RSpec.describe Statements::Create do
  let(:card) { create(:card, last4: '1234') }
  let(:params) do
    {
      merchant: "Uber *UBER *TRIP",
      cost: 1790,
      created_at: "2024-07-04 12:15:52",
      last4: card.last4,
      transaction_id: "3e85a730-bb1f-451b-9a39-47c55aa054db"
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

      it 'returns statement object' do
        expect(@response.class).to eq(Statement)
      end

      it 'object persisted' do
        expect(@response.persisted?).to be_truthy
      end

      it 'has a card associated to statement' do
        expect(@response.card.id).to eq(card.id)
      end
    end

    context 'non-existent card last4' do
      let(:company) { create(:company) }
      let(:params) do
        {
          merchant: "Uber *UBER *TRIP",
          cost: 1790,
          created_at: "2024-07-04 12:15:52",
          last4: '9999',
          transaction_id: "3e85a730-bb1f-451b-9a39-47c55aa054db"
        }
      end

      before do
        @instance = described_class.new(params)
      end

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'when params are invalids' do
      let(:invalid_params) do
        {
          merchant: nil,
          cost: 1790,
          created_at: "2024-07-04 12:15:52",
          last4: card.last4,
          transaction_id: "3e85a730-bb1f-451b-9a39-47c55aa054db"
        }
      end

      before do
        @instance = described_class.new(invalid_params)
      end

      it 'raises ActiveRecord::RecordInvalid exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end
  end
end