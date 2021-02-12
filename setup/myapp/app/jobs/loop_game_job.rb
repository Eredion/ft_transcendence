class LoopGameJob < ApplicationJob
    queue_as :default

    def perform(match_id)
        game = Pong.get_game(match_id)
        loop do
            match = game.get_match
            if match.finished
                break
            end
            game.move_ball
            game.send_moves
            sleep 0.04 # 25fps
        end
    end
end