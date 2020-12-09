Rails.application.routes.draw do
  resources :muchachos
  devise_for :users, controllers: { omniauth_callbacks: "users/omniauth_callbacks" }

  root "pong#index"

  devise_scope :user do
    get 'sign_in', :to => 'devise/sessions#new', :as => :new_user_session
    delete 'sign_out', :to => 'devise/sessions#destroy', :as => :destroy_user_session_path
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
