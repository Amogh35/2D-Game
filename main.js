import {Player} from './player.js';
import {InputHandler} from './input.js';
import { Background } from './background.js';
import {FlyingEnemy, ClimbingEnemy, GroundEnemy} from './enemies.js'
import {UI} from './UI.js';

//window.addEventListener('load',function(){
    const canvas = document.getElementById('canvas1');
    const ctx=canvas.getContext('2d');
    canvas.width=900;
    canvas.height=500;

    class Game{
        constructor(width,height){
            this.width=width;
            this.height=height;
            //depending on data asset we need to leave some margin for road
            this.groundMargin=80;
            //game speed, it affects the speed of background
            //since we start in sitting state the initial speed is 0
            this.speed=0;
            this.maxSpeed=3;
            //instantiate a player by passing the game class
            this.background=new Background(this);
            this.player=new Player(this);
            this.input= new InputHandler(this);
            this.UI=new UI(this);

            this.enemies= [];
            this.particles=[];
            this.maxParticles=50;
            this.collisions=[];

            this.enemyTimer=0;
            this.enemyInterval=1000;
            //debug mode
            this.debug=false;

            this.score=0;
            this.fontColor='black';
            //setting the game timer
            this.time=0;
            this.maxTime=60000;
            this.gameOver=false;
            //we need to run this only after everything else is loaded and ready
            this.player.currentState=this.player.states[0];
            //to initialize it
            this.player.currentState.enter();
        }

        update(deltaTime){
            this.time+=deltaTime;
            if(this.time>this.maxTime){
                this.gameOver=true;
            }

            this.background.update();
            this.player.update(this.input.keys,deltaTime);

            //handling enemies
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer=0;
            }
            else{
                this.enemyTimer +=deltaTime;
            }
            this.enemies=this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.enemies.forEach(enemy =>{
                enemy.update(deltaTime);
            })

            //handling particles
            this.particles=this.particles.filter(particle => !particle.markedForDeletion);
            this.particles.forEach(particle => {
                particle.update();
            })
            
            //limiting the max number of particles in our game
            if(this.particles.length > this.maxParticles){
                this.particles.length=this.maxParticles;
            }

            //handle collision sprites
            this.collisions = this.collisions.filter( collision => !collision.markedForDeletion);
            this.collisions.forEach( collision => {
                collision.update(deltaTime);
            })
            
        }
        draw(context){
            //draw the player after backround so that it comes on top
            this.background.draw(context);
            this.player.draw(context);

            this.enemies.forEach(enemy =>{
                enemy.draw(context);
            });

            this.particles.forEach(particle =>{
                particle.draw(context);
            });

            this.collisions.forEach( collision => {
                collision.draw(context);
            })

            this.UI.draw(context);
        }

        addEnemy(){
            //we need to add ground enemy only when we are not sitting
            //we make it so the prob of adding in is 0.5 each time the function runs(every sec)
            if(this.speed > 0 && Math.random() < 0.5)
                this.enemies.push(new GroundEnemy(this));
                //dont want spiders and plants to coincide
            else if(this.speed>0)
                this.enemies.push(new ClimbingEnemy(this));

            this.enemies.push(new FlyingEnemy(this));
        }
    }

   const game=new Game(canvas.width,canvas.height);

    let lastTime=0;
    function animate(timeStamp){
        //we need deltaTime to constantly generate enemies
        const deltaTime=timeStamp-lastTime;
        lastTime=timeStamp;

        //to see only the current animation frame
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if(!game.gameOver) requestAnimationFrame(animate);
   }
   animate(0)
//});
