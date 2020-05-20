class DesertSinglePalyer extends Phaser.Scene{
    constructor() {
        super({key:"deserto1v1"});
    }

    preload(){
        //imagens do jogo
        this.load.image("tile_set","assets/images/ImagemMapas/_902808864.png");
        this.load.image("cabeça",'assets/images/Joao/Cabeca.png');
        this.load.image('backgroundDesert','assets/images/Background/deserto2.png');
        this.load.image('areia','assets/images/SpriteSheets/hyptosis_tile-art-batch-1.png');
        this.load.spritesheet('sign',"assets/images/SpriteSheets/signpost.png",{ frameWidth: 50, frameHeight: 50 });
        this.load.spritesheet('player','assets/images/SpriteSheets/joao_spritesheet.png',{ frameWidth: 63, frameHeight: 63 });
        this.load.spritesheet('stairs','assets/images/SpriteSheets/stairs.png',{ frameWidth: 16, frameHeight: 32 });
        this.load.spritesheet('coins','assets/images/SpriteSheets/moedaG_spritesheet.png',{ frameWidth: 30, frameHeight: 30 });
        this.load.spritesheet('cacto','assets/images/SpriteSheets/cacto_sprite.png',{ frameWidth: 36,frameHeight: 44 });
        this.load.spritesheet('caixa','assets/images/SpriteSheets/caixa.png',{ frameWidth: 40, frameHeight: 40 });
        this.load.spritesheet('bau','assets/images/SpriteSheets/bau_flip_spritesheet.png',{ frameWidth: 73, frameHeight: 60 });
        this.load.tilemapTiledJSON("map3","assets/maps/deserto/deserto_tiles_single.json");

        //sprites para colisoes
        this.load.image('Mapa',"assets/images/ImagemMapas/deserto_tiles_single.png");
        this.load.image('MapaAreia',"assets/images/ImagemMapas/areia_single.png");
        this.load.image('cactoC',"assets/images/Cacto/cacto1.png");
        this.load.image('playerCollison', "assets/images/Joao/joao_idle_63px_1.png")
    }

    create(){
        //Mapa
        this.map = this.make.tilemap({key:"map3"});
        this.background = this.add.image(0,0,'backgroundDesert').setOrigin(0,0);
        this.tiles = this.map.addTilesetImage("_902808864","tile_set");
        this.areia = this.map.addTilesetImage('hyptosis_tile-art-batch-1','areia');
        this.layerGround = this.map.createStaticLayer("Camada de Tiles 1", [this.tiles],0,0);
        this.layerAreia = this.map.createStaticLayer("Camada de Tiles 2", [this.areia],0,0);
        this.layerGround.setCollisionByProperty({collides:true});
        this.layerAreia.setCollisionByProperty({collides:true});
        this.stairs = this.physics.add.staticSprite(1073,542,'stairs');
        this.stairs.setSize(20,92);
        this.stairs.setScale(2,3);
        this.sign=this.physics.add.staticSprite(2256,464,'sign');
        /*
        this.pause=this.physics.add.staticSprite(770,30,'pauseButton').setScale(0.05,0.05);
        this.pause.setInteractive({useHandCursor: true}).on('pointerdown',() => {this.scene.launch("pauseScene",{key:"deserto1v1",theme:"desert"}); this.scene.pause()});
        this.pause.setScrollFactor(0);
         */

        //Variaveis de Jogo
        this.modo = 1;
        this.lifes = 3;
        this.counter = 0;
        this.score = 0;
        this.scoreSpawnPoint = 0;
        this.spawnpoint = 0;
        this.flagCactos = 0;
        this.flagHelper = 0;
        this.flagCaixa = 0;
        this.armorLost = 0;
        this.armor = 0;
        this.end = 0;

        //animations
        this.createAnimations();

        //Controles
        this.controls = this.input.keyboard.createCursorKeys();

        //Player
        this.player = this.physics.add.sprite(35,525,'player');
        this.player.setSize(40,50);
        this.player.setOffset(11,9);

        //Score
        this.cabeca=this.physics.add.staticImage(50,70,'cabeça');
        this.cabeca.setScrollFactor(0);
        this.vidas=this.add.text(30,30,'Coins: 0\n    x3',{fontSize:'20px',fill:'white'});

        //Enemy
        this.createEnemies();

        //Coins
        this.createCoins();

        //PowerUps
        this.createCaixa();

        //Fim do nivel
        this.createBau();

        //camaras to follow player
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.background.setScrollFactor(0);
        this.vidas.setScrollFactor(0);

        //colisoes
        this.createColisoes();
    }

    update(){
        this.startCacto();
        if(this.end === 0)
        {
            if (this.controls.left.isDown) {
                this.player.setVelocityX(-160);
                if (this.armorLost === 1) {
                    this.player.anims.play('leftArmorPerder', true);
                } else if (this.armor === 1) {
                    this.player.anims.play('leftArmor', true);
                } else {
                    this.player.anims.play('left', true);
                }
                this.modo = 3;
            }
            else if (this.controls.right.isDown) {
                this.player.setVelocityX(160);
                if (this.armorLost === 1) {
                    this.player.anims.play('rightArmorPerder', true);
                } else if (this.armor === 1) {
                    this.player.anims.play('rightArmor', true);
                } else {
                    this.player.anims.play('right', true);
                }
                this.modo = 1;
            }
            else {
                if (this.modo === 1 || this.modo === 2) {
                    this.player.setVelocityX(0);
                    if (this.armorLost === 1) {
                        this.player.anims.play('holdRArmorPerder', true);
                    } else if (this.armor === 1) {
                        this.player.anims.play('holdRArmor', true);
                    } else {
                        this.player.anims.play('holdR', true);
                    }
                }
                else {
                    this.player.setVelocityX(0);
                    if (this.armorLost === 1) {
                        this.player.anims.play('holdLArmorPerder', true);
                    } else if (this.armor === 1) {
                        this.player.anims.play('holdLArmor', true);
                    } else {
                        this.player.anims.play('holdL', true);
                    }
                }
            }
            if (this.controls.up.isDown && this.player.body.blocked.down) {
                this.player.setVelocityY(-430);
                this.modo = 1;
            }
        }
    }

    createAnimations(){
        //animações normais
        this.anims.create({
            key:'left',
            frames: this.anims.generateFrameNumbers('player', {start: 12, end: 13}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', {start: 10, end: 11}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'holdR',
            frames: this.anims.generateFrameNumbers('player', {start: 0, end: 4}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'holdL',
            frames: this.anims.generateFrameNumbers('player', {start: 5, end: 9}),
            frameRate: 2,
            repeat: -1
        });
        //animaçoes armadura
        this.anims.create({
            key:'leftArmor',
            frames: this.anims.generateFrameNumbers('player', {start: 24, end: 25}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'rightArmor',
            frames: this.anims.generateFrameNumbers('player', {start: 22, end: 23}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'holdRArmor',
            frames: this.anims.generateFrameNumbers('player', {start:14, end: 17}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'holdLArmor',
            frames: this.anims.generateFrameNumbers('player', {start: 18, end: 21}),
            frameRate: 2,
            repeat: -1
        });
        //animações perder armadura
        this.anims.create({
            key:'leftArmorPerder',
            frames: this.anims.generateFrameNumbers('player', {frames:[12,24,13,25]}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'rightArmorPerder',
            frames: this.anims.generateFrameNumbers('player', {frames:[10,22,11,23 ]}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'holdRArmorPerder',
            frames: this.anims.generateFrameNumbers('player', {frames: [0,14,1,15,2,16,3,17]}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'holdLArmorPerder',
            frames: this.anims.generateFrameNumbers('player', {frames:[5,18,6,19,7,20,8,21]}),
            frameRate: 2,
            repeat: -1
        });
        //animaçao cacto
        this.anims.create({
            key: 'jumpCacto',
            frames: this.anims.generateFrameNumbers('cacto', {start: 0, end: 3}),
            frameRate: 5,
            repeat: -1
        });
        //animaçoes moeda
        this.anims.create({
            key: 'coin',
            frames: this.anims.generateFrameNumbers('coins', {start: 0, end: 2}),
            frameRate: 3,
            repeat: -1
        });
        //animações caixa
        this.anims.create({
            key:'caixaFade',
            frames: this.anims.generateFrameNames('caixa',{start: 0, end:3}),
            frameRate: 10,
        })
        //animaçao bau
        this.anims.create({
            key:'closeBau',
            frames: this.anims.generateFrameNames('bau',{start:0, end:3}),
            frameRate:10
        })
    }

    createCoins(){
        //moedas player
        this.coins=this.physics.add.staticGroup();
        this.positionCoins=[[864, 496],[920, 496],[976, 496],[1856, 560],[3064, 576],[3237, 448],[3301, 448],[3464, 576]];
        for(let i=0; i<this.positionCoins.length; i++){
            this.coins.create(this.positionCoins[i][0],this.positionCoins[i][1],'coins').body.setSize(10,15).setOffset(11,7);
        }
        this.startCoins();
    }

    createEnemies(){
        this.cactos=this.physics.add.group();
        this.vetorPosicaoCactos=[570, 2597];
        this.cactos.create(this.vetorPosicaoCactos[0], 496, 'cacto').setScale(1.3).setSize(36,45).setOffset(0,0);
        this.cactos.create(this.vetorPosicaoCactos[1], 592, 'cacto').setScale(1.3).setSize(36,45).setOffset(0,0);
        this.physics.add.collider(this.cactos,this.layerGround);
        this.tweens.add({
            targets: this.cactos.getChildren(),
            duration: 1000,
            repeat: -1,            // -1: infinity
            yoyo: true,
            y:'-=50'
        });
    }

    createColisoes(){
        this.physics.world.setBounds(0,0,4000,704);
        this.layerGround.setCollisionByExclusion([-1]);

        //player
        this.player.setCollideWorldBounds(true);
        this.physics.add.overlap(this.player,this.coins,this.catchCoin,null,this);
        this.physics.add.overlap(this.player,this.sign,this.overSign,null,this);
        this.physics.add.overlap(this.player,this.stairs,this.upStair,null,this);
        this.physics.add.overlap(this.player,this.cactos,this.morte,this.returnCollisionCactos,this);
        this.physics.add.overlap(this.player,this.layerAreia,this.morte,this.returnCollisionAreia,this);
        this.physics.add.collider(this.player,this.layerGround,null,this.returnCollisionMapa,this);
        this.physics.add.collider(this.player,this.bau,this.endLevel,null,this);
        this.physics.add.collider(this.player,this.caixa,this.catchCaixa,null,this);

    }

    createCaixa(){
        this.caixa=this.physics.add.staticGroup();
        this.posicaoCaixas=[[112,496],[2160,400]];
        for(let i = 0; i<this.posicaoCaixas.length; i++){
            this.caixa.create(this.posicaoCaixas[i][0],this.posicaoCaixas[i][1],'caixa').setSize(30,30);
        }
    }

    createBau(){
        this.bau=this.physics.add.staticSprite(3951,528,"bau");
        this.bau.setScale(0.5,0.5);
        this.bau.setSize(36,25);
        this.bau.setOffset(17,20);
    }

    startCoins(){
        this.coins.playAnimation('coin',true);
    }

    startCacto(){
        let vetor_cactos = this.cactos.getChildren();
        let i=0;
        for (i; i<vetor_cactos.length;i++){
            let cactos = vetor_cactos[i];
            cactos.anims.play('jumpCacto', true);
            cactos.setVelocityY(200);
        }
    }

    morte(){
        let originX=35;
        let originY=525;
        if(this.armor === 0 && this.armorLost === 0) {
            this.lifes -= 1;
            if(this.lifes === 0){
                this.end=1;
                this.scene.stop();
                //this.scene.start("loseScene",{theme:"desert",backKey:"backgroundDesert"});
            }
            this.flagHelper = 0;
            if (this.spawnpoint === 0) {
                this.player.body.x = originX;
                this.player.body.y = originY;
                this.score = 0;
                let i;
                let coins = this.coins.getChildren();
                for (i = 0; i < 5; i++) {
                    coins[i].enableBody(true, this.positionCoins[i][0], this.positionCoins[i][1], true, true);
                }
                this.vidas.setText('Coins: ' + this.score + '\n    x' + this.lifes);
            } else if(this.armor === 1 && this.armorLost === 0) {
                this.player.body.x = this.sign.body.x;
                this.player.body.y = this.sign.body.y;
                this.score = this.scoreSpawnPoint;
                this.vidas.setText('Coins: ' + this.score + '\n    x' + this.lifes);
                let i;
                let coins = this.coins.getChildren();
                for (i = 4; i < coins.length/2; i++) { //repor a partir da quarta moeda
                    coins[i].enableBody(true, this.positionCoins[i][0], this.positionCoins[i][1], true, true);
                }
            }
        }
        else if(this.armor === 1 && this.armorLost === 0){
            this.armorLost = 1;
            this.time.addEvent({
                delay:1500,
                callback: ()=>{
                    this.armor=0;
                    this.armorLost=0;
                }
            });
        }
    }

    catchCoin(player,coin){
        coin.disableBody(true, true);
        if(player === this.player) {
            this.score += 1;
            this.vidas.setText('Score: ' + this.score + '\n    x' + this.lifes);
            if (this.controls.up.isDown) {
                this.player.setVelocityY(-430);
                this.modo = 1;
            }
            if (this.spawnpoint === 0) {
                this.scoreSpawnPoint += 1;
            }
        }
    }

    endLevel(){
        this.end=1;
        if(this.armor === 0) {
            this.player.anims.play("holdR");
        }
        else{
            this.player.anims.play("holdRArmor");
        }
        this.bau.anims.play("closeBau",true);
    }

    catchCaixa(player,caixa){
        if(this.player.body.touching.up){
            caixa.anims.play('caixaFade',true);
            this.time.addEvent({
                delay: 500,
                callback: ()=>{
                    caixa.disableBody(true,true);
                }
            });
            if(this.armor === 0){
                this.armor = 1;
            }
            else {
                this.score += 1;
            }
            if(this.flagCaixa === 0){
                this.scene.launch("helperCaixa");
                this.flagCaixa = 1;
            }
        }
    }

    overSign(){
        if(this.flagHelper === 0){
            this.flagHelper=1;
            this.spawnpoint=1;
        }
    }

    upStair(){
        if(this.controls.up.isDown){
            this.player.setVelocityY(-120);
        }
        else if(this.controls.down.isDown){
            this.player.setVelocityY(120);
        }
        else{
            this.player.setVelocityY(0);
        }
    }

    returnCollisionMapa(){
        return this.colision("Mapa");
    }

    returnCollisionAreia(){
        return this.colision("MapaAreia");
    }

    returnCollisionCactos(player, cactos){
        return this.colisionEnemy(cactos, "playerCollison", "CactoC");
    }

    colisionEnemy(sprite, keyPlayer, keyCacto) {
        let xmin = Math.round(Math.max(this.player.getTopLeft().x, sprite.getTopLeft().x));
        let xmax = Math.round(Math.min(this.player.getTopLeft().x + this.player.body.width, sprite.getTopLeft().x + sprite.width));
        let ymin = Math.round(Math.max(this.player.getTopLeft().y, sprite.getTopLeft().y));
        let ymax = Math.round(Math.min(this.player.getTopLeft().y + this.player.body.height, sprite.getTopLeft().y + sprite.height));

        for (let i = xmin; i < xmax; i++){
            for (let j = ymin; j < ymax; j++) {

                let selfOffsetX = Math.round(i - this.player.getTopLeft().x);
                let selfOffsetY = Math.round(j - this.player.getTopLeft().y);

                let spriteOffsetX = Math.round(i - sprite.getTopLeft().x);
                let spriteOffsetY = Math.round(j - sprite.getTopLeft().y);

                let temp1=this.textures.getPixelAlpha(selfOffsetX,selfOffsetY,keyPlayer);
                let temp2=this.textures.getPixelAlpha(spriteOffsetX,spriteOffsetY,keyCacto);

                if (temp1 > 0 && temp2 > 0) {
                    return true;
                }
            }
        }
        return false;
    }


    colision(key){

        let width=this.player.body.width;// largura da Imagem
        let heigth=this.player.body.height;// Tamanho da Imagem
        let pesInicio=10;//Os pés começam neste pixel
        let pesFim=25;//os pes acabam neste pixel
        let pesMeio=pesFim-pesInicio;//ponto medio dos pes

        let alphaPixelPesInicio=this.textures.getPixelAlpha(Math.round(this.player.body.position.x+pesInicio),Math.round(this.player.body.position.y+heigth),key);//checa a colisao com o tras dos pes
        let alphaPixelPesFim=this.textures.getPixelAlpha(Math.round(this.player.body.position.x+pesFim),Math.round(this.player.body.position.y+heigth),key);//checa a colisao com a frente dos pes
        let alphaPixelPesMeio=this.textures.getPixelAlpha(Math.round(this.player.body.position.x+pesMeio),Math.round(this.player.body.position.y+heigth),key);//checa a colisao com o meio dos pes
        let alphaPixelCabecaTopoEsquerdo=this.textures.getPixelAlpha(Math.round(this.player.body.position.x),Math.round(this.player.body.position.y),key);//checa a colisao com o topo esquerdo da cabeça
        let alphaPixelCabecaTopoMeio=this.textures.getPixelAlpha(Math.round(this.player.body.position.x+width/2),Math.round(this.player.body.position.y),key);//checa a colisao com o meio dos pes
        let alphaPixelCabecaTopoFrente=this.textures.getPixelAlpha(Math.round(this.player.body.position.x+width),Math.round(this.player.body.position.y),key);//checa a colisao com o meio dos pes
        let alphaPixelCabecaMeioFente=this.textures.getPixelAlpha(Math.round(this.player.body.position.x+width),Math.round(this.player.body.position.y+heigth/2),key)//checa a colisao com o meio da cabeça frontal
        let alphaPixelCabecaMeioAtras=this.textures.getPixelAlpha(Math.round(this.player.body.position.x),Math.round(this.player.body.position.y+heigth/2),key)//checa a colisao com o meio da cabeça frontal
        return  alphaPixelPesFim>0 || alphaPixelPesInicio>0 || alphaPixelPesMeio>0 || alphaPixelCabecaTopoEsquerdo>0 || alphaPixelCabecaTopoMeio>0 || alphaPixelCabecaTopoFrente>0 || alphaPixelCabecaMeioFente>0 || alphaPixelCabecaMeioAtras>0;

    }
}