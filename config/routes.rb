Rails.application.routes.draw do
  root 'index#frontcover'
  get '/:id' => 'index#frontcover'
end
