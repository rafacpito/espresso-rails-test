# frozen_string_literal: true

Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'home#index'
  devise_for :users, path: '', path_names: {
                                 sign_in: 'login',
                                 sign_out: 'logout'
                               },
                     controllers: {
                       sessions: 'users/sessions'
                     }

  # Usuários
  get '/signup', to: 'users#sign_up'
  post '/users', to: 'users#create'
  get '/employees/list', to: 'users#list'
  get '/employees', to: 'users#index_employees'
  delete '/users/:id', to: 'users#destroy'
  put '/users/:id', to: 'users#update'

  # Despesas
  get '/statements/list', to: 'statements#list'
  get '/statements', to: 'statements#index'
  get '/statements/archived', to: 'statements#index_archived'
  post '/api/baas/webhooks', to: 'statements#create'
  delete '/statements/:id', to: 'statements#destroy'
  put '/statements/:id', to: 'statements#update'

  # Categorias
  get '/categories/list', to: 'categories#list'
  get '/categories', to: 'categories#index'
  post '/categories', to: 'categories#create'
  delete '/categories/:id', to: 'categories#destroy'
  put '/categories/:id', to: 'categories#update'

  # Cartões
  get '/cards/list', to: 'cards#list'
  get '/cards', to: 'cards#index'
  post '/cards', to: 'cards#create'
  delete '/cards/:id', to: 'cards#destroy'
  put '/cards/:id', to: 'cards#update'
end
