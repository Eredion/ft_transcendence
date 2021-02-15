class SilenceJob < ApplicationJob
  queue_as :default

  def perform(id, channel, tsec)
    puts "PASSWORD"
    user = User.find_by(id: id)
    channel = Channel.find_by(name: channel)
    puts "silencing #{user.nickname} from #{channel.name} for #{tsec}"
    p channel.silenced
    channel.silenced.push(user.id)
    p channel.silenced
    channel.save
    UnsilenceJob.set(wait: tsec.seconds).perform_later(id, channel.name, tsec)
  end

    #user = User.find_by(nickname: nickname)
    #channel = Channel.find_by(name: name)
    #puts "silencing #{user.nickname} from #{channel.name} for #{tsec}"
    #channel.silenced.push(user.id)
    #sleep(tsec)
    #channel.silenced.delete(user.id)
    #puts "unmuted #{user.nickname} from #{channel.name} after #{tsec}"
    # Do something later
  
end
