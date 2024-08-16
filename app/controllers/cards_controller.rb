class CardsController < ApplicationController
  load_and_authorize_resource
  before_action :authenticate_user!

  def create
    card = Cards::Create.new(card_params).execute
    render json: card, serializer: CardSerializer, status: :created
  end

  def destroy
    card = Cards::Destroy.new(params[:id], current_user).execute
    render json: card, serializer: CardSerializer, status: :ok
  end

  def update
    card = Cards::Update.new(params[:id], card_params, current_user).execute
    render json: card, serializer: CardSerializer, status: :ok
  end

  def list; end

  def index
    list = Cards::List.new(current_user, params).execute
    render json: list, meta: pagination(list), each_serializer: CardSerializer, status: :ok
  end

  private

  def card_params
    params.require(:card).permit(:last4, :user_id, :user_email)
  end
end
