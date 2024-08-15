class Categories::Update
  attr_accessor :id, :params

  def initialize(id, params)
    @id = id
    @params = params
  end

  def execute
    category = Category.find(id)
    category.update!(name: params[:name])
    category
  end
end