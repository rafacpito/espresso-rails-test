class Statements::Create
  attr_accessor :params

  def initialize(params)
    @params = params
  end

  def execute
    card = Card.find_by!(last4: params[:last4])
    Statement.create!(mount_params(card))
  end

  private

  def mount_params(card)
    {
      merchant: params[:merchant],
      cost: params[:cost],
      transaction_id: params[:transaction_id],
      performed_at: params[:created_at].to_datetime.in_time_zone('Brasilia'),
      status: Statement::UNPROVEN_STATUS,
      card: card
    }
  end
end