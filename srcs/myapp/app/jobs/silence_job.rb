class SilenceJob < ApplicationJob
  queue_as :default

  def perform(id, channel, tsec)
    user = User.find_by(id: id)
    channel = Channel.find_by(name: channel)
    channel.silenced.push(user.id)
    channel.save
    UnsilenceJob.set(wait: tsec.seconds).perform_later(id, channel.name, tsec)
  end

end
