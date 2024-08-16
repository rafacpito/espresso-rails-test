# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Categories::Create do
  let(:admin) { create(:user) }
  let(:params) do
    {
      name: 'teste'
    }
  end

  describe '#initialize' do
    let(:instance) { described_class.new(params, admin) }

    it 'params to be instancied' do
      expect(instance.params).to eq(params)
    end

    it 'current_user to be instancied' do
      expect(instance.current_user).to eq(admin)
    end
  end

  describe '#execute' do
    context 'when params are valids' do
      let(:response) { described_class.new(params, admin).execute }

      it 'returns category object' do
        expect(response.class).to eq(Category)
      end

      it 'object persisted' do
        expect(response).to be_persisted
      end

      it 'has a company associated to category' do
        expect(response.company).to be_present
      end
    end

    context 'when params are invalids' do
      let(:invalid_params) do
        {
          name: nil
        }
      end
      let(:response) { described_class.new(invalid_params, admin).execute }

      it 'raises ActiveRecord::RecordInvalid exception' do
        expect { response }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end
  end
end
