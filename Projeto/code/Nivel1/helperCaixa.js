class helperCaixa extends Phaser.Scene{
    constructor() {
        super({key:"helperCaixa"});
    }
    preload(){
        this.scene.bringToTop();
        this.load.image('menu','assets/images/Menus/helper.png');
        this.load.spritesheet('close','assets/images/Menus/close.png',{ frameWidth: 30, frameHeight: 30 });
    }
    create(){
        this.helper=this.add.image(game.config.width/2,game.config.height/2,'menu');
        this.text=this.add.text(game.config.width/2-180,game.config.height/2-80,"\n\n\nEsta caixa tem PowerUps, este \npremite-te tocar no inimigo sem morrer.\nCuidado pois a invulnerabilidade \nsó dura uns segundos.");
        this.add.sprite(game.config.width/2+180,game.config.height/2+80,'close').setInteractive({useHandCursor: true}).on('pointerdown',() => {this.scene.stop()});
        this.controls = this.input.keyboard.createCursorKeys();
    }
    update(){
        if(this.controls.space.isDown){
            this.scene.stop();
        }
    }
}