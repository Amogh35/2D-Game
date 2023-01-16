import {Dust,Splash,Fire} from './particles.js'

const states={
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6
}
//to manage which state the player is currently in
//so that we can make the backbround and stuff
//behave appropriately
class State{
    constructor(state, game){
        this.state=state;
        this.game = game;
    }
}

export class Sitting extends State{
    constructor(game){
        //to call the constructor of its parent class, State
        super('SITTING',game);
    }
    //runs just once when state in entered
    enter(){
        //frameX should be set to 0 first to prevent blinking while changing states
        this.game.player.frameX=0;
        this.game.player.maxFrame=4;
        this.game.player.frameY=5;
    }
    //keeps checking and changes states accordingly
    //runs according to fps 60 times per sec
    handleInput(input){
        if(input.includes('ArrowLeft') || input.includes('ArrowRight')){
            this.game.player.setState(states.RUNNING,1);
        }
        else if(input.includes(' ')){
            //rolling increases the game speed by twice
            this.game.player.setState(states.ROLLING,2);
        }
    }
}


export class Running extends State{
    constructor(game){
        //to call the constructor of its parent class, State
        super('RUNNING',game);
    }
    //runs just once when state in entered
    enter(){
        this.game.player.frameX=0;
        this.game.player.maxFrame=8;
        this.game.player.frameY=3;
    }
    //keeps checking and changes states accordingly
    //runs according to fps 60 times per sec
    handleInput(input){
        //making one new dust particle for every time it runs, that is each frame
        //we use unshift to ass particles to start of array
        //so that we can splice the old ones from the end
        this.game.particles.unshift(new Dust(this.game,
            this.game.player.x + this.game.player.width*0.5,
            this.game.player.y +this.game.player.height));

        if(input.includes('ArrowDown')){
            this.game.player.setState(states.SITTING,0);
        }
        else if(input.includes('ArrowUp')){
            this.game.player.setState(states.JUMPING,1);
        }
        else if(input.includes(' ')){
            this.game.player.setState(states.ROLLING,2);
        }
    }
}


export class Jumping extends State{
    constructor(game){
        //to call the constructor of its parent class, State
        super('Jumping',game);
    }
    //runs just once when state in entered
    enter(){
        if(this.game.player.onGround())  this.game.player.vy-=27;
        this.game.player.frameX=0;
        this.game.player.maxFrame=6;
        this.game.player.frameY=1;
    }
    //keeps checking and changes states accordingly
    //runs according to fps 60 times per sec
    handleInput(input){
        if(this.game.player.vy> this.game.player.weight){
            this.game.player.setState(states.FALLING,1);
        }
        else if(input.includes(' ')){
            this.game.player.setState(states.ROLLING,2);
        }
        else if(input. includes('ArrowDown')){
            this.game.player.setState(states.DIVING,0);
        }
    }
}


export class Falling extends State{
    constructor(game){
        //to call the constructor of its parent class, State
        super('FALLING',game);
    }
    //runs just once when state in entered
    enter(){
        this.game.player.frameX=0;
        this.game.player.maxFrame=6;
        this.game.player.frameY=2;
    }
    //keeps checking and changes states accordingly
    //runs according to fps 60 times per sec
    handleInput(input){
        if(this.game.player.onGround()){
            this.game.player.setState(states.RUNNING,1);
        }
        else if(input.includes(' ')){
            this.game.player.setState(states.ROLLING,2);
        }
        else if(input. includes('ArrowDown')){
            this.game.player.setState(states.DIVING,0);
        }
    }
}


export class Rolling extends State{
    constructor(game){
        //to call the constructor of its parent class, State
        super('ROLLING',game);
    }
    //runs just once when state in entered
    enter(){
        this.game.player.frameX=0;
        this.game.player.maxFrame=6;
        this.game.player.frameY=6;
    }
    //keeps checking and changes states accordingly
    //runs according to fps 60 times per sec
    handleInput(input){
        //making one new dust particle for every time it runs, that is each frame
        //we use unshift to ass particles to start of array
        //so that we can splice the old ones from the end
        this.game.particles.unshift(new Fire(this.game,
            this.game.player.x + this.game.player.width*0.5,
            this.game.player.y +this.game.player.height *0.5));

            
        if(!input.includes(' ') && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING,1);
        }
        else if(!input.includes(' ') && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING,1);
        }
        else if(input.includes(' ') && input.includes('ArrowUp') && this.game.player.onGround()){
            this.game.player.vy-=27;
        }
        else if(input. includes('ArrowDown') && !this.game.player.onGround()){
            this.game.player.setState(states.DIVING,0);
        }
    }
}

export class Diving extends State{
    constructor(game){
        //to call the constructor of its parent class, State
        super('DIVING',game);
    }
    //runs just once when state in entered
    enter(){
        //diving uses same sprite animation roll as rolling
        this.game.player.frameX=0;
        this.game.player.maxFrame=6;
        this.game.player.frameY=6;
        //we need it to dive down with some speed instead of just falling
        this.game.player.vy=15;
    }
    //keeps checking and changes states accordingly
    //runs according to fps 60 times per sec
    handleInput(input){
        //making one new dust particle for every time it runs, that is each frame
        //we use unshift to ass particles to start of array
        //so that we can splice the old ones from the end
        this.game.particles.unshift(new Fire(this.game,
            this.game.player.x + this.game.player.width*0.5,
            this.game.player.y +this.game.player.height *0.5));

        //when player touches ground after diving it starts running  
        if(this.game.player.onGround()){
            this.game.player.setState(states.RUNNING,1);
            for (let i = 0; i < 30; i++) {
                //offsetting the values by experimenting and finding best position
                this.game.particles.unshift(new Splash(this.game,
                    this.game.player.x + this.game.player.width*0.5,
                    this.game.player.y + this.game.player.height));
            }
        }
        //if while player is on ground if space is  still pressed then it goes into rolling
        else if(input.includes(' ') && this.game.player.onGround()){
            this.game.player.setState(states.ROLLING,2);
        }
    }
}

export class Hit extends State{
    constructor(game){
        //to call the constructor of its parent class, State
        super('HIT',game);
    }
    //runs just once when state in entered
    enter(){
        //diving uses same sprite animation roll as rolling
        this.game.player.frameX=0;
        this.game.player.maxFrame=10;
        this.game.player.frameY=4;
    }
    //keeps checking and changes states accordingly
    //runs according to fps 60 times per sec
    handleInput(input){
        //frameX starts from 0 and starts animating when it enters Hit state
        //we want to run the animation only once and exit when frameX reaches 10th frame
        if(this.game.player.frameX >= 10 && this.game.player.onGround()){
            this.game.player.setState(states.RUNNING,1);
        }
        else if(this.game.player.frameX >= 10 && !this.game.player.onGround()){
            this.game.player.setState(states.FALLING,1);
        }
    }
}