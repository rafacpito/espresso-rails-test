# frozen_string_literal: true

module Companies
  class Create
    attr_accessor :params

    def initialize(params)
      @params = params
    end

    def execute
      Company.create!(params)
    end
  end
end
