require 'rails_helper'

RSpec.describe Cards::Destroy do
  let(:admin) { create(:user) }
  let(:employee) { create(:user, :employee, company: admin.company )}
  let(:card) { create(:card, user: employee) }

  describe '#initialize' do
    before do
      @instance = described_class.new(card.id, admin)
    end

    it 'id to be instancied' do
      expect(@instance.id).to eq(card.id)
    end

    it 'current_user to be instancied' do
      expect(@instance.current_user).to eq(admin)
    end
  end

  describe '#execute' do
    context 'card does not have any statements and exists' do
      before do
        @response = described_class.new(card.id, admin).execute
      end

      it 'returns card object' do
        expect(@response.class).to eq(Card)
      end

      it 'card not exist anymore' do
        expect(Card.exists?(card.id)).to be_falsey
      end
    end

    context 'card id does not exists' do
      before do
        @instance = described_class.new('asd', admin)
      end

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'card have statements' do
      let(:card_with_statement) { create(:card, :with_statement, user: employee) }

      before do
        @instance = described_class.new(card_with_statement.id, admin)
      end

      it 'raises CustomException exception' do
        expect { @instance.execute }.to raise_error(CustomException)
      end
    end

    context 'card from another company' do
      let(:other_admin) { create(:user) }
      let(:other_employee) { create(:user, :employee, company: other_admin.company )}
      let(:card_other_company) { create(:card, :with_statement, user: other_employee) }

      before do
        @instance = described_class.new(card_other_company.id, admin)
      end

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end