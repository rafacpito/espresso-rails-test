FactoryBot.define do
  factory :user, class: User do
    email { Faker::Internet.email }
    name { 'Teste' }
    role { User::ADMIN_ROLE }
    password { 'test123' }
    company { create(:company) }

    trait :employee do
      role { User::EMPLOYEE_ROLE }
    end

    trait :with_card_with_statement do
      card { create(:card, :with_statement) }
    end
  end
end