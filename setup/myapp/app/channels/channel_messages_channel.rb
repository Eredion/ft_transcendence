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

  def remove_user(data)
    cha = Channel.find_by(name: data["channel"])
    arr = cha.members
    puts "removing user" + data["user"]
    user = User.find_by(nickname: data["user"])
    puts "found user #{user.nickname}"
    cha.members.delete(user.id)
    if (user.id.in?(cha.admins))
      cha.admins.delete(user.id)
    end
    if (cha.members.length > 0 && cha.user_id == user.id)
      cha.user_id = cha.members[0]
      cha.admins.push(cha.user_id)
      cha.save
    elsif cha.members.length == 0
      cha.destroy
      return
    end
    ActionCable.server.broadcast "available_channels_channel",
      "force_render_channel_list"
    cha.save

  end
end
