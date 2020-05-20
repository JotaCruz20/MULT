class MenuAjuda extends Phaser.Scene {

    constructor() {
        super({key:"ajudaScene"});
    }

    preload(){}

    init(data){
        this.prev = data.prev;
        this.theme = data.theme;
    }

    create(){
        this.scene.bringToTop();

        let window = this.add.sprite(0,0,'w_400x450_'+this.theme).setOrigin(0,0);

        let title = this.add.bitmapText(200,25,'pixel','Ajuda',30).setOrigin(0.5);
        let menuButton = this.add.sprite(25,20,'backButton')
            .setInteractive({useHandCursor: true})
            .on('pointerdown',() => {
                this.scene.run(this.prev);
                this.scene.sleep();
            });

        let nextButton = this.add.sprite(375,410,'nextButton')
            .setInteractive({useHandCursor: true})
            .on('pointerdown',() => {
                this.Pag2();
                nextButton.setVisible(false);
                backButton.setVisible(true);
            });

        let backButton = this.add.sprite(25,410,'backButton')
            .setInteractive({useHandCursor: true})
            .on('pointerdown',() => {
                this.Pag1();
                nextButton.setVisible(true);
                backButton.setVisible(false);
            }).setVisible(false);

        this.text = this.add.bitmapText(200,60,'pixel','',15)
            .setOrigin(0.5,0);

        this.Pag1();

        this.add.container(200,75,[window,title,this.text,menuButton,nextButton,backButton]);
    }

    Pag1(){
        this.text.setText('O objetivo deste jogo é completar a corrida o\n mais rápido possível, ultrapassando os\nobstáculos e sobrevivendo a todos os inimigos.\n\nPara tal deve recorrer aos seguintes \ncontrolos:\n\nUse a seta direita para fazer o boneco andar \npara a direita.\nUse a seta esquerda para fazer o boneco  \nandar para a esquerda.\nUse a seta cima para fazer o boneco saltar.');
    }

    Pag2(){
        this.text.setText('O personagem, escolhido de três, terá de fazer\n uma corridade vida ou de morte, tendo de ven-\ncer um NPC para poder passar para o nível\n seguinte.\n\n/*IMAGEM DE JOGO*/ ');
    }

}
