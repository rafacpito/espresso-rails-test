# frozen_string_literal: true

module Categories
  class Update
    attr_accessor :id, :params, :current_user

    def initialize(id, params, current_user)
      @id = id
      @params = params
      @current_user = current_user
    end

    def execute
      category = Category.find_by!(id: id, company_id: current_user.company_id)
      category.update!(name: params[:name])
      category
    end
  end
end
