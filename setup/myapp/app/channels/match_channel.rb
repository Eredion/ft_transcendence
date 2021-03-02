class MatchChannel < ApplicationCable::Channel

  def subscribed
    stream_from "Match_#{params[:id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def start(data)
	  Pong.create_match(data['id'])
  end

  # move 0 -> stop move
  # move 1 -> up move
  # move 2 -> down move
  def receive_move(data)
	  Pong.set_move(data)
  end

  # finish match manually for testings
  def finish_match(data)
    if c_pong = Pong.get_game(data['match'])
      c_pong.finish_match
    end
    Pong.delete_match(data['match'])
    ActionCable.server.broadcast("Match_#{data['match']}", {action: 'Match Finished'})
  end
end
