class LoopGameJob < ApplicationJob
    queue_as :default

    def perform(match_id)
        game = Pong.get_game(match_id)
        match = game.get_match
        while !match.finished
            game.send_moves
            sleep 0.05
            match = game.get_match
        end
    end
end