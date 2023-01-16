export class InputHandler{
    /*will apply event listeners to the game
    and keep track of all the keys that are pressed*/


    constructor(game){
        this.keys=[];
        this.game=game;
        /*we will add and remove from the Array
        as a key is pressed or released*/

        window.addEventListener('keydown', e => {
            if((    e.key === 'ArrowDown' || 
                    e.key==='ArrowUp' || 
                    e.key==='ArrowLeft' ||
                    e.key==='ArrowRight' ||
                    e.key===' ')
                    && this.keys.indexOf(e.key)=== -1){
                this.keys.push(e.key);
            }
            else if(e.key === 'd') this.game.debug= !this.game.debug;
        });
        
        window.addEventListener('keyup', e => {
            if(     e.key === 'ArrowDown' || 
                    e.key==='ArrowUp' || 
                    e.key==='ArrowLeft' ||
                    e.key==='ArrowRight' ||
                    e.key===' '){
                /*remove this one element*/
                this.keys.splice(this.keys.indexOf(e.key),1);
            }
        });
    }
}