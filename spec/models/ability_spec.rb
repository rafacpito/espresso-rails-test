require 'cancan/matchers'

RSpec.describe Ability do  
  subject(:ability) { described_class.new(user) }

  context 'when there is no user' do
    let(:user){ nil }

    it { is_expected.to_not be_able_to(:create, Card) }
  end

  context 'when the user is present and admin' do
    let(:user){ create(:user) }

    it { is_expected.to be_able_to(:manage, Card) } 
    it { is_expected.to be_able_to(:manage, Category) } 
    it { is_expected.to be_able_to(:manage, Company) } 
    it { is_expected.to be_able_to(:manage, User) } 
    it { is_expected.to be_able_to(:read, Statement) } 
    it { is_expected.to be_able_to(:destroy, Statement) } 
  end

  context 'when the user is present and employee' do
    let(:user){ create(:user, :employee) }

    it { is_expected.to be_able_to(:create, Attachment) } 
    it { is_expected.to be_able_to(:read, Attachment) } 
    it { is_expected.to be_able_to(:update, Attachment) } 
    it { is_expected.to be_able_to(:read, Statement) } 
    it { is_expected.to be_able_to(:list, Statement) } 
    it { is_expected.to be_able_to(:update, Statement) } 
    it { is_expected.to be_able_to(:read, Category) } 
  end
end