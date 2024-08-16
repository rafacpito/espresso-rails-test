# frozen_string_literal: true

module Statements
  class Update
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

    def handle_attachment # rubocop:disable Metrics/AbcSize
      return if statement.attachment.present? && params[:file].try(:original_filename).blank?

      raise CustomException, 'Arquivo deve ser enviado' if params[:file].try(:original_filename).blank?

      unless %w[pdf png jpeg].include?(params[:file].original_filename.split('.').last)
        raise CustomException, 'Formato deve ser pdf, png ou jpeg'
      end

      cloudinary = Cloudinary::Uploader.upload(params[:file], {})
      return statement.create_attachment!(file: cloudinary) if statement.attachment.blank?

      statement.attachment.update!(file: cloudinary)
    end

    def find_category!
      Category.find_by!(id: params[:category_id], company_id: current_user.company_id).id
    end
  end
end
