class CardsController < ApplicationController
  before_action :authenticate_user!

  def create
    card = Cards::Create.new(params).execute
    render json: card, serializer: CardSerializer, status: :created
  end

  def destroy
    card = Cards::Destroy.new(params[:id]).execute
    render json: card, serializer: CardSerializer, status: :ok
  end

  def update
    card = Cards::Update.new(params).execute
    render json: card, serializer: CardSerializer, status: :ok
  end

  def list; end

  def index
    list = Cards::List.new(current_user).execute
    render json: list, each_serializer: CardSerializer, status: :ok
  end
end
