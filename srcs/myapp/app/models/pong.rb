class Pong

    @@matches = {}
    @@winning_score = 3

    def initialize(match_id)
        p "New match creation id #{match_id}"
        @match = Match.find_by(id: match_id)
        @canvas_height = 300
        @canvas_width = 600
        @paddles = Array.new(2)
        @paddles[0] = Paddle.new(@canvas_width, @canvas_height, 0) # left paddle
        @paddles[1] = Paddle.new(@canvas_width, @canvas_height, 1) # right paddle
        @ball = Ball.new(@canvas_width, @canvas_height)
        ActionCable.server.broadcast('active_matches', { action: 'update_matches' })
        LoopGameJob.perform_later(match_id)
    end

    def move_ball

        if @ball.x + @ball.radius >= @canvas_width || @ball.x - @ball.radius <= 0
            @ball.angle = Math::PI - @ball.angle
        end
        if @ball.x - @ball.radius <= 0
            @match.right_score += 1
            @match.save
            @ball.reset
            @ball.angle = 0
            @paddles[0].reset
            @paddles[1].reset
        elsif @ball.x + @ball.radius >= @canvas_width
            @match.left_score += 1
            @match.save
            @ball.reset
            @ball.angle = Math::PI
            @paddles[0].reset
            @paddles[1].reset
        elsif @ball.y + @ball.radius >= @canvas_height || @ball.y - @ball.radius <= 0
            @ball.angle = 2 * Math::PI - @ball.angle
        else
            @ball.check_collision(@paddles[0])
            @ball.check_collision(@paddles[1])
        end
        if @match.right_score == @@winning_score || @match.left_score == @@winning_score
            if @match.right_score > @match.left_score
                @match.winner = @match.right_player
                @match.loser = @match.left_player
            else
                @match.winner = @match.left_player
                @match.loser = @match.right_player
            end
            @match.finished = true
            @match.save!
            return
        end
        @ball.calculate_direction
    end

    def move_paddles(side, move)
        paddle = side == 'l' ? @paddles[0] : @paddles[1]
        if move == 1
            paddle.move_up
        elsif move == 2
            paddle.move_down
        end
    end

    def self.set_move(data)
        #puts "match: #{data['match']} from: #{data['from']} side: #{data['side']} move: #{data['move']}"
        if pong_match = @@matches[data['match']]
            pong_match.move_paddles(data['side'], data['move'])
        end
    end

    def send_moves()
        ActionCable.server.broadcast("Match_#{@match.id}", {
            actors: {
                players: [
                    {
                        x: @paddles[0].x,
                        y: @paddles[0].y
                    },
                    {
                        x: @paddles[1].x,
                        y: @paddles[1].y
                    }
                ],
                ball: {
                    x: @ball.x,
                    y: @ball.y
                },
                score: {
                    left: @match.left_score,
                    right: @match.right_score
                }
            }
        })
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
