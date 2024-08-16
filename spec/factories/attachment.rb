FactoryBot.define do
  factory :attachment, class: Attachment do
    file { 'Teste' }
    statement { create(:statement) }
  end
end