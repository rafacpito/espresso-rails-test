# frozen_string_literal: true

module Users
  class Destroy
    attr_accessor :id, :current_user

    def initialize(id, current_user)
      @id = id
      @current_user = current_user
    end

    def execute
      user = User.find_by!(id: id, company_id: current_user.company_id)
      if user.try(:card).try(:statements).try(:present?)
        raise CustomException, 'Impossível deletar um usuário vinculado a um cartão com despesas vinculadas.'
      end

      user.destroy
    end
  end
end
