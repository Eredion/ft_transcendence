class MissMatchWaitJob < ApplicationJob
  queue_as :default

  def perform()
    # Esperate un ratito
    # Mirame si ha sido aceptada la pelea
    # Si no dale pa atras. 

  end

end
