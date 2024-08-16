FactoryBot.define do
  factory :statement, class: Statement do
    performed_at { DateTime.now }
    cost { 1200 }
    merchant { "Uber *UBER *TRIP" }
    transaction_id { '3e85a730-bb1f-451b-9a39-47c55aa054db' }
    status { Statement::UNPROVEN_STATUS }
    card { create(:card) }

    trait :proven do
      status { Statement::PROVEN_STATUS }
      category { create(:category) }
    end
  end
end