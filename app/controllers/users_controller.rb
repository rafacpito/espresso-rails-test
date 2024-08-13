class UsersController < ApplicationController
  before_action :authenticate_user!, except: [:sign_up, :create]
  before_action :check_signed_in, only: [:sign_up]

  def sign_up; end

  def create
    user = Users::Create.new(params).execute
    render json: user, serializer: UserSerializer, status: :created
  end

  def list; end

  def index_employees
    list = Users::ListEmployees.new(current_user).execute
    render json: list, each_serializer: UserSerializer, status: :ok
  end
end
