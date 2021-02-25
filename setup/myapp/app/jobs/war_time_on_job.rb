class WarTimeOnJob < ApplicationJob
  queue_as :default

  def perform(war)
    100.times do
      puts "WARTIME IS NOW"
    end
    war.guilds.each do |guild|
      guild.inwar = true
      guild.save
    end
  end
end
