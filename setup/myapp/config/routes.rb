Rails.application.routes.draw do
  
  devise_for :users, controllers: {
    omniauth_callbacks: "users/omniauth_callbacks",
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  
  root "pong#index"
  resources :users, only: [:show] do
    member do
      post :update_avatar
      post :block_user
      delete :unblock_user
    end
  end
  resources :chats, only: [:create]
  
  namespace :api do
    resources :tournaments
    resources :wars
    resources :users, only: [:index, :show, :update, :create] do
      member do
        get :show_friends
        get :show_blockeds
        delete :delete_friend
        get :match_history
        get :guild
        get :mysession
        post :enable_two_fa
        post :disable_two_fa
        get :two_fa
        post :validate_two_fa
      end
    end
    resources :chats, only: [:index, :create, :update, :show]
    resources :messages
    resources :channels, only: [:index, :create, :update, :show, :delete]
    resources :requests, only: [:show, :create, :update]
    resources :matches, only: [:index, :show] do
      collection do
        get :in_progress
      end
    end
    resources :guilds, only: [:index, :show, :create, :update, :destroy] do
      member do
        post :new_member
        delete :eject_member
        delete :leave_guild
        post :update_guild_avatar
      end
    end
  end
  
  get '*path', to: 'pong#index'

  devise_scope :user do
    #get 'sign_in', :to => 'users#sign_in', :as => :user_session
    #get 'sign_in', :to => 'users/sessions#new', :as => :new_user_session
    post 'sign_in', :to => 'users/sessions#create', :as => :create_user_session

    #get 'sign_up', :to => 'users/registrations#new', :as => :new_user_registration
    post 'sign_up', :to => 'users/registrations#create', :as => :create_user_registration

    delete 'sign_out', :to => 'users/sessions#destroy', :as => :destroy_user_session_path
  end
  #devise_scope :user do
  #  get 'sign_in', :to => 'devise/sessions#new', :as => :new_user_session
  #end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
