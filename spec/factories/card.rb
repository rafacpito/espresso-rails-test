# frozen_string_literal: true

FactoryBot.define do
  factory :card, class: Card do
    last4 { Faker::Number.number(digits: 4) }
    user { create(:user, :employee) }

    trait :with_statement do
      statements { [create(:statement)] }
    end
  end
end
