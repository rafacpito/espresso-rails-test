class Statements::ListArchived
  attr_accessor :current_user, :params

  def initialize(current_user, params)
    @current_user = current_user
    @params = params
  end

  def execute
    Statement.with_deleted.__search({ card_id: current_user.company.cards.map(&:id), deleted: true, per_page: params[:per_page], page: params[:page] })
  end
end