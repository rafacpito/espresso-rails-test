# frozen_string_literal: true

class UsersController < ApplicationController
  load_and_authorize_resource except: %i[sign_up create]
  before_action :authenticate_user!, except: %i[sign_up create]
  before_action :check_signed_in, only: [:sign_up]

  def sign_up; end

  def create
    user = Users::Create.new(user_params).execute
    render json: user, serializer: UserSerializer, status: :created
  end

  def update
    user = Users::Update.new(params[:id], user_params, current_user).execute
    render json: user, serializer: UserSerializer, status: :ok
  end

  def destroy
    user = Users::Destroy.new(params[:id], current_user).execute
    render json: user, serializer: UserSerializer, status: :ok
  end

  def list; end

  def index_employees
    list = Users::ListEmployees.new(current_user, params).execute
    render json: list, meta: pagination(list), each_serializer: UserSerializer, status: :ok
  end

  private

  def user_params
    params.require(:user).permit(:company_id, :name, :email, :password, :role, company: %i[name cnpj])
  end
end
