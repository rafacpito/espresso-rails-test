class CategoriesController < ApplicationController
  load_and_authorize_resource
  before_action :authenticate_user!

  def create
    category = Categories::Create.new(category_params, current_user).execute
    render json: category, serializer: CategorySerializer, status: :created
  end

  def destroy
    category = Categories::Destroy.new(params[:id], current_user).execute
    render json: category, serializer: CategorySerializer, status: :ok
  end

  def update
    category = Categories::Update.new(params[:id], category_params, current_user).execute
    render json: category, serializer: CategorySerializer, status: :ok
  end

  def list; end

  def index
    list = Categories::List.new(current_user, params).execute
    render json: list, meta: pagination(list), each_serializer: CategorySerializer, status: :ok
  end

  private

  def category_params
    params.require(:category).permit(:name)
  end
end
