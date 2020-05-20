class FlorestaSinglePlayer extends Phaser.Scene{
    constructor() {
        super({key:"FlorestaSinglePlayer"});
    }

    init(data){//vai receber os dados sobre o personagem escolhido
        this.playerKey=data.player;
        this.headKey=data.headFile;
        this.collisionKey=data.collisionFile;
        this.playerMorto=data.morto;
    }

    preload(){}

    create(){
        this.map = this.make.tilemap({key:"map2S"});
        this.background=this.add.image(0,0,'backgroundFloresta').setOrigin(0,0);
        this.tiles = this.map.addTilesetImage("TilesExamples","tiles");
        this.tiles2 = this.map.addTilesetImage("Tileset","tiles2");
        this.tilesAgua = this.map.addTilesetImage("water","tilesAgua");
        this.layerGround = this.map.createStaticLayer("Map_Ground", [this.tiles,this.tiles2],0,0);
        this.layerGround.setCollisionByProperty({collides:true});
        this.layerWater = this.map.createStaticLayer("Water", [this.tilesAgua],0,0);
        this.sign=this.physics.add.staticSprite(2242,460,'sign');
        this.pause=this.physics.add.staticSprite(770,30,'pauseButton').setScale(0.05,0.05);
        this.pause.setInteractive({useHandCursor: true}).on('pointerdown',() => {this.scene.launch("pauseScene",{key:"montanha1v1",theme:"mountain"}); this.scene.pause()});
        this.pause.setScrollFactor(0);

        this.modo=1;
        this.scoreSpawnPoint=0;//Serve para saber o score do player a quando de chegar ao spawnpoint, pois ele fica com este score caso morra
        this.spawnpoint=0;//Se chegou ao spawnpoint ou não
        this.armorLost=0;//Flag para saber se o player acabou de perder a armadura
        this.armor=0;//Flag para saber se o user tem armadura ou nao
        this.end=0;//Flag para saber se o jogo foi terminado
        this.mapaAltura=609.5;//Altura do Mapa na personagem
        this.lifes=3;//vidas do jogador
        this.score=0;//pontos

        //Controles
        this.controls = this.input.keyboard.createCursorKeys();

        //animations
        this.createAnimations();

        //Player
        this.player = this.physics.add.sprite(32,550,this.playerKey);
        this.player.setSize(40,50);
        this.player.setOffset(11,12);

        //Score
        this.cabeca=this.physics.add.staticImage(50,70,this.headKey);
        this.cabeca.setScrollFactor(0);
        this.vidas=this.add.text(30,30,'Coins: '+this.score+'\n    x'+this.lifes,{fontSize:'20px',fill:'white'});


        //camaras to follow player
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.background.setScrollFactor(0);
        this.vidas.setScrollFactor(0);

        //enemies
        this.createEnemies();

        //Coins
        this.createCoins();

        //Caixa
        this.createCaixa();

        //colisoes
        this.createColisoes();

        //end level
        this.createBau();
    }

    update() {
        let velocityX=160;
        let velocityY=430;
        this.transparente();
        if(this.end==0)
        {
            if (this.controls.left.isDown) {
                this.player.setVelocityX(-velocityX);
                if (this.armorLost == 1) {
                    this.player.anims.play('leftArmorPerder', true);
                } else if (this.armor == 1) {
                    this.player.anims.play('leftArmor', true);
                } else {
                    this.player.anims.play('left', true);
                }
                this.modo = 3;
            } else if (this.controls.right.isDown) {
                this.player.setVelocityX(velocityX);
                if (this.armorLost == 1) {
                    this.player.anims.play('rightArmorPerder', true);
                } else if (this.armor == 1) {
                    this.player.anims.play('rightArmor', true);
                } else {
                    this.player.anims.play('right', true);
                }
                this.modo = 1;
            } else {
                if (this.modo == 1 || this.modo == 2) {
                    this.player.setVelocityX(0);//player esta parado
                    if (this.armorLost == 1) {
                        this.player.anims.play('holdRArmorPerder', true);
                    } else if (this.armor == 1) {
                        this.player.anims.play('holdRArmor', true);
                    } else {
                        this.player.anims.play('holdR', true);
                    }
                } else {
                    this.player.setVelocityX(0);
                    if (this.armorLost == 1) {
                        this.player.anims.play('holdLArmorPerder', true);
                    } else if (this.armor == 1) {
                        this.player.anims.play('holdLArmor', true);
                    } else {
                        this.player.anims.play('holdL', true);
                    }
                }
            }
            if (this.controls.up.isDown && this.player.body.blocked.down) {
                this.player.setVelocityY(-velocityY);
                this.modo = 1;
            }
        }
    }

    createAnimations(){
        //animações normais
        this.anims.create({
            key:'left',
            frames: this.anims.generateFrameNumbers(this.playerKey, {start: 12, end: 13}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers(this.playerKey, {start: 10, end: 11}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'holdR',
            frames: this.anims.generateFrameNumbers(this.playerKey, {start: 0, end: 4}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'holdL',
            frames: this.anims.generateFrameNumbers(this.playerKey, {start: 5, end: 9}),
            frameRate: 2,
            repeat: -1
        });
        //animaçoes armadura
        this.anims.create({
            key:'leftArmor',
            frames: this.anims.generateFrameNumbers(this.playerKey, {start: 26, end: 27}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'rightArmor',
            frames: this.anims.generateFrameNumbers(this.playerKey, {start: 24, end: 25}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'holdRArmor',
            frames: this.anims.generateFrameNumbers(this.playerKey, {start:14, end: 18}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'holdLArmor',
            frames: this.anims.generateFrameNumbers(this.playerKey, {start: 19, end: 23}),
            frameRate: 2,
            repeat: -1
        });
        //animações perder armadura
        this.anims.create({
            key:'leftArmorPerder',
            frames: this.anims.generateFrameNumbers(this.playerKey, {frames:[12,26,13,27]}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'rightArmorPerder',
            frames: this.anims.generateFrameNumbers(this.playerKey, {frames:[10,24,11,25 ]}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'holdRArmorPerder',
            frames: this.anims.generateFrameNumbers(this.playerKey, {frames: [0,14,1,15,2,16,3,17]}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'holdLArmorPerder',
            frames: this.anims.generateFrameNumbers(this.playerKey, {frames:[5,18,6,19,7,20,8,21,9,22]}),
            frameRate: 2,
            repeat: -1
        });
        //animacoes piranha
        this.anims.create({
            key:'piranha',
            frames: this.anims.generateFrameNumbers('piranha', {frames:[0,1]}),
            frameRate: 3,
            repeat: -1
        });
        //animacao sapo
        this.anims.create({
            key:'sapo',
            frames: this.anims.generateFrameNumbers('sapo', {start:0, end:3}),
            frameRate: 3,
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
        });
        //animaçao bau
        this.anims.create({
            key:'closeBau',
            frames: this.anims.generateFrameNames('bau',{start:0, end:3}),
            frameRate:10
        });
        //animacao coracao
        this.anims.create({
            key:'coracaoRoda',
            frames: this.anims.generateFrameNames('coracao',{start:0, end:7}),
            frameRate:10,
            repeat:-1
        });
    }

    createColisoes(){
        this.physics.world.setBounds(0,0,4000,640);
        this.layerGround.setCollisionByExclusion([-1]);

        //player
        this.player.setCollideWorldBounds(true);
        this.physics.add.overlap(this.player,this.coins,this.catchCoin,null,this);
        this.physics.add.overlap(this.player,this.sign,this.overSign,null,this);
        this.physics.add.overlap(this.player,this.peixes,this.morte,this.returnCollisionPeixes,this);
        this.physics.add.overlap(this.player,this.sapo,this.morte,this.returnCollisionSapo,this);
        this.physics.add.overlap(this.player,this.layerWater,this.morte,this.returnCollisionWater,this);
        this.physics.add.collider(this.player,this.layerGround,null,this.returnCollisionMapa,this);
        this.physics.add.collider(this.player,this.bau,this.endLevel,null,this);
        this.physics.add.collider(this.player,this.caixa,this.catchCaixa,null,this);
    }

    createEnemies(){
        this.peixes=this.physics.add.group({
            immovable:true,
            allowGravity: false
        });
        //Posições dos inimigos
        this.vetorPosicaoPeixes=[[270,660],[585,660],[1455,660],[1580,660],[1710,660],[3090,660]];
        this.vetorSapo=[[2050,460]];
        for(let i=0;i<this.vetorPosicaoPeixes.length;i++) {
            this.peixes.create(this.vetorPosicaoPeixes[i][0], this.vetorPosicaoPeixes[i][1], 'piranha').setScale(1.5,1.5);
        }
        this.sapo=this.physics.add.group();
        for(let i=0;i<this.vetorSapo.length;i++) {
            this.sapo.create(this.vetorSapo[i][0], this.vetorSapo[i][1], 'sapo').setScale(1.5,1.5).setSize(23,20).setOffset(13,15);
        }
        this.physics.add.collider(this.sapo,this.layerGround);
        //Animação de salto dos peixes
        this.tweens.add({
            targets: this.peixes.getChildren(),
            duration: 1000,
            repeat: -1,            // -1: infinity
            yoyo: true,
            repeatDelay: 2000,
            y:'-=180',
        });
        this.tweens.add({
            targets: this.sapo.getChildren(),
            duration: 4000,
            repeat: -1,            // -1: infinity
            yoyo: true,
            x:'+=400'
        });
        this.peixes.playAnimation('piranha');
        this.sapo.playAnimation('sapo');

    }

    transparente(){
        //FUnçao que faz os peixes desaparecer na agua e aparecer fora de agua
        let peixes = this.peixes.getChildren();
        let i=0;
        if(peixes[0].y==this.vetorPosicaoPeixes[0][1]) {
            for (i; i < peixes.length; i++) {
                let peixe = peixes[i];
                peixe.alpha = 0;
            }
        }
        else{
            for (i; i < peixes.length; i++) {
                let peixe = peixes[i];
                peixe.alpha = 1;
            }
        }
    }

    createCoins(){
        //moedas player
        this.coins=this.physics.add.staticGroup();
        this.positionCoins=[[270,450],[315,400],[1457,590],[1588,590],[1712,590],[3534,469],[1974,520]];
        for(let i=0;i<this.positionCoins.length;i++){
            this.coins.create(this.positionCoins[i][0],this.positionCoins[i][1],'coins').body.setSize(10,15).setOffset(11,7);
        }

        this.startCoins();
    }

    createCaixa(){
        this.caixa=this.physics.add.staticGroup();
        this.posicaoCaixas=[[150,359],[1517,456]];
        for(let i=0;i<this.posicaoCaixas.length;i++) {
            this.caixa.create(this.posicaoCaixas[i][0], this.posicaoCaixas[i][1], 'caixa').setSize(30, 30);
        }

    }

    createBau(){
        this.bau=this.physics.add.staticSprite(3950,435,"bauF");
        this.bau.setScale(0.5,0.5);
        this.bau.setSize(36,25);
        this.bau.setOffset(17,20);
    }

    catchCoin(player,coin){
        coin.disableBody(true, true);
        if(player==this.player) {
            this.score += 1;
            this.vidas.setText('Score: ' + this.score + '\n    x' + this.lifes);
            if (this.controls.up.isDown) {
                this.player.setVelocityY(-430);
                this.modo = 1;
            }
            if (this.spawnpoint == 0) {
                this.scoreSpawnPoint += 1;
            }
            var sound=this.sound.add('catchCoinSound',{
                delay: 0,
                volume: 0.5
            });
            sound.play();
        }
    }

    startCoins(){
        this.coins.playAnimation('coin',true);
    }

    overSign(player,sign){
        if(this.flagHelper==0){
            this.spawnpoint=1;
        }
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
            if(caixa==this.caixa.getChildren()[0]){
                this.coracao = this.physics.add.staticSprite(caixa.x,caixa.y,'coracao').setScale(2,2).setSize(30,30);
                this.coracao.anims.play('coracaoRoda');
                this.physics.add.collider(this.player,this.coracao,this.up1,null,this);
            }
            else {
                if (this.armor == 0) {
                    this.armor = 1;
                } else {
                    this.score += 1;
                }
            }
            var sound=this.sound.add('catchCaixaSound',{
                delay: 0,
                volume: 0.5
            });
            sound.play();
        }
    }

    up1(player,coracao){
        coracao.disableBody(true,true);
        this.lifes+=1;
        this.vidas.setText('Coins: '+this.score+'\n    x'+this.lifes);
        var sound=this.sound.add('1up',{
            delay: 0,
            volume: 0.5
        });
        sound.play();
    }

    overSign(player,sign){
        this.spawnpoint=1;
    }

    morte(player,rochas){
        let originX=32;
        let originY=550;
        if(this.armor == 0 && this.armorLost==0) {
            this.lifes -= 1;
            var sound=this.sound.add('deathSound',{
                delay: 0,
                volume: 0.5
            });
            sound.play();
            if(this.lifes==0){
                this.end=1;
                this.scene.launch("Morte");
            }
            this.flagHelper = 0;
            if (this.spawnpoint == 0) {
                this.player.body.x = originX;
                this.player.body.y = originY;
                this.score = 0;
                let i;
                let coins = this.coins.getChildren();
                for (i = 0; i < 5; i++) {
                    coins[i].enableBody(true, this.positionCoins[i][0], this.positionCoins[i][1], true, true);
                }
                this.vidas.setText('Coins: ' + this.score + '\n    x' + this.lifes);
            } else if(this.armor==1 && this.armorLost==0) {
                this.player.body.x = this.sign.body.x;
                this.player.body.y = this.sign.body.y;
                this.score = this.scoreSpawnPoint;
                this.vidas.setText('Coins: ' + this.score + '\n    x' + this.lifes);
                let i;
                let coins = this.coins.getChildren();
                for (i = 5; i < 6; i++) {
                    coins[i].enableBody(true, this.positionCoins[i][0], this.positionCoins[i][1], true, true);
                }
            }
        }
        else{
            this.armorLost=1;
            this.time.addEvent({
                delay:1500,
                callback: ()=>{
                    this.armor=0;
                    this.armorLost=0;
                }
            });
        }
    }

    endLevel(player,bau){
        this.end=1;
        var tempoFinal=this.time.now;
        if(this.player==player) {
            if (this.armor == 0) {
                this.player.anims.play("holdR");
            } else {
                this.player.anims.play("holdRArmor");
            }
        }
        else{
            this.cpu.anims.play("holdRCPU")
        }
        this.bau.anims.play("closeBau",true);
        /*this.time.addEvent({
            delay:500,
            callback: ()=>{
                this.scene.stop("montanha1v1");
                this.scene.start("floresta1v1",{score:this.score,lifes:this.lifes,time:tempoFinal});
            }
        });*/

    }

    returnCollisionMapa(player,ground){
        return this.colision("Mapa2");
    }

    returnCollisionWater(player,layer){
        return this.colision("Agua2");
    }

    returnCollisionPeixes(player, peixe){
        return this.colisionEnemy(peixe, this.collisionKey, "PiranhaC");
    }

    returnCollisionSapo(player, sapo){
        return this.colisionEnemy(sapo, this.collisionKey, "sapoC");
    }

    colisionEnemy(sprite,keyPlayer,keyPeixe) {
        let xmin = Math.round(Math.max(this.player.body.position.x, sprite.body.position.x));
        let xmax = Math.round(Math.min(this.player.body.position.x + this.player.body.width, sprite.body.position.x + sprite.body.width));
        let ymin = Math.round(Math.max(this.player.body.position.y, sprite.body.position.y));
        let ymax = Math.round(Math.min(this.player.body.position.y + this.player.body.height, sprite.body.position.y + sprite.body.height));

        for (let i = xmin; i < xmax; i++) {
            for (let j = ymin; j < ymax; j++) {

                let selfOffsetX = Math.round(i - this.player.getTopLeft().x);
                let selfOffsetY = Math.round(j - this.player.getTopLeft().y);

                let spriteOffsetX = Math.round(i - sprite.getTopLeft().x);
                let spriteOffsetY = Math.round(j - sprite.getTopLeft().y);

                let temp1=this.textures.getPixelAlpha(selfOffsetX,selfOffsetY,keyPlayer);
                let temp2=this.textures.getPixelAlpha(spriteOffsetX,spriteOffsetY,keyPeixe);

                if (temp1 > 0 && temp2 > 0) {
                    return true;
                }
            }
        }
        return false;
    }

    colision(key){
        //decidi fazer assim pois verificar todos os pontos do player era demasiado e o jogo ficava muito lento
        //verifica os pontos principais do player

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
        let alphaPixelCabecaMeioAtras=this.textures.getPixelAlpha(Math.round(this.player.body.position.x),Math.round(this.player.body.position.y+heigth/2),key);//checa a colisao com o meio da cabeça frontal
        let alphaPixelCorpoFrente=this.textures.getPixelAlpha(Math.round(this.player.body.position.x+width),Math.round(this.player.body.position.y+heigth/2+heigth/4),key);
        let alphaPixelCorpoTras=this.textures.getPixelAlpha(Math.round(this.player.body.position.x),Math.round(this.player.body.position.y+heigth/2+heigth/4),key);
        return  alphaPixelPesFim>0 || alphaPixelPesInicio>0 || alphaPixelPesMeio>0 || alphaPixelCabecaTopoEsquerdo>0 || alphaPixelCabecaTopoMeio>0 || alphaPixelCabecaTopoFrente>0 || alphaPixelCabecaMeioFente>0 || alphaPixelCabecaMeioAtras>0 || alphaPixelCorpoFrente>0 || alphaPixelCorpoTras>0;

    }
}