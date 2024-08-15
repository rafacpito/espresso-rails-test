class StatementsController < ApplicationController
  load_and_authorize_resource except: [:create]
  before_action :authenticate_user!, except: [:create]

  def list; end

  def create
    Statements::Create.new(params).execute
    head :ok
  end

  def index
    list = Statements::List.new(current_user, params).execute
    render json: list, meta: pagination(list), each_serializer: StatementSerializer, status: :ok
  end

  def index_archived
    list = Statements::ListArchived.new(current_user, params).execute
    render json: list, meta: pagination(list), each_serializer: StatementSerializer, status: :ok
  end

  def destroy
    statement = Statements::Destroy.new(params[:id]).execute
    render json: statement, serializer: StatementSerializer, status: :ok
  end

  def update
    statement = Statements::Update.new(params[:id], statement_params).execute
    render json: statement, serializer: StatementSerializer, status: :ok
  end

  private

  def statement_params
    params.require(:statement).permit(:merchant, :cost, :transaction_id, :created_at, :last4, :category_id, :file)
  end
end
