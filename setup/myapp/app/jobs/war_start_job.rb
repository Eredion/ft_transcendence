class WarStartJob < ApplicationJob
  queue_as :default

  def perform(war)
    war.status = "active"
    war.save
    puts "WAR IS NOW ON"
    # Do something later
  end
end
