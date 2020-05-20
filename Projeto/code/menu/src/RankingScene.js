class RankingScene extends Phaser.Scene {

    constructor() {
        super({key:"rankingScene"});
    }

    preload(){}

    init(data){
        this.prev = data.prev;
        this.theme = data.theme;
    }

    create(){
        this.scene.bringToTop();

        //region Opções
        let buttonOpcoes = this.add.sprite(0,0,'btn_190x49_'+this.theme,0).setScale(0.8);
        let textOpcoes = this.add.bitmapText(0,0,'pixel','Opções',10).setOrigin(0.5);

        this.add.container(700,50,[buttonOpcoes,textOpcoes])
            .setSize(200,50)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)

            .on('pointerdown',() => {
                buttonOpcoes.setFrame(1);
                textOpcoes.y = 3;
            })
            .on('pointerup',() => {
                buttonOpcoes.setFrame(0);
                textOpcoes.y = 0;
                this.scene.start("opcoesScene",{prev:"rankingScene",theme:this.theme});});
        //endregion

        let window = this.add.sprite(0,0,'w_400x450_'+this.theme).setOrigin(0,0);

        let title = this.add.bitmapText(200,25,'pixel','Ranking',30).setOrigin(0.5);
        let backButton = this.add.sprite(25,20,'backButton')
            .setInteractive({useHandCursor: true})
            .on('pointerdown',() => {
                this.scene.run(this.prev);
                this.scene.sleep();
            });

        this.text = this.add.bitmapText(200,60,'pixel','',15) //LOCAL ONDE ESTARÁ A COISA DO RANKING
            .setOrigin(0.5,0);

        this.Pag1();

        this.add.container(200,75,[window,title,this.text,backButton]);
    }

}
