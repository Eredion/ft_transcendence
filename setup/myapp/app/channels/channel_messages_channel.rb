class ChannelMessagesChannel < ApplicationCable::Channel
  def subscribed
    puts("SUSCRITO A " + "channel_messages_#{params[:name]}")
    stream_from "channel_messages_#{params[:name]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def add_user_to_channel(data)
    puts("FOUND")
    puts("FOUND")
    puts("FOUND")
    puts("FOUND")
    puts("FOUND")
    puts("FOUND")
    puts("FOUND")
    puts("FOUND")
    puts("FOUND")
    puts("DATA:")
    puts(data)
    c = Channel.find_by(name: data["channel"])
    if (c.name.length > 0)
      puts("found channel #{c.name}")
    else
      puts("not found joder")
    end
    toadd = User.find_by(nickname: data["user"])
    puts(toadd.nickname)
    puts("MEMBERS")
    puts(c.members.length)
    if (c.members.include? toadd.id)
      return
    else
      c.members.push(toadd.id)
    end
    puts("USERS:")
    p(c.members)
    c.save
    #
  end
end
