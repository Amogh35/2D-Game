export class UI{
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily='Creepster';
    }

    draw(context){
        context.font=this.fontSize + 'px ' + this.fontFamily;
        context.textAlign='left';
        //context.fillStyle= this.game.fontColor;

        //for shadow effect
        context.fillStyle='white';
        context.fillText('Score: ' + this.game.score, 20, 50);
        //doing it twice for a manual shadow effect
        context.fillStyle='black';
        context.fillText('Score: ' + this.game.score, 22, 52);

        //timer
        context.font=this.fontSize*0.8 + 'px ' + this.fontFamily;
        context.fillStyle='white';
        context.fillText('Time: ' + (this.game.time*0.001).toFixed(1), 20, 80);
        //doing it twice for a manual shadow effect
        context.fillStyle='black';
        context.fillText('Time: ' + (this.game.time*0.001).toFixed(1), 22, 82);

        //game over message
        if(this.game.gameOver){
            context.font=this.fontSize*2 + 'px ' + this.fontFamily;
            context.textAlign = 'center';
            //win condition
            if(this.game.score>5){
            context.fillStyle='white';
            context.fillText('Boo-yah', this.game.width*0.5, this.game.height*0.5 - 20);
            //doing it twice for a manual shadow effect
            context.fillStyle='black';
            context.fillText('Boo-yah', this.game.width*0.5 +2, this.game.height*0.5+2 - 20);
            //second line of text
            context.font=this.fontSize*0.7 + 'px ' + this.fontFamily;
            context.textAlign = 'center';
            context.fillStyle='white';
            context.fillText('What are creatures of the night afraid of? YOU!!!', this.game.width*0.5, this.game.height*0.5 + 20);
            //doing it twice for a manual shadow effect
            context.fillStyle='black';
            context.fillText('What are creatures of the night afraid of? YOU!!!', this.game.width*0.5 +2, this.game.height*0.5+2 + 20);
            }
            //lose condition
            else{
            context.fillStyle='white';
            context.fillText('Love at first Bite?', this.game.width*0.5, this.game.height*0.5 - 20);
            //doing it twice for a manual shadow effect
            context.fillStyle='black';
            context.fillText('Love at first Bite?', this.game.width*0.5 +2, this.game.height*0.5+2 - 20)
            //second line of text
            context.font=this.fontSize*0.7 + 'px ' + this.fontFamily;
            context.textAlign = 'center';
            context.fillStyle='white';
            context.fillText('Nope. Better luck next time!', this.game.width*0.5, this.game.height*0.5 + 20);
            //doing it twice for a manual shadow effect
            context.fillStyle='black';
            context.fillText('Nope. Better luck next time!', this.game.width*0.5 +2, this.game.height*0.5+2 + 20)
            }
        }
    }
}