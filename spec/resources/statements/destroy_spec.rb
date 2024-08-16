# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Statements::Destroy do
  let(:admin) { create(:user) }
  let(:employee) { create(:user, :employee, company: admin.company) }
  let(:card) { create(:card, user: employee) }
  let(:statement) { create(:statement, card: card) }

  describe '#initialize' do
    let(:instance) { described_class.new(statement.id, admin) }

    it 'id to be instancied' do
      expect(instance.id).to eq(statement.id)
    end

    it 'current_user to be instancied' do
      expect(instance.current_user).to eq(admin)
    end
  end

  describe '#execute' do
    context 'when statement archive and unproven' do
      let(:response) { described_class.new(statement.id, admin).execute }

      it 'returns statement object' do
        expect(response.class).to eq(Statement)
      end

      it 'statement archived' do
        expect(response.deleted_at).to be_present
      end
    end

    context 'when statement id does not exists' do
      let(:response) { described_class.new('asd', admin).execute }

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { response }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'when statement is already proven' do
      let(:statement_proven) { create(:statement, :proven, card: card) }
      let(:response) { described_class.new(statement_proven.id, admin).execute }

      it 'raises CustomException exception' do
        expect { response }.to raise_error(CustomException)
      end
    end

    context 'when statement from another company' do
      let(:other_admin) { create(:user) }
      let(:other_employee) { create(:user, company: other_admin.company) }
      let(:other_card) { create(:card, user: other_employee) }
      let(:other_statement) { create(:statement, card: other_card) }
      let(:response) { described_class.new(other_statement.id, admin).execute }

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { response }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
