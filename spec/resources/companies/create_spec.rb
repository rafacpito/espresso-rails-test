# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Companies::Create do
  let(:params) do
    {
      name: 'teste',
      cnpj: Faker::CNPJ.pretty
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

      it 'returns category object' do
        expect(response.class).to eq(Company)
      end

      it 'object persisted' do
        expect(response).to be_persisted
      end
    end

    context 'when params are invalids' do
      let(:invalid_params) do
        {
          name: nil,
          cnpj: nil
        }
      end
      let(:response) { described_class.new(invalid_params).execute }

      it 'raises ActiveRecord::RecordInvalid exception' do
        expect { response }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    context 'when CNPJ not unique' do
      let(:company) { create(:company) }
      let(:invalid_params) do
        {
          name: 'teste',
          cnpj: company.cnpj
        }
      end
      let(:response) { described_class.new(invalid_params).execute }

      it 'raises ActiveRecord::RecordInvalid exception' do
        expect { response }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end
  end
end
