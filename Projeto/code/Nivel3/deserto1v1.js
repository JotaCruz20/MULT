class deserto1v1 extends Phaser.Scene{
    constructor() {
        super({key:"deserto1v1"});
    }

    init(data){//recebe as vidas,pontos e tempo total atual
        this.score=data.score;
        this.lifes=data.lifes;
        this.tempoTotal=data.time;
        this.playerKey=data.player;
        this.cpuKey=data.cpu;
        this.headKey=data.headFile;
        this.collisionKey=data.collisionFile;
    }

    preload(){}

    create(){
        this.scene.launch('background',{backKey:'backgroundDeserto'});
        //Mapa
        this.map = this.make.tilemap({key:"map3"});
        this.tiles = this.map.addTilesetImage("_902808864","tile_setD");
        this.areia = this.map.addTilesetImage('hyptosis_tile-art-batch-1','areia');
        this.layerGround = this.map.createStaticLayer("Camada de Tiles 1", [this.tiles],0,0);
        this.layerAreia = this.map.createStaticLayer("Camada de Tiles 2", [this.areia],0,0);
        this.layerGround.setCollisionByProperty({collides:true});
        this.layerAreia.setCollisionByProperty({collides:true});
        this.stairs = this.physics.add.staticSprite(1073,542,'stairs');
        this.stairs.setSize(20,92);
        this.stairs.setScale(2,3);
        this.stairs2 = this.physics.add.staticSprite(1073 ,258,'stairs').setScale(2,3);
        this.stairs2.setSize(20,92);
        this.sign=this.physics.add.staticSprite(2256,464,'sign');
        this.sign2=this.physics.add.staticSprite(2256,176,'sign');


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
        this.pause=this.physics.add.staticSprite(770,30,'pauseButton').setScale(0.05,0.05);
        this.pause.setInteractive({useHandCursor: true}).on('pointerdown',() => {this.scene.launch("pauseScene",{key:"deserto1v1",theme:"desert"}); this.scene.pause()});
        this.pause.setScrollFactor(0);

        //este array vai conter as posicoes onde o CPU vai ter de alterar o seu comportamento, seja para subir, saltar ou descer
        this.arrayPosicoesCPU=[176,416,496, 624,640,720,775,800,1005,1075,1248,1335, 1580, 1680, 1800, 1820,1890,1925,2000,2025,2090, 2500,2515,2610,2915,2970,3180,3380,3600,3720,3740,3840,3890];
        //este array vai conter os movimentos que o CPU vai ter de executar ao encontrar a posição i, ou seja, a chegar a arrayPosicoesCPU[i] faz o movimento gotoPosicoesCPU[i]
        this.gotoPosicoesCPU=[[1.8,0],[2,-5],[1.8,0],[2.5, -8],[1.8,0],[2.5,-5],[2,0],[1.5,-10],[1.8,0],[2,-8],[1.8,0],[2,-6],[1.5,0], [3,-6],[1.8, 0], [1, -8],[1.5, -8],[1.9,0],[2.5, -8],[1.8,0], [2,-7], [1.8, 0],[1.5,-5],[2.5,-10],[1.8,0],[2.5,-6],[2.5,-6],[2.5,0],[2.5,-6],[1.8,0],[1, -6], [1.5, 0],[1, -6], [1.5, 0]];

        //animations
        this.createAnimations();

        //Controles
        this.controls = this.input.keyboard.createCursorKeys();

        //Player
        //this.player = this.physics.add.sprite(35,525,this.playerKey);
        this.player = this.physics.add.sprite(3200,525,this.playerKey);
        this.player.setSize(40,50);
        this.player.setOffset(11,9);


        //Score
        this.cabeca=this.physics.add.staticImage(50,70,this.headKey);
        this.cabeca.setScrollFactor(0);
        this.vidas=this.add.text(30,30,'Coins: '+this.score+'\n    x'+this.lifes,{fontSize:'20px',fill:'white'});

        //CPU
        this.cpu=this.physics.add.sprite(35,235,this.cpuKey).setSize(40,50).setOffset(11,9); //WHY 13?

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
        this.vidas.setScrollFactor(0);

        //colisoes
        this.createColisoes();
    }

    update(){
        this.cpuAnim();
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
            frames: this.anims.generateFrameNumbers(this.playerKey, {start: 24, end: 25}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'rightArmor',
            frames: this.anims.generateFrameNumbers(this.playerKey, {start: 22, end: 23}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'holdRArmor',
            frames: this.anims.generateFrameNumbers(this.playerKey, {start:14, end: 17}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'holdLArmor',
            frames: this.anims.generateFrameNumbers(this.playerKey, {start: 18, end: 21}),
            frameRate: 2,
            repeat: -1
        });
        //animações perder armadura
        this.anims.create({
            key:'leftArmorPerder',
            frames: this.anims.generateFrameNumbers(this.playerKey, {frames:[12,24,13,25]}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'rightArmorPerder',
            frames: this.anims.generateFrameNumbers(this.playerKey, {frames:[10,22,11,23 ]}),
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
            frames: this.anims.generateFrameNumbers(this.playerKey, {frames:[5,18,6,19,7,20,8,21]}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'rightCPU',
            frames: this.anims.generateFrameNumbers( this.cpuKey, {start: 10, end: 11}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'leftCPU',
            frames: this.anims.generateFrameNumbers( this.cpuKey, {start: 12, end: 13}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'holdRCPU',
            frames: this.anims.generateFrameNumbers( this.cpuKey, {start: 0, end: 4}),
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
            frames: this.anims.generateFrameNames('bauF',{start:0, end:3}),
            frameRate:10
        })
    }

    createCoins(){
        //moedas player
        this.coins=this.physics.add.staticGroup();
        this.positionCoins=[[800,520],[864, 496],[920, 496],[976, 496],[1856, 560],[3064, 576],[3237, 448],[3301, 448],[3464, 576],[800,230],[864,208],[920, 208],[978, 208],[1856, 272],[3064, 288],[3237, 160],[3301, 160],[3464, 288]];
        for(let i=0; i<this.positionCoins.length; i++){
            this.coins.create(this.positionCoins[i][0],this.positionCoins[i][1],'coins').body.setSize(10,15).setOffset(11,7);
        }
        this.startCoins();
    }

    createEnemies(){
        this.cactos=this.physics.add.group({
                immovable: true,
                allowGravity: false
            }
        );
        this.vetorPosicaoCactos=[570, 2597];
        this.cactos.create(this.vetorPosicaoCactos[0], 490, 'cacto').setScale(1.3).setSize(36,45).setOffset(0,0);
        this.cactos.create(this.vetorPosicaoCactos[0],195,'cacto').setScale(1.3).setSize(36,45).setOffset(0,0);
        this.cactos.create(this.vetorPosicaoCactos[1], 580, 'cacto').setScale(1.3).setSize(36,45).setOffset(0,0);
        this.cactos.create(this.vetorPosicaoCactos[1], 295, 'cacto').setScale(1.3).setSize(36,45).setOffset(0,0);
        //this.physics.add.collider(this.cactos,this.layerGround);
        this.tweens.add({
            targets: this.cactos.getChildren(),
            duration: 1000,
            repeat: -1,            // -1: infinity
            yoyo: true,
            y:'-=50'
        });
        this.cactos.playAnimation("jumpCacto");
    }

    createColisoes(){
        this.physics.world.setBounds(0,0,4000,640);
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

        //cpu
        this.cpu.setCollideWorldBounds(true);
        this.physics.add.collider(this.cpu, this.layerGround);
        this.physics.add.collider(this.cpu,this.coins,this.catchCoin,null,this);
        this.physics.add.collider(this.cpu,this.caixa);
        this.physics.add.collider(this.player,this.bau2,this.endLevel,null,this);
        this.physics.add.overlap(this.cpu,this.cactos,this.morteCPU,this.returnCollisionCactos,this);
    }

    createCaixa(){
        this.caixa=this.physics.add.staticGroup();
        this.posicaoCaixas=[[112,496],[2160,400],[112,208],[2160,118]];
        for(let i = 0; i<this.posicaoCaixas.length; i++){
            this.caixa.create(this.posicaoCaixas[i][0],this.posicaoCaixas[i][1],'caixa').setSize(30,30);
        }
    }

    createBau(){
        this.bau=this.physics.add.staticSprite(3951,528,"bauF");
        this.bau.setScale(0.5,0.5);
        this.bau.setSize(36,25);
        this.bau.setOffset(17,20);
        this.bau2=this.physics.add.staticSprite(3951,240,"bauF");
        this.bau2.setScale(0.5,0.5);
        this.bau2.setSize(36,25);
        this.bau2.setOffset(17,20);
    }

    startCoins(){
        this.coins.playAnimation('coin',true);
    }

    cpuAnim(){
        let mapaHeightCPU=302;
        let originX=35;
        let originY=235;
        //Fazer comentarios
        if(this.cpu.body.y>=mapaHeightCPU){
            if(this.cpu.body.x>this.sign2.x){
                this.gotoXY(this.sign2.x,this.sign2.y);
                for(let i=9;i<this.positionCoins.length;i++){//Vai recreiar as coins do CPU
                    this.coins.create(this.positionCoins[i][0],this.positionCoins[i][1],'coins').body.setSize(10,15).setOffset(11,7);
                }
            }
            else{
                this.gotoXY(originX,originY);
                for(let i=13;i<this.positionCoins.length;i++){//recria as coins do CPU a partir do spawnpoint
                    this.coins.create(this.positionCoins[i][0],this.positionCoins[i][1],'coins').body.setSize(10,15).setOffset(11,7);
                }
            }
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[0]) {
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[0][0],this.cpu.body.y+ this.gotoPosicoesCPU[0][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[1]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[1][0],this.cpu.body.y+this.gotoPosicoesCPU[1][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[2]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[2][0],this.cpu.body.y+this.gotoPosicoesCPU[2][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[3]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[3][0],this.cpu.body.y+this.gotoPosicoesCPU[3][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[4]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[4][0],this.cpu.body.y+this.gotoPosicoesCPU[4][1]);
        }
       else if(this.cpu.body.x<this.arrayPosicoesCPU[5]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[5][0],this.cpu.body.y+this.gotoPosicoesCPU[5][1]);
        }
       else if(this.cpu.body.x<this.arrayPosicoesCPU[6]) {
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[6][0],this.cpu.body.y+this.gotoPosicoesCPU[6][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[7]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[7][0],this.cpu.body.y+this.gotoPosicoesCPU[7][1]);
        }
       else if(this.cpu.body.x<this.arrayPosicoesCPU[8]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[8][0],this.cpu.body.y+this.gotoPosicoesCPU[8][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[9]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[9][0],this.cpu.body.y+this.gotoPosicoesCPU[9][1]);
        }
       else if(this.cpu.body.x<this.arrayPosicoesCPU[10]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[10][0],this.cpu.body.y+this.gotoPosicoesCPU[10][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[11]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[11][0],this.cpu.body.y+this.gotoPosicoesCPU[11][1]);
        }
       else if(this.cpu.body.x<this.arrayPosicoesCPU[12]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[12][0],this.cpu.body.y+this.gotoPosicoesCPU[12][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[13]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[13][0],this.cpu.body.y+this.gotoPosicoesCPU[13][1]);
        }
       else if(this.cpu.body.x<this.arrayPosicoesCPU[14]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[14][0],this.cpu.body.y+this.gotoPosicoesCPU[14][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[15]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[15][0],this.cpu.body.y+this.gotoPosicoesCPU[15][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[16]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[16][0],this.cpu.body.y+this.gotoPosicoesCPU[16][1]);
        }
       else if(this.cpu.body.x<this.arrayPosicoesCPU[17]) {
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[17][0],this.cpu.body.y+this.gotoPosicoesCPU[17][1]);
        }
       else if(this.cpu.body.x<this.arrayPosicoesCPU[18]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[18][0],this.cpu.body.y+this.gotoPosicoesCPU[18][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[19]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[19][0],this.cpu.body.y+this.gotoPosicoesCPU[19][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[20]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[20][0],this.cpu.body.y+this.gotoPosicoesCPU[20][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[21]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[21][0],this.cpu.body.y+this.gotoPosicoesCPU[21][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[22]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[22][0],this.cpu.body.y+this.gotoPosicoesCPU[22][1]);
        }
       else if(this.cpu.body.x<this.arrayPosicoesCPU[23]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[23][0],this.cpu.body.y+this.gotoPosicoesCPU[23][1]);
        }
       else if(this.cpu.body.x<this.arrayPosicoesCPU[24]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[24][0],this.cpu.body.y+this.gotoPosicoesCPU[24][1]);
        }
       else if(this.cpu.body.x<this.arrayPosicoesCPU[25]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[25][0],this.cpu.body.y+this.gotoPosicoesCPU[25][1]);
        }
       else if(this.cpu.body.x<this.arrayPosicoesCPU[26]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[26][0],this.cpu.body.y+this.gotoPosicoesCPU[26][1]);
        }
       else if(this.cpu.body.x<this.arrayPosicoesCPU[27]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[27][0],this.cpu.body.y+this.gotoPosicoesCPU[27][1]);
        }
       else if(this.cpu.body.x<this.arrayPosicoesCPU[28]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[28][0],this.cpu.body.y+this.gotoPosicoesCPU[28][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[29]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[29][0],this.cpu.body.y+this.gotoPosicoesCPU[29][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[30]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[30][0],this.cpu.body.y+this.gotoPosicoesCPU[30][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[31]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[31][0],this.cpu.body.y+this.gotoPosicoesCPU[31][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[32]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[32][0],this.cpu.body.y+this.gotoPosicoesCPU[32][1]);
        }
    }

    morteCPU(){
        let originX=35;
        let originY=235;
        if(this.cpu.body.x>this.sign2.x){
            this.gotoXY(this.sign2.x,this.sign2.y);
            for(let i=8;i<this.positionCoins.length;i++){//Vai recreiar as coins do CPU
                this.coins.create(this.positionCoins[i][0],this.positionCoins[i][1],'coins').body.setSize(10,15).setOffset(11,7);
            }
        }
        else{
            this.gotoXY(originX,originY);
            for(let i=12;i<this.positionCoins.length;i++){//recria as coins do CPU a partir do spawnpoint
                this.coins.create(this.positionCoins[i][0],this.positionCoins[i][1],'coins').body.setSize(10,15).setOffset(11,7);
            }
        }
    }

    morte(){
        let originX=32;
        let originY=525;
        let offset=50;
        if(this.armor == 0 && this.armorLost==0) {
            this.lifes -= 1;
            var sound=this.sound.add('deathSound',{
                delay: 0,
                volume: 0.5
            });
            sound.play();
            if(this.lifes==0){
                this.end=1;
                this.scene.stop();
                this.scene.start("loseGameScene",{theme:"desert",backKey:"backgroundDeserto"});
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
            } else{
                this.player.body.x = this.sign.body.x;
                this.player.body.y = this.sign.body.y-offset;
                this.score = this.scoreSpawnPoint;
                this.vidas.setText('Coins: ' + this.score + '\n    x' + this.lifes);
                let i;
                let coins = this.coins.getChildren();
                for (i = 5; i < 6; i++) {
                    coins[i].enableBody(true, this.positionCoins[i][0], this.positionCoins[i][1], true, true);
                }
            }
        }
        else if(this.armor==1 && this.armorLost==0){
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
            var sound=this.sound.add('catchCoinSound',{
                delay: 0,
                volume: 0.5
            });
            sound.play();
        }
    }

    endLevel(player,bau){
        this.end=1;
        var tempoFinal=this.time.now;
        this.tempoTotal+=tempoFinal;
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
        this.time.addEvent({
            delay:500,
            callback: ()=>{
                if(player==this.player){
                    this.scene.start("winScene",{score:this.score,lifes:this.lifes,time:this.tempoTotal,player:this.playerKey,cpu:this.cpuKey,headFile:this.headKey,collisionFile:this.collisionKey,theme:'desert',key:'winGameScene'});
                }
                else{
                    this.scene.start("loseScene",{score:this.score,lifes:this.lifes,time:this.tempoTotal,player:this.playerKey,cpu:this.cpuKey,headFile:this.headKey,collisionFile:this.collisionKey,theme:'desert',key:'winGameScene'});
                }
                this.scene.stop();
            }
        });
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
            var sound=this.sound.add('catchCaixaSound',{
                delay: 0,
                volume: 0.5
            });
            sound.play();
        }
    }

    overSign(){
        if(this.flagHelper === 0){
            this.flagHelper=1;
            this.spawnpoint=1;
        }
    }

    gotoXY(x,y){
        this.cpu.anims.play('rightCPU',true);
        this.cpu.body.x = x;
        this.cpu.body.y = y;
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
        return this.colision("MapaD");
    }

    returnCollisionAreia(){
        return this.colision("MapaAreia");
    }

    returnCollisionCactos(player, cactos){
        return this.colisionEnemy(cactos, this.collisionKey, "cactoC");
    }

    colisionEnemy(sprite, keyPlayer, keyCacto) {
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
                let temp2=this.textures.getPixelAlpha(spriteOffsetX,spriteOffsetY,keyCacto);
                if(temp1>0 && temp2>0){
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
        let alphaPixelCabecaMeioAtras=this.textures.getPixelAlpha(Math.round(this.player.body.position.x),Math.round(this.player.body.position.y+heigth/2),key)//checa a colisao com o meio da cabeça frontal
        return  alphaPixelPesFim>0 || alphaPixelPesInicio>0 || alphaPixelPesMeio>0 || alphaPixelCabecaTopoEsquerdo>0 || alphaPixelCabecaTopoMeio>0 || alphaPixelCabecaTopoFrente>0 || alphaPixelCabecaMeioFente>0 || alphaPixelCabecaMeioAtras>0;

    }
}