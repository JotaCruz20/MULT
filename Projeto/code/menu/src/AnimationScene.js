class AnimationScene extends Phaser.Scene {

    constructor() {
        super({key: 'animScene'});
    }

    preload(){
        //Tiles Nivel 1
        this.load.image("tile_set","assets/images/ImagemMapas/montanha 1.png");
        this.load.image('background','assets/images/Background/backgroundSemNuvens.png');
        this.load.image('rochas','assets/images/SpriteSheets/spritesheet.png');
        //Tiles Nivel 2
        this.load.image("tiles","assets/maps/Nivel2/TilesExamples.png");
        this.load.image("tiles2","assets/maps/Nivel2/Tileset.png");
        this.load.image("tilesAgua","assets/maps/Nivel2/coldwaterdeepwater.png");
        this.load.image('backgroundFloresta','assets/images/Background/florestaa.png');
        this.load.image('backgroundDeserto','assets/images/Background/deserto2.png');
        this.load.image("tile_setD","assets/images/ImagemMapas/_902808864.png");
        this.load.image('areia','assets/images/SpriteSheets/hyptosis_tile-art-batch-1.png');
        //sprites objetos
        this.load.spritesheet('sign',"assets/images/SpriteSheets/signpost.png",{ frameWidth: 50, frameHeight: 50 });
        this.load.spritesheet('stairs','assets/images/SpriteSheets/stairs.png',{ frameWidth: 16, frameHeight: 32 });
        this.load.spritesheet('coins','assets/images/SpriteSheets/moedaG_spritesheet.png',{ frameWidth: 30, frameHeight: 30 });
        this.load.spritesheet('cabra','assets/images/SpriteSheets/cabra_spritesheet.png',{ frameWidth: 70, frameHeight: 74 });
        this.load.spritesheet('caixa','assets/images/SpriteSheets/caixa.png',{ frameWidth: 40, frameHeight: 40 });
        this.load.spritesheet('bauF','assets/images/SpriteSheets/bau_flip_spritesheet.png',{ frameWidth: 73, frameHeight: 60 });
        this.load.spritesheet('piranha','assets/images/SpriteSheets/piranha.png',{ frameWidth: 13, frameHeight: 19 });
        this.load.spritesheet('coracao',"assets/images/SpriteSheets/heart_spritesheet.png",{frameWidth:15, frameHeight:15});
        this.load.spritesheet('sapo',"assets/images/SpriteSheets/sapo_sprite.png",{frameWidth:50, frameHeight:40});
        this.load.spritesheet('cacto','assets/images/SpriteSheets/cacto_sprite.png',{ frameWidth: 36,frameHeight: 44 });
        //Mapas
        this.load.tilemapTiledJSON("map","assets/maps/Nivel1/montanhas1v1.json");
        this.load.tilemapTiledJSON("mapSingle","assets/maps/Nivel1/MontanhasSingle.json");
        this.load.tilemapTiledJSON("map2","assets/maps/Nivel2/floresta.json");
        this.load.tilemapTiledJSON("map3","assets/maps/Nivel3/deserto_tiles.json");
        //sprites para colisoes
        this.load.image("CabraAtaque1",'assets/images/cabra/cabra_grande_ataque_1.png');
        this.load.image("CabraAtaque2",'assets/images/cabra/cabra_grande_ataque_flip_1.png');
        this.load.image('Mapa',"assets/images/ImagemMapas/Montanhas1v1.png");
        this.load.image('MapaRochas',"assets/images/ImagemMapas/rochas.png");
        this.load.image('MapaSingle',"assets/images/ImagemMapas/MontanhasSingle.png");
        this.load.image('MapaRochasSingle',"assets/images/ImagemMapas/rochasSingle.png");
        this.load.image('Mapa2',"assets/maps/Nivel2/floresta.png");
        this.load.image('Agua',"assets/maps/Nivel2/agua.png");
        this.load.image('PiranhaC',"assets/images/Piranha/1.png");
        this.load.image('sapoC',"assets/images/Sapo/sapo1.png");
        this.load.image('MapaD',"assets/images/ImagemMapas/deserto_tiles.png");
        this.load.image('MapaAreia',"assets/images/ImagemMapas/areia.png");
        this.load.image('cactoC',"assets/images/Cacto/cactos1.png");


        //remove as cenas e volta a adicionar
        this.scene.remove("montanha1v1");
        this.scene.add("montanha1v1",montanha1v1,false);
        this.scene.remove("floresta1v1");
        this.scene.add("floresta1v1",floresta1v1,false);
        this.scene.remove("montanhaSingle");
        this.scene.add("montanhaSingle",montanhasSinglePlayer,false);
        this.scene.remove("FlorestaSinglePlayer");
        this.scene.add("FlorestaSinglePlayer",FlorestaSinglePlayer,false);
        //Texturas Joao
        this.load.spritesheet('playerJoao',"assets/images/SpriteSheets/sprite_sheet_joao.png",{ frameWidth: 63, frameHeight: 63 });
        this.load.spritesheet('cpuJoao',"assets/images/SpriteSheets/sprite_sheet_joao.png",{ frameWidth: 63, frameHeight: 63 });
        this.load.image('PlayerCollisionJoao',"assets/images/Joao/joao_idle_63px_1.png");
        this.load.image("cabecaJoao","assets/images/Joao/Cabeca.png");
        //Texturas Loreto
        this.load.spritesheet('playerLoreto',"assets/images/SpriteSheets/sprite_sheet_loreto.png",{ frameWidth: 63, frameHeight: 63 });
        this.load.spritesheet('cpuLoreto',"assets/images/SpriteSheets/sprite_sheet_loreto.png",{ frameWidth: 63, frameHeight: 63 });
        this.load.image('PlayerCollisionLoreto',"assets/images/Loreto/mariana_loreto_63px.png");
        this.load.image("cabecaLoreto","assets/images/Loreto/cabeca.png");
        //Texturas Mimi
        this.load.spritesheet('playerMimi',"assets/images/SpriteSheets/sprite_sheet_mariana.png",{ frameWidth: 63, frameHeight: 63 });
        this.load.spritesheet('cpuMimi',"assets/images/SpriteSheets/sprite_sheet_mariana.png",{ frameWidth: 63, frameHeight: 63 });
        this.load.image('PlayerCollisionMimi',"assets/images/Mariana/mariana_base_63px1.png");
        this.load.image("cabecaMimi","assets/images/Mariana/cabeca.png");


        //remover animations
        this.anims.remove('left');
        this.anims.remove('right');
        this.anims.remove('holdR');
        this.anims.remove('holdL');
        this.anims.remove('leftArmor');
        this.anims.remove('holdRArmor');
        this.anims.remove('rightArmor');
        this.anims.remove('leftArmorPerder');
        this.anims.remove('rightArmorPerder');
        this.anims.remove('holdRArmorPerder');
        this.anims.remove('holdLArmorPerder');
        this.anims.remove('rightCPU');
        this.anims.remove("leftCPU");
        this.anims.remove('holdRCPU');
    }

    create() {
        const anim = this.add.sprite(400, 300, 'anim_story', 0).setScale(2);

        this.anims.create({
            key: 'story',
            frames: this.anims.generateFrameNumbers('anim_story', {start: 0}),
            frameRate: 7,
        });

        anim.play('story');

        this.controls = this.input.keyboard.createCursorKeys();

        anim.once('preloadcomplete', () => {
            this.scene.start('chooseScene');
        });

        anim.once('animationcomplete', () => {
            this.scene.start('chooseScene');
        });
    }

    update() {
        if(this.controls.space.isDown){
            this.scene.stop();
            this.scene.start('chooseScene');
        }
    }
}
