
import Matches from  '../channels/match_channel'

class Player {
    constructor(x, color, canvas) {
        this.x = x
        this.color = color
        this.w = canvas.width / 100
        this.h = canvas.height / 5
        this.y = canvas.height / 2 - this.h / 2
    }

    draw = (ctx) => {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }

    move = (pos) => {
        this.x = pos['x']
        this.y = pos['y']
    }
}

class Ball {
    constructor(canvas) {
        this.x = canvas.width / 2
        this.y = canvas.height / 2
        this.size = canvas.width / 60
    }

    move = (pos) => {
        this.x = pos['x']
        this.y = pos['y']
    }

    draw = (ctx) => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'green';
        ctx.fill();
    }
}


class Pong {
    constructor(match_id) {
        console.log("Pong game constructor")
        this.canvas = document.getElementById('canvas')
        this.ctx = canvas.getContext('2d')
        this.user = 0
        this.side = null
        this.match = match_id
        this.left_player = new Player(canvas.width * 0.05, 'blue', this.canvas)
        this.right_player = new Player(canvas.width * 0.95, 'red', this.canvas)
        this.ball = new Ball(this.canvas)
        this.lastCalledTime = null;
        this.fps = 0;
        this.update_frames()
    }

    print_fps = () => {
        this.ctx.fillStyle = "white";
        this.ctx.font = "12px Arial";
        this.ctx.fillText("FPS: " + Math.round(this.fps), 500, 20);
    }

    calc_fps = () => {
        if (!this.lastCalledTime) {
            this.lastCalledTime = performance.now()
            this.fps = 0;
            return;
        }
        let delta = (performance.now() - this.lastCalledTime) / 1000;
        this.lastCalledTime = performance.now();
        this.fps = 1 / delta;
        this.print_fps();
    }

    update_frames = () => {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawMiddleLinne()
        this.ball.draw(this.ctx)
        this.left_player.draw(this.ctx)
        this.right_player.draw(this.ctx)
        this.calc_fps()
    }

    send_move = (move) => {
        //connection with channel
        var actor = {
            match: this.match,
            from: this.user,
            side: this.side,
            move: move
        }
        Matches.channel.perform('receive_move', actor)
    }

    update_players = (actors) => {
        this.ball.move(actors['ball'])
        this.left_player.move(actors['players'][0])
        this.right_player.move(actors['players'][1])
        this.update_frames()
    }
/*

    drawPoints = () => {
        const size = (canvas.height / 10).toString()
        this.ctx.font = size + 'px Righteous';
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(this.left_player.points, canvas.width * 0.25, canvas.height * 0.15)
        this.ctx.fillText(this.right_player.points, canvas.width * 0.75, canvas.height * 0.15)
    }
*/
    drawMiddleLinne = () => {
        this.ctx.strokeStyle = '#EEE'
        this.ctx.setLineDash([10, 5])
        this.ctx.beginPath();
        this.ctx.moveTo(canvas.width / 2, 0)
        this.ctx.lineTo(canvas.width / 2, canvas.height)
        this.ctx.stroke();
    }

    keyDown = (key) => {
        if (key.key == 'ArrowUp') {
            this.send_move(1)
            key.preventDefault()
        } else if (key.key == 'ArrowDown') {
            this.send_move(2)
            key.preventDefault()
        }
    }

    keyUp = (key) => {
        if (key.key == 'ArrowUp' || key.key == 'ArrowDown') {
            this.send_move(0)
            key.preventDefault()
        }
    }

    listen = (user_id, side) => {
        this.user = user_id
        this.side = side
        window.addEventListener('keydown', this.keyDown)
        window.addEventListener('keyup', this.keyUp)
    }

    stop = () => {
        window.removeEventListener('keydown', this.keyDown)
        window.removeEventListener('keyup', this.keyUp)
    }
}

export default Pong