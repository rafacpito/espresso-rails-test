class Statements::List
  attr_accessor :current_user, :params

  def initialize(current_user, params)
    @current_user = current_user
    @params = params
  end

  def execute
    return find_user_statements if current_user.role == User::EMPLOYEE_ROLE

    find_company_statements
  end

  def find_user_statements
    Statement.__search({ card_id: [current_user.card.try(:id) || 0], per_page: params[:per_page], page: params[:page] })
  end

  def find_company_statements
    Statement.__search({ card_id: find_company_cards, per_page: params[:per_page], page: params[:page] })
  end

  def find_company_cards
    company_cards = current_user.company.cards.map(&:id)
    return company_cards if company_cards.present?

    [0]
  end
end