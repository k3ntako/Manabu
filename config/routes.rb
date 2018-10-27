Rails.application.routes.draw do

  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  namespace :api do
    namespace :v1 do
      resources :decks, only: :index do
        resources :cards, only: :index do
          resources :masteries, only: :create
        end
      end
    end
  end

  root 'homes#index'
  get '*path', to: 'homes#index'
end
