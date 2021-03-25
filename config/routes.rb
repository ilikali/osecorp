Rails.application.routes.draw do
  root to: "osecorp#home"
  get "about", to: "osecorp#about"
  get "works", to: "osecorp#works"
  get "parters", to: "osecorp#partners"
  get "contacts", to: "osecorp#contacts"
end
