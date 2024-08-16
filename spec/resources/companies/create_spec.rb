require 'rails_helper'

RSpec.describe Companies::Create do
  let(:params) do
    {
      name: 'teste',
      cnpj: Faker::CNPJ.pretty
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

      it 'returns category object' do
        expect(@response.class).to eq(Company)
      end

      it 'object persisted' do
        expect(@response.persisted?).to be_truthy
      end
    end

    context 'when params are invalids' do
      let(:invalid_params) do
        {
          name: nil,
          cnpj: nil
        }
      end

      before do
        @instance = described_class.new(invalid_params)
      end

      it 'raises ActiveRecord::RecordInvalid exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    context 'CNPJ not unique' do
      let(:company) { create(:company)}
      let(:invalid_params) do
        {
          name: 'teste',
          cnpj: company.cnpj
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