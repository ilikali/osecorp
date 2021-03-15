Rails.application.routes.draw do
  root to: "osecorp#home"
  get "about", to: "osecorp#about"
  get "works", to: "osecorp#works"
  get "parters", to: "osecorp#about"
  get "contacts", to: "osecorp#about"
end
