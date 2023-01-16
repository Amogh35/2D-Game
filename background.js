class Layer{
    //width and height are of the image
    //speedModifier cuz each layer moves at diff speed
    constructor(game,width,height,speedModifier,image){
        this.game=game;
        this.width=width;
        this.height=height;
        this.speedModifier=speedModifier;
        this.image=image;
        this.x=0;
        this.y=0;
    }
    
    update(){
        //to make the pic scroll endlessly
        if(this.x< 0-this.width)   this.x=0;
        else this.x-=this.game.speed * this.speedModifier;
    }

    draw(context){
        context.drawImage(this.image,this.x,this.y)
        //we make another pic after the first one to make the illusion
        context.drawImage(this.image,this.x+this.width,this.y)
        //if we try to repeat the background with only one image
        //then there is a small blinking effect while it loops
    }
}

export class Background{
    constructor(game){
        this.game=game;
        //based on the particular pic we have
        this.width=1667;
        this.height=500;
        this.layer1image = document.getElementById('layer1');
        this.layer2image = document.getElementById('layer2');
        this.layer3image = document.getElementById('layer3');
        this.layer4image = document.getElementById('layer4');
        this.layer5image = document.getElementById('layer5');
        //we pass each layer with the required speedModifier here
        this.layer1 = new Layer(this.game, this.width, this.height, 0,this.layer1image);
        this.layer2 = new Layer(this.game, this.width, this.height, 0.2,this.layer2image);
        this.layer3 = new Layer(this.game, this.width, this.height, 0.4,this.layer3image);
        this.layer4 = new Layer(this.game, this.width, this.height, 0.8,this.layer4image);
        this.layer5 = new Layer(this.game, this.width, this.height, 1,this.layer5image);
        this.backgroundLayers=[this.layer1,this.layer2,this.layer3,this.layer4,this.layer5];

    }

    update(){
        this.backgroundLayers.forEach(layer => {
            layer.update();
        })
    }


    draw(context){
        this.backgroundLayers.forEach(layer => {
            layer.draw(context);
        })
    }
}