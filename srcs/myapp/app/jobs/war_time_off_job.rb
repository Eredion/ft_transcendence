class WarTimeOffJob < ApplicationJob
  queue_as :default

  def perform(war)
    100.times do
      puts "WARTIME IS OFF"
    end
    war.guilds.each do |guild|
      guild.inwar = false
      guild.save
    end
  end
end