class WarEndJob < ApplicationJob
  queue_as :default

  def perform(war)
    puts "WAR HAS ENDED"
    puts "WAR HAS ENDED"
    puts "WAR HAS ENDED"
    puts "WAR HAS ENDED"
    puts "WAR HAS ENDED"
    puts "WAR HAS ENDED"
    puts "WAR HAS ENDED"
    puts "WAR HAS ENDED"
    puts "WAR HAS ENDED"
    #

    war.guilds.each do |guild|
      guild.inwar = false
      guild.war_id = nil
      guild.save
    end
    war.guilds = nil
    war.save
    # Do something later
  end
end
