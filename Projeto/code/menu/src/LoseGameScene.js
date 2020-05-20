class LoseGameScene extends Phaser.Scene {

    constructor() {
        super({key: 'loseGameScene'});
    }

    preload(){}

    init(data){
        this.theme=data.theme;
        this.key=data.backKey;
    }

    create(){
        this.scene.launch('background',{backKey:this.key});

        //region Window
        let window = this.add.sprite(0,0,'w_400x200_'+this.theme).setOrigin(0,0);
        let text = this.add.bitmapText(200,40,'pixel','Perdeste',35).setOrigin(0.5);

        const heartsAnim = this.add.sprite(200,110,'hearts',0).setScale(2);

        this.anims.create({
            key: 'heart_anim',
            frames: this.anims.generateFrameNumbers('hearts',{start: 0}),
            frameRate: 10,
        });

        heartsAnim.play('heart_anim');

        this.add.container(200,100,[window,text,heartsAnim]);
        //endregion

        //region Voltar Menu
        let btnMenu = this.add.sprite(0,0,'btn_300x80_'+this.theme,0);
        let textMenu = this.add.bitmapText(0,0,'pixel','Menu Principal',20).setOrigin(0.5);

        this.add.container(400,350,[btnMenu,textMenu])
            .setSize(300,80)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)

            .on('pointerdown',() => {
                btnMenu.setFrame(1);
                textMenu.y = 5;
            })
            .on('pointerup',() => {
                btnMenu.setFrame(0);
                textMenu.y = 0;
                this.scene.start("principalScene");});

        //endregion

        //region Rankig
        let btnCont = this.add.sprite(0,0,'btn_300x80_'+this.theme,0);
        let textCont = this.add.bitmapText(0,0,'pixel','Ranking',20).setOrigin(0.5);

        this.add.container(400,450,[btnCont,textCont])
            .setSize(300,80)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)

            .on('pointerdown',() => {
                btnCont.setFrame(1);
                textCont.y = 5;
            })
            .on('pointerup',() => {
                btnCont.setFrame(0);
                textCont.y = 0;
                this.scene.start("rankingScene",{prev:"loseGameScene",theme: this.theme});});
        //endregion

    }
}