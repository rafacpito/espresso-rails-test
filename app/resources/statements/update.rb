class Statements::Update
  attr_accessor :id, :params, :statement, :current_user

  def initialize(id, params, current_user)
    @id = id
    @params = params
    @current_user = current_user
  end

  def execute
    ActiveRecord::Base.transaction do
      @statement = Statement.joins(:card).find_by!(id: id, cards: { user_id: current_user.id })
      statement.update!(category_id: find_category!, status: Statement::PROVEN_STATUS)
      handle_attachment
      statement
    end
  end

  private
  
  def handle_attachment
    return if statement.attachment.present? && params[:file].try(:original_filename).blank?

    raise CustomException.new("Arquivo deve ser enviado") unless params[:file].try(:original_filename).present?

    unless ['pdf', 'png', 'jpeg'].include?(params[:file].original_filename.split('.').last)
      raise CustomException.new("Formato deve ser pdf, png ou jpeg")
    end

    cloudinary = Cloudinary::Uploader.upload(params[:file], options = {})
    return statement.create_attachment!(file: cloudinary) unless statement.attachment.present?

    statement.attachment.update!(file: cloudinary)
  end

  def find_category!
    Category.find_by!(id: params[:category_id], company_id: current_user.company_id).id
  end
end