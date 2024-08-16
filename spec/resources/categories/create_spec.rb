require 'rails_helper'

RSpec.describe Categories::Create do
  let(:admin) { create(:user) }
  let(:params) do
    {
      name: 'teste'
    }
  end

  describe '#initialize' do
    before do
      @instance = described_class.new(params, admin)
    end

    it 'params to be instancied' do
      expect(@instance.params).to eq(params)
    end

    it 'current_user to be instancied' do
      expect(@instance.current_user).to eq(admin)
    end
  end

  describe '#execute' do
    context 'when params are valids' do
      before do
        @response = described_class.new(params, admin).execute
      end

      it 'returns category object' do
        expect(@response.class).to eq(Category)
      end

      it 'object persisted' do
        expect(@response.persisted?).to be_truthy
      end

      it 'has a company associated to category' do
        expect(@response.company).to be_present
      end
    end

    context 'when params are invalids' do
      let(:invalid_params) do
        {
          name: nil
        }
      end

      before do
        @instance = described_class.new(invalid_params, admin)
      end

      it 'raises ActiveRecord::RecordInvalid exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end
  end
end