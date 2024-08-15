module StatementQuery
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
        card_id_in: params[:card_id],
        deleted_at_not_null: params[:deleted] || false
      }
    end

    def format_order(order = '')
      return order if order.present?
 
      ['id DESC']
    end
  end
end