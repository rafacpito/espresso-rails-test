module CardQuery
  extend ActiveSupport::Concern
  include BaseQuery

  included do
    extend ClassMethods
  end

  module ClassMethods
    def format_params(params)
      return {} unless params

      {
        id_eq: params[:id],
        user_company_id_eq: params[:company_id],
      }
    end

    def format_order(order = '')
      return order if order.present?
 
      ['id DESC']
    end
  end
end