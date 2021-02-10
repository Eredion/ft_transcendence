class Pong
    include ActiveModel::Model

    @@matches = {}

    def initialize(match_id)
        p "New match creation id #{match_id}"
        @match = Match.find_by(id: match_id)
        @canvas_height = 400
        @canvas_width = 600
        # create a Paddle class?
        @paddles = Array.new(2)
        @paddles[0] = { "x" => 10, "y" => 160, "h" => 80 }
        @paddles[1] = { "x" => 390, "y" => 160, "h" => 80 }
        @paddle_speed = 8
        # create a job to manage the match loop
        LoopGameJob.perform_later(match_id)
    end

    def move_paddles(side, move)
        if side == 'left'
            actor = @paddles[0]
        else
            actor = @paddles[1]
        end
        if move == 1 && actor['y'].to_i > 0
            actor['y'] -= @paddle_speed
        elsif move == 2 && actor['y'].to_i < (@canvas_height - actor['h'].to_i)
            actor['y'] += @paddle_speed
        end
    end

    def self.set_move(data)
        #puts "match: #{data['match']} from: #{data['from']} side: #{data['side']} move: #{data['move']}"
        pong_match = @@matches[data['match']]
        if pong_match
            pong_match.move_paddles(data['side'], data['move'])
        end
    end

    def send_moves()
        ActionCable.server.broadcast("Match_#{@match.id}", { players: @paddles })
    end

    def self.create_match(match_id)
        if !@@matches.key?(match_id)
            @@matches[match_id] ||= Pong.new(match_id)
        end
        return @@matches[match_id]
    end

    def self.delete_match(match_id)
        @@matches.delete(match_id)
    end

    def self.get_game(id)
        return @@matches[id]
    end

    def get_match()
        return @match
    end

    def finish_match()
        @match.finished = true
        @match.save!
    end

end