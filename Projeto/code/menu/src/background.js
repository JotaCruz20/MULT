class background extends Phaser.Scene {

    constructor() {
        super({key: 'background'});
    }
    init(data){
        this.key=data.backKey;
    }

    preload(){
        this.load.spritesheet('clouds','assets/images/Menus/images/background/clouds.png',{ frameWidth: 1800  , frameHeight: 610 });
    }

    create(){
        this.add.sprite(0,0,this.key).setOrigin(0,0);

        /*//nuvens
        this.clouds1=this.add.sprite(this.game.config.width+405,this.game.config.height-350,'clouds');
        this.clouds2=this.add.sprite(2800+this.game.config.width,this.game.config.height-350,'clouds');
        //this.clouds1.body.setAllowGravity(false);
        //this.clouds2.body.setAllowGravity(false);

        this.moveCloud(-5);*/
    }

    /*moveCloud(speed) {
        //this.clouds1.setVelocityX(speed);
        //this.clouds2.setVelocityX(speed);
        if (this.clouds1.x < 0){
            this.clouds1.x=this.game.config.width+405;
        }
        if (this.clouds2.x <0){
            this.clouds2.x=this.game.config.width+405;
        }
    }*/

}

//Mostrar aqui o logo do jogo!
//http://labs.phaser.io/edit.html?src=src\loader\this.game%20load%20this.game.config.js
//https://phaser.io/phaser3/devlog/121
