class ExpensesController < ApplicationController
  before_action :authenticate_user!
  def list; end
end
