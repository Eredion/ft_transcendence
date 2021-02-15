class UnsilenceJob < ApplicationJob
  queue_as :default

  def perform(nickname, channel, tsec)
    #puts "silencing #{nickname} from #{channel} for #{tsec}"
    user = User.find_by(nickname: "darodrig")
    channel = Channel.find_by(name: channel)
    p channel.silenced
    channel.silenced.delete(user.id)
    puts "unmuting #{user.nickname} from #{channel.name} after #{tsec}"
    p channel.silenced
    channel.save
  end
end
