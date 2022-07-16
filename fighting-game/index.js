const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const GRAVITY = 0.5
const X_SPEED = 3

canvas.width = 1024
canvas.height = 576

const keys = {
    // Player
    a : {
        pressed: false
    },
    d : {
        pressed: false
    },

    // Enemy
    leftArrow : {
        pressed: false
    },
    rightArrow : {
        pressed: false
    },


}

c.fillRect(0, 0, canvas.width, canvas.height)

class Sprite {
    constructor({position, velocity, color = 'gray', offset = 0}) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.last_key_pressed
        this.attackBox = {
            height : 50,
            width : 100
        }
        this.color = color
        this.isAttacking
        this.offset = offset
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        if (this.isAttacking) {
            c.fillStyle = 'green'
            c.fillRect(this.position.x + this.offset, this.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        }
        else this.velocity.y += GRAVITY
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100) 
    }
}

const player = new Sprite({
    position : {x:0, y:0},
    velocity : {x:0, y:0}
})

const enemy = new Sprite({
    position : {x:400, y:0},
    velocity : {x:0, y:0},
    color : 'brown',
    offset : -50
})

player.draw()
enemy.draw()

function animate() {
    window.requestAnimationFrame(animate) // Loop animate function
    c.fillStyle = 'black'
    c.fillRect(0,0,canvas.width,canvas.height)
    player.update()
    enemy.update()

    // Player
    player.velocity.x = 0
    enemy.velocity.x = 0

    if (keys.a.pressed && player.last_key_pressed === 'a') {
        player.velocity.x = -X_SPEED
    }
    else if (keys.d.pressed && player.last_key_pressed === 'd') {
        player.velocity.x = X_SPEED
    }

    if (player.position.x + player.attackBox.width >= enemy.position.x &&
        player.position.x <= enemy.position.x + enemy.width &&
        player.position.y + player.attackBox.height >= enemy.position.y &&
        player.position.y <= enemy.position.y + enemy.height &&
        player.isAttacking) {
            player.isAttacking = false
            console.log('yup')
    }

    // Enemy
    if (keys.leftArrow.pressed && enemy.last_key_pressed === 'ArrowLeft') {
        enemy.velocity.x = -X_SPEED
    }
    else if (keys.rightArrow.pressed && enemy.last_key_pressed === 'ArrowRight') {
        enemy.velocity.x = X_SPEED
    }

    if (enemy.position.x - enemy.attackBox.width - enemy.offset <= player.position.x + player.width &&
        enemy.position.x + enemy.width >= player.position.x &&
        enemy.position.y + enemy.attackBox.height >= player.position.y &&
        enemy.position.y <= player.position.y + player.height &&
        enemy.isAttacking) {
            enemy.isAttacking = false
            console.log('yup2')
    }

}

animate()

window.addEventListener('keydown', (event) => {
    switch(event.key) {
        // Player controls
        case 'a':
            keys.a.pressed = true
            player.last_key_pressed = 'a'
            break
        case 'd':
            keys.d.pressed = true
            player.last_key_pressed = 'd'
            break
        case 'w':
            player.velocity.y = -15 
            break
        case ' ':
            player.attack()
            break
        
        // Enemy controls
        case 'ArrowLeft':
            keys.leftArrow.pressed = true
            enemy.last_key_pressed = 'ArrowLeft'
            break
        case 'ArrowRight':
            keys.rightArrow.pressed = true
            enemy.last_key_pressed = 'ArrowRight'
            break
        case 'ArrowUp':
            enemy.velocity.y = -15
            break
        case 'ArrowDown':
            enemy.attack()
            break
    }
})

window.addEventListener('keyup', (event) => {
    switch(event.key) {
        // Player controls
        case 'a':
            keys.a.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break

        // Player controls
        case 'ArrowLeft':
            keys.leftArrow.pressed = false
            break
        case 'ArrowRight':
            keys.rightArrow.pressed = false
            break
    }
})