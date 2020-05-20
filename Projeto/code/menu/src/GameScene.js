class GameScene extends Phaser.Scene {

    constructor() {
        super({key: 'gameScene'});
    }


    preload(){
    }

    create(){
        this.scene.start("montanha1v1");
    }

}