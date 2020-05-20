class BootScene extends Phaser.Scene {
    constructor() {
        super({key: 'bootScene'});
    }

    preload(){
        this.load.spritesheet('anim','assets/images/Menus/images/animations/anim_spritesheet.png',{ frameWidth: 350, frameHeight: 342 });
    }

    create(){
        this.scene.start("introScene");
    }
}