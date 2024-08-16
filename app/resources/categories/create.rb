# frozen_string_literal: true

module Categories
  class Create
    attr_accessor :params, :current_user

    def initialize(params, current_user)
      @params = params
      @current_user = current_user
    end

    def execute
      Category.create!(mount_params)
    end

    private

    def mount_params
      {
        name: params[:name],
        company_id: current_user.company.id
      }
    end
  end
end
