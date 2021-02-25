class WarStartJob < ApplicationJob
  queue_as :default

  def perform(war)
    war.status = "active"
    war.save
    war.guilds.each do |guild|
      guild.inwar = true
      guild.save
      end
    end
    puts "WAR IS NOW ON"
    # Do something later
    WarEndJob.set(wait_until: Time.now + war.duration.minutes).perform_later(war)
  end
end
