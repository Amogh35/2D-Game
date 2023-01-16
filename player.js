import {Sitting, Running, Jumping, Falling, Rolling, Diving, Hit} from './playerState.js'
import {CollisionAnimation} from './collisionAnimation.js'

export  class Player{
    constructor(game){
        this.game=game;
        /*taking a 200px square from the sprite sheet we loaded, player.png */
        this.width=100;
        this.height=91.3;
        /*initial position of the player */
        this.x=0;
        this.y=this.game.height - this.height - this.game.groundMargin;
        this.image=document.getElementById('player');
        //to navigate among the player actions in player.png
        this.frameX=0;
        this.frameY=0;
        this.maxFrame;
        //to implement the speed of player with update()
        this.speed=0;
        this.maxSpeed=10;
        this.vy=0;
        //adding gravity
        this.weight=1;
        //setting how fast the player appears to be running
        this.fps=20;//this particular sheet works best for 20 fps
        this.frameTimer=0;//every time it reaches frameInterval it will switch to next frame and reset to 0
        this.frameInterval=1000/this.fps;//one frame should stay for this much time

        //array needs to be in same order as enum in playerState
        this.states=[new Sitting(this.game), new Running(this.game),new Jumping(this.game), 
            new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)];
        
    }

/*context argument defines which canvas we havr to draw on */
    draw(context){
        //context.fillStyle='white';
        //context.fillRect(this.x,this.y,this.width,this.height);

        //debug mode to detect collisions
        if(this.game.debug){
        context.strokeStyle='white';
        context.strokeRect(this.x,this.y,this.width,this.height);
        context.beginPath();
        context.arc(this.x+this.width/2,this.y+this.height/2,this.width/2,0,Math.PI*2);
        context.stroke();
        // context.strokeStyle='blue';
        // context.beginPath();
        // context.arc(this.x,this.y,this.width/2,0,Math.PI*2);
        // context.stroke();
        }
        //loading enemy image

        //second line arguments are to make only one player depending on the action(with frameX,frameY)
        //appear instead of entire image
        //next line 4 arguments are to make the image on the player canvas
        context.drawImage(this.image,
            this.frameX * this.width,this.frameY * this.height,this.width,this.height,
            this.x,this.y,this.width,this.height);
    }
    update(input,deltaTime){
        this.checkCollision()
        //to keep checking the keys pressed and when to exit the state
        this.currentState.handleInput(input);

        //moving player according to the key pressed
        if(input.includes('ArrowRight') && this.currentState !== this.states[6]){
            this.speed=this.maxSpeed;
        }
        else if(input.includes('ArrowLeft') && this.currentState !== this.states[6]){
            this.speed=-this.maxSpeed;
        }
        else{
            this.speed=0;
        }

        //horizontal movement
        this.x+=this.speed;
        //setting a horizontal boundary so that player doesnt go off screen
        if(this.x<0)    this.x=0;
        else if(this.x>this.game.width - this.width)  this.x=this.game.width- this.width;

        //vertical movement;
        //player can only jump when he is on the ground
        this.y+=this.vy;
        if(!this.onGround()){
            this.vy+=this.weight;
            //to animate the player jumping
            //sprite sheet has only 5 frames for jumping
            //this.maxFrame=5;
            //this.frameY=1;
        }
        else {
            this.vy=0;
            //this.maxFrame=8
            //this.frameY=0;
        }
        //setting a vertical boundary
        if(this.y>this.game.height-this.height-this.game.groundMargin)  this.y=this.game.height-this.height-this.game.groundMargin;
        else if(this.y<0)   this.y=0;

        //sprite animation
        if(this.frameTimer>this.frameInterval){
            if(this.frameX>=this.maxFrame) this.frameX=0;
            else    this.frameX++;

            this.frameTimer=0;
        }
            else    this.frameTimer+=deltaTime;
        // if(this.frameX< this.maxFrame)  this.frameX++;
        // else this.frameX=0
    }
   
    //checking if player is on ground or not
    onGround(){
        return this.y >= this.game.height-this.height-this.game.groundMargin;
    }

    setState(state,speed){
        this.currentState=this.states[state];
        this.game.speed=this.game.maxSpeed*speed;
        this.currentState.enter();
    }

    checkCollision(){
    //rectangular collision detection
        // this.game.enemies.forEach(enemy => {
        //     if (enemy.x< this.x + this.width &&
        //         enemy.x + enemy.width > this.x &&
        //         enemy.y < this.y + this.height &&
        //         enemy.y + enemy.height > this.y){
        //             enemy.markedForDeletion=true;
        //             this.game.score++;
        //         }
        // })

    //circular collision detection
        this.game.enemies.forEach(enemy =>{
        //calc horizontal and vertical dist between the centres
        //of enemy and player class for circular collision detection
            
    //since the coordinates here are of top left corner of the canvas
    //we need to offset it by half of its width and height
            const dx=(enemy.x +enemy.width/2)-(this.x + this.width/2);
            const dy=(enemy.y + enemy.height/2)-(this.y +this.height/2);
    //applying pythagoras theorem to find actual dist between centres
            const dist=Math.sqrt(dx*dx + dy*dy);
    //radius of the circle around each class would be half of
    //width as the heads and legs are not that wide,
    //if they were wide we would use rectangle collision detection
            if(dist < enemy.width/2 + this.width/2){
                //enemy gets deleted no matter what
            enemy.markedForDeletion=true;
            this.game.collisions.push(new CollisionAnimation(this.game,
                enemy.x + enemy.width*0.5, 
                enemy.y +enemy.height*0.5));
            //for rolling or diving state
            if(this.currentState === this.states[4] || 
                this.currentState === this.states[5]){
                this.game.score++;
            }
            else{
                //set it to hit state and put game speed=0
                this.setState(6,0);
            }
            }
        })
    }
}