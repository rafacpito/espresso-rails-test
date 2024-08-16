# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Cards::Destroy do
  let(:admin) { create(:user) }
  let(:employee) { create(:user, :employee, company: admin.company) }
  let(:card) { create(:card, user: employee) }

  describe '#initialize' do
    let(:instance) { described_class.new(card.id, admin) }

    it 'id to be instancied' do
      expect(instance.id).to eq(card.id)
    end

    it 'current_user to be instancied' do
      expect(instance.current_user).to eq(admin)
    end
  end

  describe '#execute' do
    context 'when card does not have any statements and exists' do
      let(:response) { described_class.new(card.id, admin).execute }

      before do
        response
      end

      it 'returns card object' do
        expect(response.class).to eq(Card)
      end

      it 'card not exist anymore' do
        expect(Card).not_to exist(card.id)
      end
    end

    context 'when card id does not exists' do
      let(:response) { described_class.new('asd', admin).execute }

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { response }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'when card have statements' do
      let(:card_with_statement) { create(:card, :with_statement, user: employee) }
      let(:response) { described_class.new(card_with_statement.id, admin).execute }

      it 'raises CustomException exception' do
        expect { response }.to raise_error(CustomException)
      end
    end

    context 'when card from another company' do
      let(:other_admin) { create(:user) }
      let(:other_employee) { create(:user, :employee, company: other_admin.company) }
      let(:card_other_company) { create(:card, :with_statement, user: other_employee) }
      let(:response) { described_class.new(card_other_company.id, admin).execute }

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { response }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
