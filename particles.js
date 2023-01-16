class Particle{
    constructor(game){
        this.game=game;
        //this is only in particles class, so it doesnt affect the 
        //markedForDeletion in enemy class
        this.markedForDeletion = false;
    }

    update(){
        this.x -= this.speedX + this.game.speed;
        this.y -= this.speedY;
        //making the size of particles decrease by 5% every frame
        this.size *= 0.95;
        if(this.size < 0.5) this.markedForDeletion=true;
    }
}

export class Dust extends Particle{
    constructor(game,x,y){
        super(game);
        this.size = Math.random()*10 + 10;
        this.x=x;
        this.y=y;
        this.speedX=Math.random();
        this.speedY=Math.random();
        this.color = 'black';
    }
    draw(context){
        context.beginPath();
        //(x coordinate, y coordinate, radius, start angle, end angle)
        context.arc(this.x,this.y,this.size,0,Math.PI*2);
        context.fillStyle = this.color;
        context.fill();
    }
}

export class Splash extends Particle{
    constructor(game,x,y){
        super(game);
        this.size = Math.random()*10 + 200;
        //offsetting by experimenting and finding best position
        this.x=x -this.size * 0.4;
        this.y=y -this.size * 0.5;
        //the splash should be in both directions horizontally but more towards left
        //as we are supposed to be moving right
        this.speedX=Math.random()* 6 -4;
        this.speedY=Math.random() * 2 -2;
        //after going up to a certain height we want them to fall back down
        this.gravity = 0;
        this.image = document.getElementById('fire');
    }

    update(){
        super.update();
        //to make it slowly fall down
        this.gravity+=0.1;
        this.y +=this.gravity;
    }
    draw(context){
        context.drawImage(this.image,this.x,this.y, this.size, this.size);
    }
}


export class Fire extends Particle{
    constructor(game,x,y){
        super(game);
        this.image = document.getElementById('fire');
        this.size = Math.random() * 100 + 50;
        this.x=x;
        this.y=y;
        this.speedX = 1;
        this.speedY = 1;
        //to make the individual fire particles rotate
        this.angle = 0;
        this.va = Math.random() * 0.2 - 0.1;
    }

    update(){
        super.update();
        //to make the fire pattern follow as a sin graph
        this.angle += Math.sin(this.angle * 10);
    }

    draw(context){
        //save and restore help us ensure that all operations
        //will only affect one particle
        context.save();
        //setting the center of rotation to top left point of rectangle
        context.translate(this.x, this.y);
        context.rotate(this.angle);
        //(img, poaitionX, positionY, width, height)
        context.drawImage(this.image, -this.size * 0.5, -this.size*0.5,
            this.size,this.size)
        context.restore();
    }
}