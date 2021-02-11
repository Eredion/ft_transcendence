class Paddle

    def initialize(canvas_w, canvas_h, side)
        @canvas_width = canvas_w
        @canvas_height = canvas_h
        @x = side == 1 ? @canvas_width * 0.95 : @canvas_width * 0.05
        @height = @canvas_height / 5
        @width = @canvas_width / 100
        @y = @center = (@canvas_height / 2) - (@height / 2)
        @velocity = 10
    end

    def move_up
        if @y - @velocity >= 0
            @y -= @velocity
        end
    end

    def move_down
        if @y + @height + @velocity <= @canvas_height
            @y += @velocity
        end
    end

    def reset
        @y = @center
    end

    def x
        return @x
    end

    def y
        return @y
    end

    def height
        return @height
    end
end