class IntroScene extends Phaser.Scene{
    constructor() {
        super({key: 'introScene'});
    }

    preload() {
        this.load.image('backgroundMountain','assets/images/Menus/images/background/background.png');
        this.load.image('backgroundForest','assets/images/Background/florestaa.png');

        //audios
        this.load.audio("catchCoinSound","assets/sounds/media.io_Coin01.mp3");
        this.load.audio("catchCaixaSound","assets/sounds/media.io_Rise01.mp3");
        this.load.audio("themeSong","assets/sounds/themeSong.mp3");
        this.load.audio("1up","assets/sounds/Mario 1up.wav");
        this.load.audio("deathSound","assets/sounds/Legend Of Zelda Death Sound.mp3");

        //region Buttons
        this.load.spritesheet('btn_190x49_mountain','assets/images/Menus/images/elements/mountain/btn_190x49_mountain.png',{ frameWidth: 190, frameHeight: 49 });
        this.load.spritesheet('btn_300x80_mountain','assets/images/Menus/images/elements/mountain/btn_300_80_mountain.png',{ frameWidth: 300, frameHeight: 80 });
        this.load.spritesheet('btn_300x35_mountain','assets/images/Menus/images/elements/mountain/btn_300x35_mountain.png',{ frameWidth: 300, frameHeight: 35 });

        this.load.spritesheet('btn_190x49_forest','assets/images/Menus/images/elements/forest/btn_190x49_forest.png',{ frameWidth: 190, frameHeight: 49 });
        this.load.spritesheet('btn_300x80_forest','assets/images/Menus/images/elements/forest/btn_300_80_forest.png',{ frameWidth: 300, frameHeight: 80 });

        this.load.spritesheet('btn_190x49_desert','assets/images/Menus/images/elements/desert/btn_190x49_desert.png',{ frameWidth: 190, frameHeight: 49 });
        this.load.spritesheet('btn_300x80_desert','assets/images/Menus/images/elements/desert/btn_300_80_desert.png',{ frameWidth: 300, frameHeight: 80 });

        this.load.image('backButton','assets/images/Menus/images/icons/back_arrow.png');
        this.load.image('pauseButton','assets/images/Menus/images/icons/signs.png');
        this.load.image('nextButton','assets/images/Menus/images/icons/next_arrow.png');

        //endregion

        this.load.bitmapFont('pixel','assets/images/Menus/font/font.png','assets/images/Menus/font/font.fnt');

        //region Windows
        this.load.image('w_300x300_mountain','assets/images/Menus/images/elements/mountain/menu_300x300_mountain.png');
        this.load.image('w_400x200_mountain','assets/images/Menus/images/elements/mountain/menu_400x200_mountain.png');
        this.load.image('w_400x450_mountain','assets/images/Menus/images/elements/mountain/menu_400x450_mountain.png');
        this.load.image('w_450x300_mountain','assets/images/Menus/images/elements/mountain/menu_450x300_mountain.png');

        this.load.image('w_400x200_forest','assets/images/Menus/images/elements/forest/menu_400x200_forest.png');
        this.load.image('w_400x450_forest','assets/images/Menus/images/elements/forest/menu_400x450_forest.png');

        this.load.image('w_400x200_desert','assets/images/Menus/images/elements/desert/menu_400x200_desert.png');
        this.load.image('w_400x450_desert','assets/images/Menus/images/elements/desert/menu_400x450_desert.png');
        //endregion

        this.load.image('grupo','assets/images/Menus/images/todos.png');

        this.load.spritesheet('anim_story',"assets/images/Menus/images/animations/anim_play_spritesheet.png",{frameWidth:400   , frameHeight: 300});
        this.load.spritesheet('bau','assets/images/Menus/images/bau_spritesheet.png',{frameWidth: 75, frameHeight: 62});
        this.load.spritesheet('coin','assets/images/Menus/images/animations/coin.png',{ frameWidth: 25, frameHeight: 25 });
        this.load.spritesheet('clock','assets/images/Menus/images/animations/clock.png',{ frameWidth: 25, frameHeight: 25 });
        this.load.spritesheet('hearts','assets/images/Menus/images/animations/coracao_desvanecer_spritesheet.png',{ frameWidth: 60, frameHeight: 25 });

        this.load.image('noVolume','assets/images/Menus/images/icons/no_sound.png');
    }

    create() {
        const anim = this.add.sprite(400,100,'anim',0).setScale(2);

        this.anims.create({
            key: 'intro',
            frames: this.anims.generateFrameNumbers('anim',{start: 0}),
            frameRate: 10,
        });

        anim.play('intro');

        anim.once('animationcomplete', ()=>{

            //this.scene.start("introScene");

            this.scene.start('audioManager');
            this.scene.start('background');
            this.scene.start("principalScene");
        });

        this.loadImages();
    }
    loadImages(){

    }
}