# frozen_string_literal: true

module Statements
  class ListArchived
    attr_accessor :current_user, :params

    def initialize(current_user, params)
      @current_user = current_user
      @params = params
    end

    def execute
      Statement.with_deleted.__search({ card_id: find_company_cards, deleted: true, per_page: params[:per_page],
                                        page: params[:page] })
    end

    private

    def find_company_cards
      company_cards = current_user.company.cards.map(&:id)
      return company_cards if company_cards.present?

      [0]
    end
  end
end
