class Ball

    @@SPEED = 10

    def initialize(canvas_w, canvas_h)
        @canvas_width = canvas_w
        @canvas_height = canvas_h
        @canvas_half = @canvas_width / 2
        @x = @canvas_width / 2
        @y = @canvas_height / 2
        @center = { x: @x, y: @y}
        @radius = @canvas_width / 100
        @angle = -2 * Math::PI
        @speed = @@SPEED
        @dx = 5
        @dy = 0
    end

    def check_collision(paddle)
        if (paddle.x < @canvas_half && @x - @radius <= paddle.x + paddle.width && @x + @radius > paddle.x) ||
            (paddle.x > @canvas_half && @x + @radius >= paddle.x && @x - @radius < paddle.x + paddle.width)
            if @y + @radius >= paddle.y && @y <= paddle.y + paddle.height
                #@speed *= 1.02
                # calculate bounce angle
                paddle_center = paddle.y + (paddle.height / 2)
                offset = (paddle_center - @y) / paddle.height
                @angle = - offset * (Math::PI * 0.42)
                if paddle.x > @canvas_half
                    @angle = Math::PI - @angle
                end
            end
        end
    end

    def calculate_direction
        if @angle > (2 * Math::PI)
            @angle = @angle % (2 * Math::PI)
        end
        @dx = Math.cos(@angle) * @speed
        @dy = Math.sin(@angle) * @speed
        @x += @dx
        @y += @dy
    end

    def reset
        @x = @center[:x]
        @y = @center[:y]
        @speed = @@SPEED
    end

    def x
        return @x
    end

    def y
        return @y
    end

    def radius
        return @radius
    end

    def angle
        return @angle
    end

    def angle=(value)
        @angle = value
    end
end