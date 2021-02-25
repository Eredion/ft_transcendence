class WarEndJob < ApplicationJob
  queue_as :default

  def perform(war)
    puts "FRANCO HA MUERTO"
    puts "FRANCO HA MUERTO"
    puts "FRANCO HA MUERTO"
    puts "FRANCO HA MUERTO"
    puts "FRANCO HA MUERTO"
    puts "FRANCO HA MUERTO"
    puts "FRANCO HA MUERTO"
    puts "FRANCO HA MUERTO"
    puts "FRANCO HA MUERTO"
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
