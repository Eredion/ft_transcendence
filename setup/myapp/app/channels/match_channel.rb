class MatchChannel < ApplicationCable::Channel

  @@match = []

  def subscribed
    stream_from "Match_#{params[:id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  # move 0 -> stop move
  # move 1 -> up move
  # move 2 -> down move
  def receive_move(data)
    puts "match: #{data['match']} from: #{data['from']} side: #{data['side']} move: #{data['move']}"
    ActionCable.server.broadcast("Match_#{data['match']}", data.to_json)
  end

  # finish match manually for testings
  def finish_match(data)
    c_match = Match.find_by(id: data['match'])
    c_match.finished = true
    c_match.save!
    ActionCable.server.broadcast("Match_#{data['match']}", {action: 'Match Finished'})
  end

=begin
  ball and paddles in server side to share with the clients ?
  
  def self.game_loop(match_id)
    @@match.push({
      :players => {
        :left_player => {'x' => 30, 'y' => 160},
        :right_player => {'x' => 570, 'y' => 160}
      }
    })
    ActionCable.server.broadcast("Match_#{match_id}", data)
  end
=end
end
