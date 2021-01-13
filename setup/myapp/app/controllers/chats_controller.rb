class ChatsController < ApplicationController
	def create
        @chat = Chat.new(params)
        if @chat.save
          puts("Chat saved")
        end
    end
end
