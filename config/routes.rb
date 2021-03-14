Rails.application.routes.draw do
  root to: "osecorp#home"
  get "about", to: "osecorp#about"
end
