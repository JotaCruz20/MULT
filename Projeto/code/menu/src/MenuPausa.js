class MenuPausa extends Phaser.Scene {

    constructor() {
        super({key: 'pauseScene'});
    }

    preload(){
        this.scene.bringToTop();
    }

    init(data){
        this.theme = data.theme;
        this.cena = data.key;
    }

    create(){

        //region Buttons

        //region Continuar

        let buttonContinuar = this.add.sprite(0,0,'btn_190x49_'+this.theme,0);
        let textContinuar = this.add.bitmapText(0,0,'pixel','Continuar',15).setOrigin(0.5);

        this.add.container(400,125,[buttonContinuar,textContinuar])
            .setSize(190,49)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown',() => {
                buttonContinuar.setFrame(1);
                textContinuar.y =5 ;

            })
            .on('pointerup',() => {
                buttonContinuar.setFrame(0);
                textContinuar.y = 0;
                this.scene.stop();
                this.scene.resume(this.cena);});
        //endregion

        //region Opções
        let buttonOpcoes = this.add.sprite(0,0,'btn_190x49_'+this.theme,0);
        let textOpcoes = this.add.bitmapText(0,0,'pixel','Opções',15).setOrigin(0.5);

        this.add.container(400,214,[buttonOpcoes,textOpcoes])
            .setSize(190,49)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)

            .on('pointerdown',() => {
                buttonOpcoes.setFrame(1);
                textOpcoes.y = 5;
            })
            .on('pointerup',() => {
                buttonOpcoes.setFrame(0);
                textOpcoes.y = 0;
                this.scene.start("opcoesScene",{prev:this.cena,theme:this.theme});
                this.scene.bringToTop("opcoesScene");
                this.scene.stop("background");
            });
        //endregion

        //region Ajuda
        let buttonAjuda = this.add.sprite(0,0,'btn_190x49_'+this.theme,0);
        let textAjuda = this.add.bitmapText(0,0,'pixel','Ajuda',15).setOrigin(0.5);

        this.add.container(400,303,[buttonAjuda,textAjuda])
            .setSize(190,49)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown',() => {
                buttonAjuda.setFrame(1);
                textAjuda.y = 5;})
            .on('pointerup',() => {
                buttonAjuda.setFrame(0);
                textAjuda.y = 0;
                this.scene.pause();
                this.scene.start("ajudaScene",{prev:"pauseScene",theme:this.theme});});
        //endregion

        //region Menu Principal
        let buttonMenu = this.add.sprite(0,0,'btn_190x49_'+this.theme,0);
        let textMenu = this.add.bitmapText(0,0,'pixel','Menu Principal',15).setOrigin(0.5);

        this.add.container(400,392,[buttonMenu,textMenu])
            .setSize(190,49)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown',() => {
                buttonMenu.setFrame(1);
                textMenu.y = 5;})
            .on('pointerup',() => {
                buttonMenu.setFrame(0);
                textMenu.y = 0;
                this.scene.stop();
                this.scene.stop(this.cena);
                this.scene.start("principalScene");});
    }
}