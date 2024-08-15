class Statements::Update
  attr_accessor :id, :params, :statement

  def initialize(id, params)
    @id = id
    @params = params
  end

  def execute
    ActiveRecord::Base.transaction do
      @statement = Statement.find(id)
      statement.update!(category_id: params[:category_id], status: Statement::PROVEN_STATUS)
      handle_attachment
      statement
    end
  end

  private
  
  def handle_attachment
    return unless params[:file].try(:original_filename).present?

    unless ['pdf', 'png', 'jpeg'].include?(params[:file].original_filename.split('.').last)
      raise CustomException.new("Formato deve ser pdf, png ou jpeg")
    end

    cloudinary = Cloudinary::Uploader.upload(params[:file], options = {})
    return statement.create_attachment!(file: cloudinary) unless statement.attachment.present?

    statement.attachment.update!(file: cloudinary)
  end
end