# frozen_string_literal: true

module Cards
  class List
    attr_accessor :current_user, :params

    def initialize(current_user, params)
      @current_user = current_user
      @params = params
    end

    def execute
      Card.__search({ company_id: current_user.company_id, per_page: params[:per_page], page: params[:page] })
    end
  end
end
