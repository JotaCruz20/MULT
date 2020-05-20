class MenuCreditos extends Phaser.Scene {

    constructor() {
        super({key:"creditosScene"});
    }

    preload(){}

    create(){

        let window = this.add.sprite(0,0,'w_400x450_mountain').setOrigin(0,0);
        let title = this.add.bitmapText(200,25,'pixel','Créditos',30).setOrigin(0.5);
        let menuButton = this.add.sprite(25,20,'backButton')
            .setInteractive({useHandCursor: true})
            .on('pointerdown',() => {this.scene.start("principalScene");});

        let text = this.add.bitmapText(200,60,'pixel',
                'Projeto desenvolvido no âmbito da cadeira de \nMultimédia de licenciatura de Eng. Informática,\nFaculdade de Ciências e Tecnologia da\nUniversidade de Coimbra, no ano letivo\n2019/2020\n\nRealizado por:\n   João Cruz\n   Mariana Loreto\n    Mariana Marques\n',15)
            .setOrigin(0.5,0);

        let image = this.add.image(50,250,'grupo').setOrigin(0,0).setScale(0.7);

        this.add.container(200,75,[window,title,text,menuButton,image]);
    }
}