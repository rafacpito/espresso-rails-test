# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Users::Create do
  let(:admin) { create(:user) }
  let(:params) do
    {
      name: 'teste',
      email: Faker::Internet.email,
      password: Faker::Internet.password,
      role: User::ADMIN_ROLE,
      company: {
        name: 'teste empresa',
        cnpj: Faker::CNPJ.pretty
      }
    }
  end

  describe '#initialize' do
    let(:instance) { described_class.new(params) }

    it 'params to be instancied' do
      expect(instance.params).to eq(params)
    end
  end

  describe '#execute' do
    context 'when params are valids sending company params' do
      let(:response) { described_class.new(params).execute }

      it 'returns user object' do
        expect(response.class).to eq(User)
      end

      it 'object persisted' do
        expect(response).to be_persisted
      end

      it 'has a company associated to user' do
        expect(response.company).to be_present
      end
    end

    context 'when params are valids sending company id' do
      let(:company) { create(:company) }
      let(:params) do
        {
          name: 'teste',
          email: Faker::Internet.email,
          password: Faker::Internet.password,
          role: User::EMPLOYEE_ROLE,
          company_id: company.id
        }
      end
      let(:response) { described_class.new(params).execute }

      it 'returns user object' do
        expect(response.class).to eq(User)
      end

      it 'object persisted' do
        expect(response).to be_persisted
      end

      it 'has a company associated to user' do
        expect(response.company.id).to eq(company.id)
      end
    end

    context 'when wrong company params' do
      let(:company) { create(:company) }
      let(:params) do
        {
          name: 'teste',
          email: Faker::Internet.email,
          password: Faker::Internet.password,
          role: User::EMPLOYEE_ROLE,
          company: {
            name: 'teste empresa',
            cnpj: company.cnpj
          }
        }
      end
      let(:response) { described_class.new(params).execute }

      it 'raises ActiveRecord::RecordInvalid exception' do
        expect { response }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    context 'when params are valids sending wrong company id' do
      let(:params) do
        {
          name: 'teste',
          email: Faker::Internet.email,
          password: Faker::Internet.password,
          role: User::EMPLOYEE_ROLE,
          company_id: 'asd'
        }
      end
      let(:response) { described_class.new(params).execute }

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { response }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'when params are invalids, but with company id right' do
      let(:company) { create(:company) }
      let(:invalid_params) do
        {
          name: nil,
          company_id: company.id
        }
      end
      let(:response) { described_class.new(invalid_params).execute }

      it 'raises ActiveRecord::RecordInvalid exception' do
        expect { response }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end
  end
end
