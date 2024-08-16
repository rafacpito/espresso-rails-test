# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Statements::ListArchived do
  let(:admin) { create(:user) }
  let(:employee) { create(:user, :employee, company: admin.company) }
  let(:card) { create(:card, user: employee) }
  let(:params) { {} }

  before do
    create(:statement, card: card, deleted_at: DateTime.now)
  end

  describe '#initialize' do
    let(:instance) { described_class.new(admin, params) }

    it 'current_user to be instancied' do
      expect(instance.current_user).to eq(admin)
    end

    it 'params to be instancied' do
      expect(instance.params).to eq(params)
    end
  end

  describe '#execute' do
    context 'when sending admin with statements' do
      let(:response) { described_class.new(admin, params).execute }

      it 'return list of statements' do
        expect(response).to be_present
        response.each do |statement|
          expect(statement.class).to eq(Statement)
          expect(statement.deleted_at).to be_present
        end
      end
    end

    context 'when sending another admin' do
      let(:other_admin) { create(:user) }
      let(:response) { described_class.new(other_admin, params).execute }

      it 'return an empty array' do
        expect(response).to be_empty
      end
    end
  end
end
