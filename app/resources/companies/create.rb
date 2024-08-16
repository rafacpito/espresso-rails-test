class Companies::Create
  attr_accessor :params

  def initialize(params)
    @params = params
  end

  def execute
    Company.create!(params)
  end
end