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
    resources :users, only: [:index, :show, :update, :create] do
      member do
        get :show_friends
        get :show_blockeds
        delete :delete_friend
        get :match_history
        get :guild
      end
    end
    resources :chats
    resources :messages
    resources :channels
    resources :friend_requests, only: [:show, :create, :update]
    resources :matches, only: [:index, :show]
    resources :guilds, only: [:index, :show, :create, :update, :destroy] do
      member do
        post :new_member
        delete :eject_member
        delete :leave_guild
        post :update_guild_avatar
      end
    end
  end

  devise_scope :user do
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
