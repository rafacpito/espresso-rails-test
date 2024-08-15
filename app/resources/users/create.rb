class Users::Create
  attr_accessor :params, :company, :password

  def initialize(params)
    @params = params
  end

  def execute
    ActiveRecord::Base.transaction do
      @company = define_company
      user = create_user
      send_email(user)
      user
    end
  end

  private

  def define_company
    return Company.find(params[:company_id]) if params[:company_id].present?

    create_company
  end

  def create_company
    Companies::Create.new(mount_params_to_company).execute
  end

  def mount_params_to_company
    {
      company: {
        name: params[:company][:name],
        cnpj: params[:company][:cnpj]
      }
    }
  end

  def create_user
    User.create!(mount_params)
  end

  def mount_params
    {
      name: params[:name],
      email: params[:email],
      password: params[:password] || generate_random_password,
      role: params[:role],
      company: company
    }
  end

  def generate_random_password
    @password = SecureRandom.hex(6)
  end

  def send_email(user)
    UserMailer.with(user: user, password: password).welcome_message.deliver_now
  end
end