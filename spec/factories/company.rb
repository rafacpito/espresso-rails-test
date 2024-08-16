# frozen_string_literal: true

FactoryBot.define do
  factory :company, class: Company do
    name { 'Teste' }
    cnpj { Faker::CNPJ.pretty }
  end
end
