# frozen_string_literal: true

module EmailHelper
  def email_image_tag(image, **options)
    attachments[image] = Rails.root.join("app/assets/images/#{image}").read
    image_tag attachments[image].url, **options
  end
end
