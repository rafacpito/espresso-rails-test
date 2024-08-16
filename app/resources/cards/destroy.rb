# frozen_string_literal: true

module Cards
  class Destroy
    attr_accessor :id, :current_user

    def initialize(id, current_user)
      @id = id
      @current_user = current_user
    end

    def execute
      card = Card.joins(:user).find_by!(id: id, users: { company_id: current_user.company_id })
      raise CustomException, 'Impossível deletar um cartão com despesas vinculadas.' if card.statements.present?

      card.destroy
    end
  end
end
