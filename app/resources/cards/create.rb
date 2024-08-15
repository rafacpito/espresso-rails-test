class Cards::Create
  attr_accessor :params

  def initialize(params)
    @params = params
  end

  def execute
    Card.create!(mount_params)
  end

  private

  def mount_params
    {
      last4: params[:last4],
      user_id: params[:user_id]
    }
  end
end