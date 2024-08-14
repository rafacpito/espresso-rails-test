class Users::Create
  attr_accessor :params, :company

  def initialize(params)
    @params = params
  end

  def execute
    ActiveRecord::Base.transaction do
      @company = define_company
      create_user
    end
  end

  private

  def define_company
    return Company.find(params[:user][:company_id]) if params[:user][:company_id].present?

    create_company
  end

  def create_company
    Companies::Create.new(mount_params_to_company).execute
  end

  def mount_params_to_company
    {
      company: {
        name: params[:user][:companyName],
        cnpj: params[:user][:cnpj]
      }
    }
  end

  def create_user
    User.create!(mount_params)
  end

  def mount_params
    {
      name: params[:user][:name],
      email: params[:user][:email],
      password: params[:user][:password] || generate_random_password,
      role: params[:user][:role],
      company: company
    }
  end

  def generate_random_password
    SecureRandom.hex(6)
  end
end