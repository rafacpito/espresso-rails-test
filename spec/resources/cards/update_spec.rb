# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Cards::Update do
  let(:admin) { create(:user) }
  let(:employee) { create(:user, :employee, company: admin.company) }
  let(:card) { create(:card, user: employee) }
  let(:another_employee) { create(:user, :employee, company: admin.company) }
  let(:params) do
    {
      user_email: another_employee.email
    }
  end

  describe '#initialize' do
    let(:instance) { described_class.new(card.id, params, admin) }

    it 'id to be instancied' do
      expect(instance.id).to eq(card.id)
    end

    it 'params to be instancied' do
      expect(instance.params).to eq(params)
    end

    it 'current_user to be instancied' do
      expect(instance.current_user).to eq(admin)
    end
  end

  describe '#execute' do
    context 'when user email valid and user not associated to another card' do
      let(:old_card) { card }
      let(:response) { described_class.new(card.id, params, admin).execute }

      it 'returns card object' do
        expect(response.class).to eq(Card)
      end

      it 'user updated' do
        expect(old_card.user_id).not_to eq(another_employee.id)
        expect(response.user_id).to eq(another_employee.id)
      end
    end

    context 'when user email does not exist' do
      let(:params_invalid) do
        {
          user_email: 'inexistente'
        }
      end
      let(:instance) { described_class.new(card.id, params_invalid, admin) }

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { instance.execute }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'when user already associated to another card' do
      let(:instance) { described_class.new(card.id, params, admin) }

      before do
        create(:card, user: another_employee)
      end

      it 'raises ActiveRecord::RecordInvalid exception' do
        expect { instance.execute }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    context 'when user admin is sent to associate' do
      let(:params_with_admin_email) do
        {
          user_email: admin.email
        }
      end
      let(:instance) { described_class.new(card.id, params_with_admin_email, admin) }

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { instance.execute }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'when card is from another company' do
      let(:other_admin) { create(:user) }
      let(:other_employee) { create(:user, :employee, company: other_admin.company) }
      let(:card_other_company) { create(:card, :with_statement, user: other_employee) }
      let(:instance) { described_class.new(card_other_company.id, params, admin) }

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { instance.execute }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
