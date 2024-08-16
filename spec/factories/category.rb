FactoryBot.define do
  factory :category, class: Category do
    name { 'teste' }
    company { create(:company) }

    trait :with_statement do
      statements { [create(:statement)] }
    end
  end
end