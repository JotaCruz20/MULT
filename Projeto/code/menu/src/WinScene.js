class WinScene extends Phaser.Scene {

    constructor() {
        super({key: 'winScene'});
    }

    preload(){}

    init(data){
        this.theme = data.theme;
        this.playerKey=data.player;
        this.cpuKey=data.cpu;
        this.headKey=data.headFile;
        this.collisionKey=data.collisionFile;
        this.nextKey=data.key;
        this.tempoFinal=data.time;
        this.lifes=data.lifes;
        this.score=data.score;
    }

    create(){
        this.scene.launch('background');
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
                this.scene.start("opcoesScene",{prev:"winScene",theme:this.theme});});
        //endregion

        //region Pontuações
        let tempoTemp=this.tempoFinal/1000;
        let tempo=(Math.round(tempoTemp*100)/100).toFixed(2);
        let pontuacao=(tempo-this.score).toFixed(2);
        //endregion

        //region Window

        let window = this.add.sprite(0,0,'w_400x200_'+this.theme).setOrigin(0,0);
        let text = this.add.bitmapText(200,40,'pixel','Ganhaste!',35).setOrigin(0.5);
        let highScore = this.add.bitmapText(200,70,'pixel','Pontos: ',20).setOrigin(0.5);
        let coinsScore = this.add.bitmapText(200,100,'pixel','Moedas: '+this.score,15).setOrigin(0.5);
        let timeScore = this.add.bitmapText(200,130,'pixel','Tempo: '+tempo,15).setOrigin(0.5);
        let Final = this.add.bitmapText(200,160,'pixel','Total: '+pontuacao,20).setOrigin(0.5);

        //region Animações
        const coinAnim = this.add.sprite(120,130,'coin',0).setScale(1.5);

        this.anims.create({
            key: 'anim_coin',
            frames: this.anims.generateFrameNumbers('coin',{start: 0}),
            frameRate: 7,
            repeat: -1
        });

        coinAnim.play('anim_coin');

        const clockAnim = this.add.sprite(120,160,'clock',0);

        this.anims.create({
            key: 'anim_clock',
            frames: this.anims.generateFrameNumbers('clock',{start: 0}),
            frameRate: 10,
            repeat: -1
        });

        clockAnim.play('anim_clock');
        //endregion

        this.add.container(200,100,[window,text,highScore,coinsScore,timeScore,Final,coinAnim,clockAnim]);

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
                this.scene.start("principalScene");
                this.scene.stop();
            });

        //endregion

        //region Continuar
        let btnCont = this.add.sprite(0,0,'btn_300x80_'+this.theme,0);
        let textCont = this.add.bitmapText(0,0,'pixel','Continuar',20).setOrigin(0.5);

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
                this.scene.start(this.nextKey,{score:this.score,lifes:this.lifes,time:this.tempoFinal,player:this.playerKey,cpu:this.cpuKey,headFile:this.headKey,collisionFile:this.collisionKey,theme:"desert"});
                this.scene.stop();
            });
        //endregion
    }
}