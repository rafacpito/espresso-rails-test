# frozen_string_literal: true

class HomeController < ApplicationController
  before_action :check_signed_in

  # GET /
  def index; end
end
