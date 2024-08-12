class UsersController < ApplicationController
  def sign_up; end

  def create
    user = Users::Create.new(params).execute
    render json: user, serializer: UserSerializer, status: :created
  end
end
