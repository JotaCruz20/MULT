class helperMontanha extends Phaser.Scene{
    constructor() {
        super({key:"helperMontanha"});
    }
    preload(){
        this.scene.bringToTop();
        this.load.image('menu','assets/images/Menus/helper.png');
        this.load.spritesheet('close','assets/images/Menus/close.png',{ frameWidth: 30, frameHeight: 30 });
    }
    create(){
        this.helper=this.add.image(game.config.width/2,game.config.height/2,'menu');
        this.text=this.add.text(game.config.width/2-180,game.config.height/2-80,"HINT:\nSe tocares numa moeda terás direito\na um dobule jump.\nIrás necessitar disso em diante.\nComo somos teus amigos terás\no spawnpoint marcado aqui.");
        this.add.sprite(game.config.width/2+180,game.config.height/2+80,'close').setInteractive({useHandCursor: true}).on('pointerdown',() => {this.scene.stop()});
        this.controls = this.input.keyboard.createCursorKeys();
    }
    update(){
        if(this.controls.space.isDown){
            this.scene.stop();
        }
    }
}