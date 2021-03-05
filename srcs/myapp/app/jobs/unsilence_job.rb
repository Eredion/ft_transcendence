class UnsilenceJob < ApplicationJob
  queue_as :default

  def perform(id, channel, tsec)
    user = User.find_by(id: id)
    channel = Channel.find_by(name: channel)
    channel.silenced.delete(user.id)
    channel.save
  end
end
