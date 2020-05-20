class MenuPrincipal extends Phaser.Scene {
    constructor(){
        super({key: 'principalScene'});
    }

    preload(){
    }

    create(){
        this.theme = "mountain";
        this.scene.launch('background',{backKey:"backgroundMountain"});
        this.scene.bringToTop();
        //region Buttons
        //region Começar

        let buttonComecar = this.add.sprite(0,0,'btn_190x49_mountain',0);
        let textComecar = this.add.bitmapText(0,0,'pixel','Começar',15).setOrigin(0.5);

        this.add.container(400,105,[buttonComecar,textComecar])
            .setSize(190,49)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown',() => {
                buttonComecar.setFrame(1);
                textComecar.y =5 ;

            })
            .on('pointerup',() => {
                buttonComecar.setFrame(0);
                textComecar.y = 0;
                this.scene.start("animScene");});
        //endregion

        //region Opções
        let buttonOpcoes = this.add.sprite(0,0,'btn_190x49_mountain',0);
        let textOpcoes = this.add.bitmapText(0,0,'pixel','Opções',15).setOrigin(0.5);

        this.add.container(400,194,[buttonOpcoes,textOpcoes])
            .setSize(190,49)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)

            .on('pointerdown',() => {
                buttonOpcoes.setFrame(1);
                textOpcoes.y = 5;
            })
            .on('pointerup',() => {
                buttonOpcoes.setFrame(0);
                textOpcoes.y = 0;
                this.scene.pause();
                this.scene.start("opcoesScene",{prev:"principalScene",theme:this.theme});});
        //endregion

        //region Ajuda
        let buttonAjuda = this.add.sprite(0,0,'btn_190x49_mountain',0);
        let textAjuda = this.add.bitmapText(0,0,'pixel','Ajuda',15).setOrigin(0.5);

        this.add.container(400,283,[buttonAjuda,textAjuda])
            .setSize(190,49)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown',() => {
                buttonAjuda.setFrame(1);
                textAjuda.y = 5;})
            .on('pointerup',() => {
                buttonAjuda.setFrame(0);
                textAjuda.y = 0;
                this.scene.start("ajudaScene",{prev:"principalScene",theme:this.theme});});
        //endregion

        //region Créditos
        let buttonCreditos = this.add.sprite(0,0,'btn_190x49_mountain',0);
        let textCreditos = this.add.bitmapText(0,0,'pixel','Créditos',15).setOrigin(0.5);

        this.add.container(400,372,[buttonCreditos,textCreditos])
            .setSize(190,49)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown',() => {
                buttonCreditos.setFrame(1);
                textCreditos.y = 5;})
            .on('pointerup',() => {
                buttonCreditos.setFrame(0);
                textCreditos.y = 0;
                this.scene.start("creditosScene");});

        //endregion

        //region Sair
        let buttonSair = this.add.sprite(0,0,'btn_190x49_mountain',0);
        let textSair = this.add.bitmapText(0,0,'pixel','Sair',15).setOrigin(0.5);

        this.add.container(400,461,[buttonSair,textSair])
            .setSize(190,49)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown',function () {
                buttonSair.setFrame(0);
                textSair.y = 0;
                close();
            })
            .on('pointerup',function () {
                buttonSair.setFrame(0);
                textSair.y = 0;
                this.scene.close("background");
                this.scene.close("audioManager");
                this.scene.close("principalScene");

            });
        //endregion
        //endregion
    }
    update() {
    }
}