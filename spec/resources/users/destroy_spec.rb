# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Users::Destroy do
  let(:admin) { create(:user) }
  let(:user) { create(:user, :employee, company: admin.company) }

  describe '#initialize' do
    let(:instance) { described_class.new(user.id, admin) }

    it 'id to be instancied' do
      expect(instance.id).to eq(user.id)
    end

    it 'current_user to be instancied' do
      expect(instance.current_user).to eq(admin)
    end
  end

  describe '#execute' do
    context 'when user does not have any card with statements and exists' do
      let(:response) { described_class.new(user.id, admin).execute }

      before do
        response
      end

      it 'returns user object' do
        expect(response.class).to eq(User)
      end

      it 'user not exist anymore' do
        expect(User).not_to exist(user.id)
      end
    end

    context 'when user id does not exists' do
      let(:response) { described_class.new('asd', admin).execute }

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { response }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'when user have card with statements' do
      let(:user_with_card_with_statement) do
        create(:user, :employee, :with_card_with_statement, company: admin.company)
      end
      let(:response) { described_class.new(user_with_card_with_statement.id, admin).execute }

      it 'raises CustomException exception' do
        expect { response }.to raise_error(CustomException)
      end
    end

    context 'when user from another company' do
      let(:other_admin) { create(:user) }
      let(:user_other_company) { create(:user, :employee, company: other_admin.company) }
      let(:response) { described_class.new(user_other_company.id, admin).execute }

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { response }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
