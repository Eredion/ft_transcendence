Rails.application.routes.draw do
  
  devise_for :users, controllers: {
    omniauth_callbacks: "users/omniauth_callbacks",
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  
  root "pong#index"
  resources :users, only: [:show]
  post 'messages', to: 'messages#create'
  namespace :api do
    resources :users
    resources :chats
    resources :messages
    resources :channels
  end
  devise_scope :user do
    post 'update_avatar/:id', :to => 'users#update_avatar', :as => :update_user_avatar
    get 'sign_in', :to => 'users#sign_in', :as => :user_session
    #get 'sign_in', :to => 'users/sessions#new', :as => :new_user_session
    post 'sign_in', :to => 'users/sessions#create', :as => :create_user_session

    #get 'sign_up', :to => 'users/registrations#new', :as => :new_user_registration
    post 'sign_up', :to => 'users/registrations#create', :as => :create_user_registration

    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session
  end
  #devise_scope :user do
  #  get 'sign_in', :to => 'devise/sessions#new', :as => :new_user_session
  #end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
