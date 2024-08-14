# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'home#index'
  devise_for :users, path: '', path_names: {
    sign_in: 'login',
    sign_out: 'logout',
    registration: 'signup'
  },
  controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }

  # users
  get '/signup', to: 'users#sign_up'
  post '/users/create', to: 'users#create'
  get '/employees/list', to: 'users#list'
  get '/employees', to: 'users#index_employees'
  delete '/users/:id', to: 'users#destroy'
  put '/users/:id', to: 'users#update'

  # expenses
  get '/expenses/list', to: 'expenses#list'

  # categories
  get '/categories/list', to: 'categories#list'  
  get '/categories', to: 'categories#index'
  post '/categories/create', to: 'categories#create'
  delete '/categories/:id', to: 'categories#destroy'
  put '/categories/:id', to: 'categories#update'
end
