class ChooseScenario extends Phaser.Scene {

    constructor() {
        super({key: 'chooseScenarioScene'});
    }

    init(data){
        this.playerKey=data.player;
        this.headKey=data.headFile;
        this.collisionKey=data.collisionFile;
        this.playerMorto=data.morto;
    }

    preload(){}

    create(){
        //region Buttons
        this.scene.launch("background",{backKey:"backgroundMountain"});

        //region Continuar

        let buttonDeserto = this.add.sprite(0,0,'btn_190x49_mountain',0);
        let textDeserto = this.add.bitmapText(0,0,'pixel','Deserto',15).setOrigin(0.5);

        this.add.container(400,125,[buttonDeserto,textDeserto])
            .setSize(190,49)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown',() => {
                buttonDeserto.setFrame(1);
                textDeserto.y =5 ;

            })
            .on('pointerup',() => {
                buttonDeserto.setFrame(0);
                textDeserto.y = 0;
                //this.scene.start("gameScene");
                });
        //endregion

        //region OpÃ§Ãµes
        let buttonFloresta = this.add.sprite(0,0,'btn_190x49_mountain',0);
        let textFloresta = this.add.bitmapText(0,0,'pixel','Floresta',15).setOrigin(0.5);

        this.add.container(400,214,[buttonFloresta,textFloresta])
            .setSize(190,49)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)

            .on('pointerdown',() => {
                buttonFloresta.setFrame(1);
                textFloresta.y = 5;
            })
            .on('pointerup',() => {
                buttonFloresta.setFrame(0);
                textFloresta.y = 0;
                //this.scene.start("opcoesScene",{prev:"pauseScene",theme:this.theme});
                //this.scene.stop("background");
            });
        //endregion

        //region Ajuda
        let buttonMontanha = this.add.sprite(0,0,'btn_190x49_mountain',0);
        let textMontanha = this.add.bitmapText(0,0,'pixel','Montanha',15).setOrigin(0.5);

        this.add.container(400,303,[buttonMontanha,textMontanha])
            .setSize(190,49)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown',() => {
                buttonMontanha.setFrame(1);
                textMontanha.y = 5;})
            .on('pointerup',() => {
                buttonMontanha.setFrame(0);
                textMontanha.y = 0;
                this.scene.start("montanhaSingle",{player:this.playerKey,headFile:this.headKey,collisionFile:this.collisionKey});
                });
        //endregion

        //region Menu Principal
        let buttonMenu = this.add.sprite(0,0,'btn_190x49_mountain',0);
        let textMenu = this.add.bitmapText(0,0,'pixel','Voltar',15).setOrigin(0.5);

        this.add.container(400,392,[buttonMenu,textMenu])
            .setSize(190,49)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown',() => {
                buttonMenu.setFrame(1);
                textMenu.y = 5;})
            .on('pointerup',() => {
                buttonMenu.setFrame(0);
                textMenu.y = 0;
                this.scene.start("chooseScene");});

        //endregion

        //endregion

    }
}