# frozen_string_literal: true

require_relative 'boot'

require 'rails'
# Pick the frameworks you want:
require 'active_model/railtie'
require 'active_job/railtie'
require 'active_record/railtie'
require 'active_storage/engine'
require 'action_controller/railtie'
require 'action_mailer/railtie'
require 'action_view/railtie'
require 'action_cable/engine'
require 'sprockets/railtie'
# require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module EspressoRailsTest
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.2

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.

    # Don't generate system test files.
    config.autoload_paths << Rails.root.join('app/resources')
    config.eager_load_paths += Dir[Rails.root.join('app/models/concerns/query')]
    config.i18n.default_locale = :'pt-BR'
    config.generators.system_tests = nil
    config.time_zone = 'Brasilia'
    config.action_controller.default_protect_from_forgery = true

    config.assets.initialize_on_precompile = false

    config.middleware.insert_before 0, Rack::Cors do
      allow do
        origins '*'
        resource(
          '*',
          headers: :any,
          expose: ['Authorization'],
          methods: %i[get patch put delete post options show]
        )
      end
    end
  end
end
