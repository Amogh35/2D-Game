class Enemy {
    constructor(){
        this.frameX=0;
        this.frameY=0;
        //the max frame of this sprite sheet is 5
        this.maxFrame=5;
        //fps will decide the time between changing the frame of spritesheets
        this.fps=20;
        this.frameTimer=0;
        this.frameInterval=1000/this.fps;

        //this.speed=7;
        //for deleting enemies ou of screen
        this.markedForDeletion=false;
    }

    update(deltaTime){
        //to animate spritesheets of enemy we will cycle between frame x of 0 and max frame in infinite loop
        if(this.frameTimer > this.frameInterval){
            this.frameTimer =0;
            if(this.frameX >= this.maxFrame)    this.frameX=0;
            else    this.frameX++;
        }
        else    this.frameTimer+=deltaTime;

        //movement
        //making it relative to game speed for when we are sitting and stuff
        this.x-= this.speedX + this.game.speed;
        this.y+= this.speedY;

        //deleting the enemies out of the screen
        if(this.x<0-this.width){
            this.markedForDeletion=true;
            //score++;
        }
    }

    draw(context){
        //debug mode
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
        context.drawImage(this.image,
            this.frameX * this.width, 0,this.width, this.height, 
            this.x,this.y,this.width,this.height);
    }
}

//making sub classes
export class FlyingEnemy extends Enemy{
    constructor(game){
        //accessing the parent class
        super();
        this.game=game;
        //hardcoding to match this particular picture
        this.width=60;
        this.height=44;
        //spawn right side of screen and randomising their spacing
        this.x=this.game.width + Math.random()*this.game.width*0.5;
        //randomising it's height in the upper half
        this.y=Math.random()*this.game.height*0.5;
        this.speedX=Math.random() +1;
        this.speedY=0;
        this.maxFrame=5;
        this.image = document.getElementById('enemy_fly');
        //to give it a wavy motion
        this.angle=0;
        this.va=Math.random()*0.1 +0.1;
    }
    update(deltaTime){
        super.update(deltaTime);
        //wavy motion
        this.angle +=this.va;
        //making it move like a sine graph, the angle oh which is changed every few ms
        this.y+=Math.sin(this.angle)

    }
}

export class GroundEnemy extends Enemy{
    constructor(game){
        super();
        this.game=game;
        this.width=60;
        this.height=87;
        this.x=this.game.width;
        this.y = this.game.height-this.height-this.game.groundMargin;
        this.image=document.getElementById('enemy_plant');
        this.speedX=0;
        this.speedY=0;
        this.maxFrame=1;
    }
}

export class ClimbingEnemy extends Enemy{
    constructor(game){
        super();
        this.game=game;
        this.width=120;
        this.height=144;
        this.x=this.game.width;
        //randomly spawning in the upper half
        this.y=Math.random()* this.game.height*0.5;
        this.image=document.getElementById('enemy_spider_big');
        this.speedX=0;
        //making half of them move up and half move down
        this.speedY=Math.random()> 0.5 ? 1 : -1;
        this.maxFrame=5;

    }
    update(deltaTime){
        super.update(deltaTime);
        //making it go up and down
        if(this.y > this.game.height - this.height- this.game.groundMargin)
            this.speedY *= -1;

        //deleting it if it goes vertically off screen
        if(this.y < 0-this.height)    this.markedForDeletion=true;

    }

    draw(context){
        super.draw(context);
        //drawing a spider web
        context.strokeStyle='black';
        context.beginPath();
        context.moveTo(this.x + this.width/2 , 0);
        context.lineTo(this.x + this.width/2,this.y + this.height/2);
        context.stroke();

    }
}