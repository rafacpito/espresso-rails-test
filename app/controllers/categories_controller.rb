class CategoriesController < ApplicationController
  before_action :authenticate_user!

  def create
    category = Categories::Create.new(params, current_user).execute
    render json: category, serializer: CategorySerializer, status: :created
  end

  def destroy
    category = Categories::Destroy.new(params[:id], current_user).execute
    render json: category, serializer: CategorySerializer, status: :ok
  end

  def update
    category = Categories::Update.new(params, current_user).execute
    render json: category, serializer: CategorySerializer, status: :ok
  end

  def list; end

  def index
    list = Categories::List.new(current_user).execute
    render json: list, each_serializer: CategorySerializer, status: :ok
  end
end
