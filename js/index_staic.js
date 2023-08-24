addEventListener('load', function () {
    const canvas = document.getElementById('canvas1');
    const overlay = document.getElementById('overlay');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280;
    canvas.height = 720;

    ctx.fillStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeStyle = "black";
    ctx.font = '40px Helvetica';
    ctx.textAlign = 'center';

    class Player {
        constructor(game){
            this.game = game;
            this.spriteImage = new Image()
            this.spriteImage.src = '../img/bull.png',
            this.collision = {
                x: game.width * 0.5,
                y: game.height * 0.5,
                radius: 45
            };
            this.speed = {
                x: 0,
                y: 0,
                modofier: 5
            }
            this.dist = {
                x: 0,
                y: 0
            };
            this.sprite = {
                image: this.spriteImage,
                width: 255,
                height: 256,
                frame: {
                    x: 0,
                    y: 0
                }
            }
            this.width = this.sprite.width;
            this.height = this.sprite.height;
        }
        restart(){
            console.log("Player Restart");
            this.collision.x = this.game.width * 0.5;
            this.collision.y = this.game.height * 0.5;
            this.spriteX = this.collision.x - this.width * 0.5;
            this.spriteY = this.collision.y - this.height * 0.5 -100;
        }
        draw(context){
            context.drawImage(
                this.sprite.image,
                this.sprite.frame.x * this.sprite.width,
                this.sprite.frame.y * this.sprite.height,
                this.sprite.width,
                this.sprite.height,
                this.spriteX, 
                this.spriteY, 
                this.width, 
                this.height
            );
            if(this.game.debug){
                context.beginPath();
                context.arc(this.collision.x, this.collision.y, this.collision.radius, 0, Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
                context.beginPath();
                context.moveTo(this.collision.x, this.collision.y);
                context.lineTo(this.game.mouse.x, this.game.mouse.y);
                context.stroke();
            }

        }
        update(){
            // Sprite aniamtion
            this.dist.x = this.game.mouse.x - this.collision.x;
            this.dist.y = this.game.mouse.y - this.collision.y;
            const angle = Math.atan2(this.dist.y, this.dist.x);
            if(angle <  -2.74|| angle > 2.74) this.sprite.frame.y = 6;
            else if(angle < -1.17) this.sprite.frame.y = 0;
            else if(angle < -1.96) this.sprite.frame.y = 7;
            else if(angle < -0.39) this.sprite.frame.y = 1;
            else if(angle <  0.39) this.sprite.frame.y = 2;
            else if(angle <  1.17) this.sprite.frame.y = 3;
            else if(angle <  1.96) this.sprite.frame.y = 4;
            else if(angle <  2.74) this.sprite.frame.y = 5;
            
            this.spriteX = this.collision.x - this.width * 0.5;
            this.spriteY = this.collision.y - this.height * 0.5 -100;

            const distance = Math.hypot(this.dist.y, this.dist.x);  
            if(distance > this.speed.modofier){
                this.speed.x = this.dist.x / distance || 0;
                this.speed.y = this.dist.y / distance || 0;
            } else {
                this.speed.x = 0;
                this.speed.y = 0;
            }      
            this.collision.x += this.speed.x * this.speed.modofier;
            this.collision.y += this.speed.y * this.speed.modofier;

            // horizontal boundaries
            if(this.collision.x < this.collision.radius){
                this.collision.x = this.collision.radius;
            }else if(this.collision.x > this.game.width - this.collision.radius){
                this.collision.x = this.game.width - this.collision.radius;
            }
            // vertical boundarie
            if(this.collision.y <  this.game.topMargin + this.collision.radius){
                this.collision.y = this.game.topMargin + this.collision.radius
            } else if( this.collision.y > this.game.height - this.collision.radius ){
                this.collision.y = this.game.height - this.collision.radius;
            }

            // collisions with obstacles
            this.game.obstacles.forEach(obstacle => {
                const {isCollision, distance, sumOfRadii, dx, dy} = this.game.checkCollision(this, obstacle);

                if(isCollision){
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;
                    this.collision.x = obstacle.collision.x + (sumOfRadii + 1) * unit_x;
                    this.collision.y = obstacle.collision.y + (sumOfRadii + 1) * unit_y
                }
            });
        }
    }

    class Obstacles{
        constructor(game){
            this.game = game;
            this.spriteImage = new Image()
            this.spriteImage.src = '../img/obstacles.png',
            this.collision = {
                x: Math.random() * this.game.width,
                y: Math.random() * this.game.height,
                radius: 60
            }
            this.sprite = {
                image: this.spriteImage,
                width:  250,
                height: 250,
                frame: {
                    x: Math.floor(Math.random() * 4),
                    y: Math.floor(Math.random() * 3)
                }
            }
            this.width = this.sprite.width;
            this.height = this.sprite.height;
            this.spriteX = this.collision.x - this.width * 0.5;
            this.spriteY = this.collision.y - this.height * 0.5 -70;
        }
        draw(context){
            // Draw obstacle sprite
            context.drawImage(
                this.sprite.image,
                this.sprite.frame.x * this.sprite.width,
                this.sprite.frame.y * this.sprite.height,
                this.sprite.width,
                this.sprite.height,
                this.spriteX, 
                this.spriteY, 
                this.width, 
                this.height
            );
            // Debug mode draw hit zone on key press "d"
            if(this.game.debug){
                context.beginPath();
                context.arc(this.collision.x, this.collision.y, this.collision.radius, 0, Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke(); 
            }

        }
        update(){

        }
    }

    class Egg {
        constructor(game){
            this.game = game;
            this.spriteImage = new Image();
            this.spriteImage.src = '../img/egg.png';
            // this.margin = this.collision.radius * 2;
            this.margin = 80;
            this.collision = {
                x: this.margin + (Math.random() * (this.game.width - this.margin * 2)),
                y: this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin - this.margin)),
                radius: 40
            }
            
            this.sprite = {
                image: this.spriteImage,
                width:  110,
                height: 135,
                frame: {
                    x: 0,
                    y: 0
                }
            }
            this.width = this.sprite.width;
            this.height = this.sprite.height;
            this.spriteX;
            this.spriteY;
            this.hatchTimer = 0;
            this.hatchInterval = 5000;
            this.marckedForDeletion = false;
        }
        draw(context){
            context.drawImage(
                this.sprite.image,
                this.spriteX,
                this.spriteY
            );
            // Debug mode draw hit zone on key press "d"
            if(this.game.debug){
                context.beginPath();
                context.arc(this.collision.x, this.collision.y, this.collision.radius, 0, Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke();
                context.fillText(Math.floor(this.hatchTimer * 0.001) , this.collision.x, this.collision.y - this.collision.radius * 3)
            }
        }
        update(deltaTime){
            
            // Collisions
            this.spriteX = this.collision.x - this.width * 0.5;
            this.spriteY = this.collision.y - this.height * 0.5 -30;
            let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.enemies];
            collisionObjects.forEach(object => {
                const {isCollision, distance, sumOfRadii, dx, dy} = this.game.checkCollision(this, object);
                if(isCollision){
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;
                    this.collision.x = object.collision.x + (sumOfRadii + 1) * unit_x;
                    this.collision.y = object.collision.y + (sumOfRadii + 1 ) * unit_y;
                }
            });
            // Hatching 
            if(this.hatchTimer > this.hatchInterval || this.collision.y < this.game.topMargin){
                this.game.hatchlings.push(new Larva(this.game, this.collision.x, this.collision.y));
                this.marckedForDeletion = true;
                this.game.removeGameObjects();
                this.hatchTimer = 0;
            } else {
                this.hatchTimer += deltaTime;
            }
        }
    }

    class Larva {
        constructor(game, x, y){
            this.game = game;
            this.spriteImage = new Image();
            this.spriteImage.src = '../img/larva.png';
            this.collision = { 
                x: x,
                y: y,
                radius: 30
            }
            this.sprite = {
                image: this.spriteImage,
                width:  150,
                height: 150,
                frame: {
                    x: 0,
                    y: Math.floor(Math.random() * 2)
                }
            }
            this.speed = {
                x: 0,
                y: 1 + Math.random()
            }
            this.width = this.sprite.width;
            this.height = this.sprite.height;
            this.spriteX;
            this.spriteY;
        }
        draw(context){
            context.drawImage(
                this.sprite.image,
                this.sprite.frame.x * this.sprite.width,
                this.sprite.frame.y * this.sprite.height,
                this.sprite.width,
                this.sprite.height,
                this.spriteX,
                this.spriteY,
                this.width,
                this.height
            );
            // Debug mode draw hit zone on key press "d"
            if(this.game.debug){
                context.beginPath();
                context.arc(this.collision.x, this.collision.y, this.collision.radius, 0, Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke(); 
            }
        }
        update(){
            this.collision.y -= this.speed.y;
            this.spriteX = this.collision.x - this.width * 0.5;
            this.spriteY = this.collision.y - this.height * 0.5 - 50;
            // Moved to safety
            if(this.collision.y < this.game.topMargin){
                this.marckedForDeletion = true;
                this.game.removeGameObjects();
                for (let i = 0; i < 3; i++) {
                    this.game.particles.push(new FireFly(
                        this.game,
                        this.collision.x,
                        this.collision.y,
                        'yellow'
                    )); 
                }
                if(!this.game.gameOver) this.game.score++;
            }
            // Collisions
            let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.eggs];
            collisionObjects.forEach(object => {
                const {isCollision, distance, sumOfRadii, dx, dy} = this.game.checkCollision(this, object);
                if(isCollision){
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;
                    this.collision.x = object.collision.x + (sumOfRadii + 1) * unit_x;
                    this.collision.y = object.collision.y + (sumOfRadii + 1 ) * unit_y;
                }
            });
            // Collisions with Enemies
            this.game.enemies.forEach(enemy=>{
                if(this.game.checkCollision(this, enemy).isCollision && !this.game.gameOver){
                    this.marckedForDeletion = true;
                    this.game.removeGameObjects();
                    for (let i = 0; i < 3; i++) {
                        this.game.particles.push(new Spark(
                            this.game,
                            this.collision.x,
                            this.collision.y,
                            'blue'
                        )); 
                    }
                    this.game.lostHatchlings++;
                }
            });

        }
    }

    class Enemy{
        constructor(game){
            this.game = game;
            this.speed = {
                x: 3,
            }
            this.spriteX;
            this.spriteY;            
        }
        draw(context){
            context.drawImage(
                this.sprite.image,
                this.sprite.frame.x * this.sprite.width,
                this.sprite.frame.y * this.sprite.height,
                this.sprite.width,
                this.sprite.height,
                this.spriteX,
                this.spriteY,
                this.width,
                this.height
            );
            // Debug mode draw hit zone on key press "d"
            if(this.game.debug){
                context.beginPath();
                context.arc(this.collision.x, this.collision.y, this.collision.radius, 0, Math.PI * 2);
                context.save();
                context.globalAlpha = 0.5;
                context.fill();
                context.restore();
                context.stroke(); 
            }
        }
        update(){
            this.spriteX = this.collision.x - this.width * 0.5;
            this.spriteY = this.collision.y - this.height + 40;
            this.collision.x -= this.speed.x;
            if(this.spriteX + this.width < 0 && !this.game.gameOver){
                this.collision.x = this.game.width + this.width + Math.random() * this.game.width * 0.5;
                this.collision.y = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin));
                this.sprite.frame.x = Math.floor(Math.random() * 2);
                this.sprite.frame.y = Math.floor(Math.random() * 4);
            }
            let collisionObjects = [this.game.player, ...this.game.obstacles] ;
            collisionObjects.forEach(object => {
                const {isCollision, distance, sumOfRadii, dx, dy} = this.game.checkCollision(this, object);
                if(isCollision){
                    const unit_x = dx / distance;
                    const unit_y = dy / distance;
                    this.collision.x = object.collision.x + (sumOfRadii + 1) * unit_x;
                    this.collision.y = object.collision.y + (sumOfRadii + 1 ) * unit_y;
                }
            });
        }
    }

    class ToadSkin extends Enemy {
        constructor(game){
            super(game);
            this.spriteImage = new Image();
            this.spriteImage.src = '../img/toads.png';
            this.sprite = {
                image: this.spriteImage,
                width:  140,
                height: 260,
                frame: {
                    x: Math.floor(Math.random() * 2),
                    y: Math.floor(Math.random() * 4)
                }
            }
            this.width = this.sprite.width;
            this.height = this.sprite.height;
            this.collision = {
                x: this.game.width + this.width + Math.random() * this.game.width * 0.5,
                y: this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin )),
                radius: 30
            }
        }
    }

    class BarkSkin extends Enemy {
        constructor(game){
            super(game);
            this.spriteImage = new Image();
            this.spriteImage.src = '../img/bark.png';
            this.sprite = {
                image: this.spriteImage,
                width:  183,
                height: 280,
                frame: {
                    x: Math.floor(Math.random() * 2),
                    y: Math.floor(Math.random() * 4)
                }
            }
            this.width = this.sprite.width;
            this.height = this.sprite.height;
            this.collision = {
                x: this.game.width + this.width + Math.random() * this.game.width * 0.5,
                y: this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin )),
                radius: 30
            }
        }
    }

    class Particles {
        constructor(game, x, y, color){
            this.game = game;
            this.collision = {
                x: x,
                y: y,
                radius: Math.floor(Math.random() * 5 + 3)
            }
            this.speed = {
                x: Math.random() * 6 - 3,
                y: Math.random() * 2 + 0.5,
            }
            this.color = color;
            this.angle = 0;
            this.va = Math.random() * 0.1 + 0.1;
            this.marckedForDeletion = false;
        }
        draw(context){
            context.save();
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(
                this.collision.x, 
                this.collision.y, 
                this.collision.radius,
                0,
                Math.PI * 2
            );
            context.fill();
            context.stroke()
            context.restore();
        }
    }

    class FireFly extends Particles {
        update(){
            this.angle += this.va;
            this.collision.x += Math.cos(this.angle) * this.speed.x;
            this.collision.y -=  this.speed.y;
            if( this.collision.y < 0 - this.collision.radius){
                this.marckedForDeletion = true;
                this.game.removeGameObjects();
            }
        }
    }

    class Spark extends Particles {
        update(){
            this.angle += this.va * 0.5;
            this.collision.x -= Math.cos(this.angle) * this.speed.x;
            this.collision.y -= Math.sign(this.angle) * this.speed.y;
            if(this.collision.radius > 0.1) this.collision.radius -= 0.05;
            if(this.collision.r < 0.2){
                this.marckedForDeletion = true;
                this.game.removeGameObjects();
            }
        }
    }

    class Game {
        constructor(canvas, overlay){
            this.debug = true;
            this.canvas = canvas;
            this.overlay = overlay;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.fps = 70;
            this.timer = 0;
            this.interval = 1000/this.fps;
            this.topMargin = 260
            this.numberOfObstacles = 10;
            this.score = 0;
            this.winningScore = 500;
            this.gameOver = false;
            this.obstacles = [];
            this.eggTimer = 0;
            this.eggInterval = 500;
            this.maxEggs = 10;
            this.eggs = [];
            this.hatchlings = [];
            this.lostHatchlings = 0;
            this.enemies = [];
            this.particles = [];
            this.gameObjects = [];
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                perssed: false
            };

            // event listeners
            this.overlay.addEventListener('mousedown', (e)=>{
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.perssed = true;
            });
            this.overlay.addEventListener('mouseup', (e)=>{
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.perssed = false;
            });
            this.overlay.addEventListener('mousemove', (e)=>{
                if(this.mouse.perssed){
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;
                }
            });
            addEventListener('keydown', (e)=>{
                if(e.key === 'd') this.debug = !this.debug;
                if(e.key === 'r') this.restart();
                if(e.key === 'c') console.log(this.gameObjects);
                if(e.key === 'f') this.toggleFullScreen();
            });            
        };
        toggleFullScreen(){
            if(!document.fullscreenElement){
                document.documentElement.requestFullscreen();
            } else if (document.exitFullscreen){
                document.exitFullscreen();
            }
        }
        render(context, deltaTime){
            if(this.timer > this.interval){
                ctx.clearRect(0, 0, this.width, this.height);
                this.gameObjects = [
                    this.player,
                    ...this.eggs, 
                    ...this.obstacles,
                    ...this.enemies,
                    ...this.hatchlings,
                    ...this.particles
                ];
                this.gameObjects.sort((a, b)=>{
                    return a.collision.y - b.collision.y
                });
                this.gameObjects.forEach(object => {
                    object.draw(context);
                    object.update(deltaTime);
                });
                this.timer = 0;
            }
            this.timer += deltaTime;
            // Add eggs periodically
            if(this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs && !this.gameOver){
                this.addEgg();
                this.eggTimer = 0;
            } else { 
                this.eggTimer += deltaTime;
            }
            context.save();
            context.textAlign = "left";
            context.fillText(`Score: ${this.score}`, 25, 50);
            if(this.debug) context.fillText(`Lost: ${this.lostHatchlings}`, 25, 100);
            context.restore();
            if(this.score >= this.winningScore){
                context.save();
                context.fillStyle = 'rgba(0, 0, 0, 0.5)';
                context.fillRect(0, 0, this.width, this.height);
                context.fillStyle = 'white';
                context.textAlign = 'center';
                context.shadowOffsetX = 4;
                context.shadowOffsetY = 4;
                context.shadowOffsetX = "black";
                let message1;
                let message2;
                if (this.lostHatchlings <= 5) {
                    this.gameOver = true;
                    message1 = "Bullseye!";
                    message2 = "You bullied the bullies";
                } else {
                    message1 = "Bullocks!";
                    message2 = `You lost! Hatchlings lost ${this.lostHatchlings} do better next time`;
                }
                context.font = '130px Helvetica';
                context.fillText(message1, this.width * 0.5, this.height * 0.5 -30);
                context.font = '40px Helvetica';
                context.fillText(message2, this.width * 0.5, this.height * 0.5 + 30);
                context.fillText(`You save ${this.score} hatchings. Press "R" to play again.`, this.width * 0.5,
                this.height * 0.5 + 80);
                context.restore();
            }
        }
        checkCollision(a, b){
            const dx = a.collision.x - b.collision.x;
            const dy = a.collision.y - b.collision.y;
            const distance = Math.hypot(dy, dx);
            const sumOfRadii = a.collision.radius + b.collision.radius;
            return { isCollision: (distance < sumOfRadii), distance, sumOfRadii, dx, dy }
        }
        addEgg(){
            this.eggs.push(new Egg(this));
        }
        addEnemy(){
            if(Math.random() < 0.5) this.enemies.push(new ToadSkin(this));
            else this.enemies.push(new BarkSkin(this));
        }
        removeGameObjects(){
            this.eggs = this.eggs.filter( object => !object.marckedForDeletion);
            this.hatchlings = this.hatchlings.filter( object => !object.marckedForDeletion);
            this.particles = this.particles.filter( object => !object.marckedForDeletion);
        }
        restart(){
            console.log("Game Restart");
            this.player.restart();
            this.obstacles = [];
            this.eggs = [];
            this.enemies = [];
            this.hatchlings = [];
            this.particles = [];
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                perssed: false
            }
            this.score = 0;
            this.lostHatchlings = 0;
            this.gameOver = false;
            this.init();
        }
        init(){
            for (let i = 0; i < 3; i++) {
                this.addEnemy();
            }
            let attempts = 0;
            // initialize obstacles
            while (this.obstacles.length < this.numberOfObstacles && 
                attempts < 500) {
                let testObstacle = new Obstacles(this);
                let overlap = false
                this.obstacles.forEach(obstacle => {
                    const dx = testObstacle.collision.x - obstacle.collision.x;
                    const dy = testObstacle.collision.y - obstacle.collision.y;
                    const distance = Math.hypot(dy, dx);
                    const distanceBuffer = 100;
                    const sumOfRadii = testObstacle.collision.radius + obstacle.collision.radius + distanceBuffer;
                    if( distance < sumOfRadii ){
                        overlap = true;
                    }
                });
                const margin = testObstacle.collision.radius * 2;
                if(!overlap && 
                    testObstacle.spriteX > 0 && 
                    testObstacle.spriteX < this.width - testObstacle.width &&
                    testObstacle.spriteY > 0 && 
                    testObstacle.collision.y > this.topMargin + margin &&
                    testObstacle.collision.y < this.height - margin
                    ){
                    this.obstacles.push(testObstacle);
                }
                attempts++;
            }
        }
    }

    const game = new Game(canvas, overlay);
    game.init();

    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        // ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.render(ctx, deltaTime);
       requestAnimationFrame(animate);
    }
    animate(0)
});