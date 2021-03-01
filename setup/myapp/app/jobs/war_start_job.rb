class WarStartJob < ApplicationJob
  queue_as :default

  def perform(war)
    #if (war.startdate + war.duration.days < Time.now)
    #  WarEndJob.perform_later(war)
    #  return
    #end
    war.status = "active"
    if (war.save)
      war.guilds.each do |guild|
        guild.missed_matches = 0
        guild.save
        ActionCable.server.broadcast( "Guild_#{guild.id}", {
          action: 'update_info'
        })
      end
    end
    puts "WAR IS NOW ON"
    # Do something later
    puts "WAR WILL END"
    puts Time.now + war.duration.minutes

    WarEndJob.set(wait_until: Time.now + war.duration.minutes).perform_later(war)
  end
end
