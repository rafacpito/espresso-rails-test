# frozen_string_literal: true

class StatementsController < ApplicationController
  before_action :authenticate_user!, except: [:create]
  load_and_authorize_resource except: [:create]
  protect_from_forgery with: :null_session, only: [:create]

  def list; end

  def index
    list = Statements::List.new(current_user, params).execute
    render json: list, meta: pagination(list), each_serializer: StatementSerializer, status: :ok
  end

  def create
    Statements::Create.new(params).execute
    head :ok
  end

  def index_archived
    list = Statements::ListArchived.new(current_user, params).execute
    render json: list, meta: pagination(list), each_serializer: StatementSerializer, status: :ok
  end

  def update
    statement = Statements::Update.new(params[:id], statement_params, current_user).execute
    render json: statement, serializer: StatementSerializer, status: :ok
  end

  def destroy
    statement = Statements::Destroy.new(params[:id], current_user).execute
    render json: statement, serializer: StatementSerializer, status: :ok
  end

  private

  def statement_params
    params.require(:statement).permit(:merchant, :cost, :transaction_id, :created_at, :last4, :category_id, :file)
  end
end
