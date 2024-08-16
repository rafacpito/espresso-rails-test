# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Cards::List do
  let(:admin) { create(:user) }
  let(:employee) { create(:user, :employee, company: admin.company) }
  let(:params) { {} }

  before do
    create(:card, user: employee)
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
    context 'when sending admin with cards' do
      let(:response) { described_class.new(admin, params).execute }

      it 'return list of cards' do
        expect(response).to be_present
        response.each do |card|
          expect(card.class).to eq(Card)
          expect(card.user.company_id).to eq(admin.company_id)
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
