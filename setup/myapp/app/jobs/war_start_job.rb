class WarStartJob < ApplicationJob
  queue_as :default

  def perform(war)
    war.status = "active"
    war.save
    puts "WAR IS NOW ON"
    # Do something later
    puts "WAR WILL END"
    puts Time.now + war.duration.minutes
    WarEndJob.set(wait_until: Time.now + war.duration.minutes).perform_later(war)
  end
end
