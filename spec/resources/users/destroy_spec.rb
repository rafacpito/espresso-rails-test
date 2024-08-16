require 'rails_helper'

RSpec.describe Users::Destroy do
  let(:admin) { create(:user) }
  let(:user) { create(:user, :employee, company: admin.company) }

  describe '#initialize' do
    before do
      @instance = described_class.new(user.id, admin)
    end

    it 'id to be instancied' do
      expect(@instance.id).to eq(user.id)
    end

    it 'current_user to be instancied' do
      expect(@instance.current_user).to eq(admin)
    end
  end

  describe '#execute' do
    context 'user does not have any card with statements and exists' do
      before do
        @response = described_class.new(user.id, admin).execute
      end

      it 'returns user object' do
        expect(@response.class).to eq(User)
      end

      it 'user not exist anymore' do
        expect(User.exists?(user.id)).to be_falsey
      end
    end

    context 'user id does not exists' do
      before do
        @instance = described_class.new('asd', admin)
      end

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end

    context 'user have card with statements' do
      let(:user_with_card_with_statement) { create(:user, :employee, :with_card_with_statement, company: admin.company) }

      before do
        @instance = described_class.new(user_with_card_with_statement.id, admin)
      end

      it 'raises CustomException exception' do
        expect { @instance.execute }.to raise_error(CustomException)
      end
    end

    context 'user from another company' do
      let(:other_admin) { create(:user) }
      let(:user_other_company) { create(:user, :employee, company: other_admin.company) }

      before do
        @instance = described_class.new(user_other_company.id, admin)
      end

      it 'raises ActiveRecord::RecordNotFound exception' do
        expect { @instance.execute }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end