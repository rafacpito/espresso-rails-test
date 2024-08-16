require 'rails_helper'

RSpec.describe Cards::Update do
  let(:admin) { create(:user) }
  let(:employee) { create(:user, :employee, company: admin.company )}
  let(:card) { create(:card, user: employee) }
  let(:another_employee) { create(:user, :employee, company: admin.company) }
  let(:params) do
    {
      user_email: another_employee.email
    }
  end

  describe '#initialize' do
    before do
      @instance = described_class.new(card.id, params, admin)
    end

    it 'id to be instancied' do
      expect(@instance.id).to eq(card.id)
    end

    it 'params to be instancied' do
      expect(@instance.params).to eq(params)
    end
  
    it 'current_user to be instancied' do
      expect(@instance.current_user).to eq(admin)
    end
  end

  describe '#execute' do
    context 'user email valid and user not associated to another card' do
      before do
        @old_card = card
        @response = described_class.new(card.id, params, admin).execute
      end

      it 'returns card object' do
        expect(@response.class).to eq(Card)
      end

      it 'user updated' do
        expect(@old_card.user_id).not_to eq(another_employee.id)
        expect(@response.user_id).to eq(another_employee.id)
      end
    end

    context 'user email does not exist' do
      let(:params_invalid) do
        {
          user_email: 'inexistente'
        }
      end

      before do
        @instance = described_class.new(card.id, params_invalid, admin)
      end

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'user already associated to another card' do
      let!(:new_card) { create(:card, user: another_employee) }

      before do
        @instance = described_class.new(card.id, params, admin)
      end

      it 'raises ActiveRecord::RecordInvalid exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordInvalid)
      end
    end

    context 'user admin sent to associate' do
      let(:params_with_admin_email) do
        {
          user_email: admin.email
        }
      end

      before do
        @instance = described_class.new(card.id, params_with_admin_email, admin)
      end

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'card from another company' do
      let(:other_admin) { create(:user) }
      let(:other_employee) { create(:user, :employee, company: other_admin.company )}
      let(:card_other_company) { create(:card, :with_statement, user: other_employee) }

      before do
        @instance = described_class.new(card_other_company.id, params, admin)
      end

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end