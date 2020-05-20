class MenuOpcoes extends Phaser.Scene {

    constructor() {
        super({key:"opcoesScene"});
    }

    preload(){}

    init(data){
        this.prev = data.prev;
        this.theme = data.theme;
    }

    create(){
        this.scene.launch("background",{backKey:"backgroundMountain"});
        var volumeManager = this.scene.get('audioManager');

        //region Window
        let window = this.add.sprite(0,0,'w_400x200_'+this.theme).setOrigin(0,0);

        let title = this.add.bitmapText(200,25,'pixel','Opções',30).setOrigin(0.5);
        let menuButton = this.add.sprite(25,20,'backButton')
            .setInteractive({useHandCursor: true})
            .on('pointerdown',() => {this.scene.run(this.prev);this.scene.sleep()});
        //endregion

        //region Music
        let musica = this.add.bitmapText(200,0,'pixel','Música',20).setOrigin(0.5);
        let moreVolumeButton = this.add.bitmapText(75,40,'pixel','+',30).setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .on('pointerdown',() => {volumeManager.more_volume();});
        let lessVolumeButton = this.add.bitmapText(200,40,'pixel','-',43).setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .on('pointerdown',() => {volumeManager.less_volume();});
        let noVolumeButton = this.add.image(315,25,'noVolume').setOrigin(0.5)
            .setInteractive({useHandCursor: true})
            .on('pointerdown',() => {volumeManager.no_volume();}); //MUDAR PARA APARECER PARA PÔR O SOM

        let musicaContainer = this.add.container(0,70,[musica,moreVolumeButton,lessVolumeButton,noVolumeButton]);

        this.add.container(200,200,[window,title,menuButton,musicaContainer]);


    }

}