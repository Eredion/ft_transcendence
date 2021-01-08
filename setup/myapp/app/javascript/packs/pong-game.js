

class Player {

    constructor(x, color) {
        this.x = x
        this.color = color
        this.w = canvas.width / 100
        this.h = canvas.height / 5
        this.y = canvas.height / 2 - this.h / 2
        this.speed = 5
        this.move_up = 0
        this.move_down = 0
        this.points = 0
    }

    get up() {
        return this.move_up
    }

    set up(val) {
        this.move_up = val
    }

    get down() {
        return this.move_down
    }

    set down(val) {
        this.move_down = val
    }

    draw = (ctx) => {
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.w, this.h)
    }

    move = (canvas) => {
        if (this.move_up == 1 && this.y > 0)
            this.y -= this.speed
        if (this.move_down == 1 && this.y < (canvas.height - this.h))
            this.y += this.speed
    }

    reset = (canvas) => {
        this.w = canvas.width / 100
        this.h = canvas.height / 5
        this.y = canvas.height / 2 - this.h / 2
    }
}

class Ball {
    constructor(canvas) {
        this.x = canvas.width / 2
        this.y = canvas.height / 2
        this.speed = 5
        this.size = canvas.width / 60
        this.angle = -2 * Math.PI
        this.speed = 5
        this.dx = 5
        this.dy = 0
    }

    resetPos(canvas) {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.speed = 5;
    }

    draw = (ctx) => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'green';
        ctx.fill();
    }

    calcDir = () => {
        if (this.angle > (2 * Math.PI))
            this.angle = this.angle % (2 * Math.PI)
        this.dx = Math.cos(this.angle) * this.speed
        this.dy = Math.sin(this.angle) * this.speed
    }
}

class Pong {
    constructor() {
        console.log("Pong game constructor")
        this.canvas = document.getElementById('canvas')
        this.ctx = canvas.getContext('2d')
        this.p1 = new Player(canvas.width * 0.05, 'blue')
        this.p2 = new Player(canvas.width * 0.95, 'red')
        this.ball = new Ball(this.canvas)

        this.ctx.clearRect(0, 0, canvas.width, canvas.height)
		this.drawMiddleLinne()
        this.p1.draw(this.ctx)
        this.p2.draw(this.ctx)
    }

    gameLoop = () => {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.drawMiddleLinne()
        this.drawPoints()
        this.p1.draw(this.ctx)
        this.p2.draw(this.ctx)
        this.ball.draw(this.ctx)
        this.moveBall()
        this.p1.move(this.canvas)
        this.p2.move(this.canvas)
        requestAnimationFrame(this.gameLoop);
    }

    moveBall = () => {
        if (this.ball.x + this.ball.size >= canvas.width || this.ball.x - this.ball.size <= 0) {
            this.ball.angle = Math.PI - this.ball.angle
        }
        if (this.ball.x - this.ball.size <= 0) {
            this.ball.resetPos(this.canvas);
            this.ball.angle = 0
            this.p2.points += 1
            this.p1.reset(this.canvas)
            this.p2.reset(this.canvas)
        } else if (this.ball.x + this.ball.size >= canvas.width) {
            this.ball.resetPos(this.canvas);
            this.ball.angle = Math.PI;
            this.p1.points += 1
            this.p1.reset(this.canvas)
            this.p2.reset(this.canvas)
        } else if (this.ball.y + this.ball.size >= canvas.height || this.ball.y - this.ball.size <= 0)
            this.ball.angle = 2 * Math.PI - this.ball.angle
        else {
            this.checkCollistion(this.p1, this.ball)
            this.checkCollistion(this.p2, this.ball)
        }
        this.ball.calcDir()
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;
    }

    calculateBounceAngle = (player, ball) => {
        const playerMiddle = player.y + (player.h / 2);
        const offset = (playerMiddle - ball.y) / (player.h);
        ball.angle = -offset * (Math.PI * 0.42);
        if (player.x > canvas.width / 2)
            ball.angle = Math.PI - ball.angle
    }

    checkCollistion = (player, ball) => {
        if (ball.y + ball.size >= player.y && ball.y - ball.size <= player.y + player.h) {
            if ((player.x < canvas.width / 2 && ball.x - ball.size <= player.x) ||
                (player.x > canvas.width / 2 && ball.x + ball.size >= player.x)) {
                ball.speed *= 1.02
                console.log(ball.speed)
                this.calculateBounceAngle(player, ball);
            }
        }
    }

    drawPoints = () => {
        const size = (canvas.height / 10).toString()
        this.ctx.font = size + 'px Righteous';
        this.ctx.strokeStyle = 'black';
        this.ctx.fillStyle = 'black';
        this.ctx.fillText(this.p1.points, canvas.width * 0.25, canvas.height * 0.15)
        this.ctx.fillText(this.p2.points, canvas.width * 0.75, canvas.height * 0.15)
    }

    drawMiddleLinne = () => {
        this.ctx.strokeStyle = '#EEE'
        this.ctx.setLineDash([10, 5])
        this.ctx.beginPath();
        this.ctx.moveTo(canvas.width / 2, 0)
        this.ctx.lineTo(canvas.width / 2, canvas.height)
        this.ctx.stroke();
    }

    keyDown = (key) => {
        if (key.key == 'ArrowUp')
            this.p2.up = 1
        if (key.key == 'ArrowDown')
            this.p2.down = 1
        if (key.key == 'w')
            this.p1.up = 1
        if (key.key == 's')
            this.p1.down = 1
        key.preventDefault()
    }

    keyUp = (key) => {
        if (key.key == 'ArrowUp')
            this.p2.up = 0
        if (key.key == 'ArrowDown')
            this.p2.down = 0
        if (key.key == 'w')
            this.p1.up = 0
        if (key.key == 's')
            this.p1.down = 0
        key.preventDefault()
    }

    listen = () => {
        window.addEventListener('keydown', this.keyDown)
        window.addEventListener('keyup', this.keyUp)
    }

    stop = () => {
        window.removeEventListener('keydown', this.keyDown)
        window.removeEventListener('keyup', this.keyUp)
    }
}

export default Pong