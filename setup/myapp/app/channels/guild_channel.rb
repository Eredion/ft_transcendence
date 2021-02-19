class GuildChannel < ApplicationCable::Channel
	def subscribed
		stream_from "Guild_#{params[:id]}"
	end

	def unsubscribed
	# Any cleanup needed when channel is unsubscribed
	end

	def kick(data)
		if guild = Guild.find_by(id: data['guild'])
			if data['from'] == guild.owner_id || guild.officers.include?(data['from']) || current_user.admin == true
				guild.members.delete(data['member'])
				member = User.find_by(id: data['member'])
				member.guild_id = nil
				guild.save
				member.save
				ActionCable.server.broadcast( "Guild_#{data['guild']}", {
					action: 'update'
				})
			end
		end
	end

	def made_officer(data)
		if guild = Guild.find_by(id: data['guild'])
			if data['from'] == guild.owner_id || current_user.admin == true
				guild.members.delete(data['member'])
				guild.officers.push(data['member'])
				guild.save
				ActionCable.server.broadcast( "Guild_#{data['guild']}", {
					action: 'update'
				})
			end
		end
	end

	def remove_officer(data)
		if guild = Guild.find_by(id: data['guild'])
			if data['from'] == guild.owner_id || current_user.admin == true
				guild.officers.delete(data['member'])
				guild.members.push(data['member'])
				guild.save
				ActionCable.server.broadcast( "Guild_#{data['guild']}", {
					action: 'update'
				})
			end
		end
	end

	def add_message(data)
		user = User.find_by(id: data['from'])
		chat = Chat.find_by(id: data['chat'])
		if user && chat
			mess = Message.create!(:content => data['message'], :user_id => user.id, :author => user.nickname, :chat_id => chat.id)
			ActionCable.server.broadcast( "Guild_#{data['guild']}", {
				action: 'new_message',
				data: mess
			})
		end
	end
end
