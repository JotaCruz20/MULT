class montanha1v1 extends Phaser.Scene{
    constructor() {
        super({key:"montanha1v1"});//key da scene
    }

    init(data){//vai receber os dados sobre o personagem escolhido
        this.playerKey=data.player;
        this.cpuKey=data.cpu;
        this.headKey=data.headFile;
        this.collisionKey=data.collisionFile;
    }

    preload(){}

    create(){
        this.scene.launch('background',{backKey:'backgroundMountain'});
        //Mapa
        this.map = this.make.tilemap({key:"map"});
        //this.background=this.add.image(0,0,'background').setOrigin(0,0);
        this.tiles = this.map.addTilesetImage("montanha 1","tile_set");
        this.rochas= this.map.addTilesetImage('spritesheet','rochas');
        this.layerRochas=this.map.createStaticLayer('Rochas',[this.rochas],0,0);
        this.layerGround = this.map.createStaticLayer("Map_Ground", [this.tiles],0,0);
        this.layerDivisor = this.map.createStaticLayer("divisor", [this.tiles],0,0);
        this.layerGround.setCollisionByProperty({collides:true});
        this.layerDivisor.setCollisionByProperty({collides:true});
        this.stairs = this.physics.add.staticSprite(530 ,544,'stairs');
        this.stairs.setSize(20,90);
        this.stairs.setScale(2,3);
        this.stairs2 = this.physics.add.staticSprite(528 ,258,'stairs').setScale(2,3);
        this.sign=this.physics.add.staticSprite(2130,530,'sign');
        this.sign2=this.physics.add.staticSprite(2130,245,'sign');
        this.pause=this.physics.add.staticSprite(770,30,'pauseButton').setScale(0.05,0.05);
        this.pause.setInteractive({useHandCursor: true}).on('pointerdown',() => {this.scene.launch("pauseScene",{key:"montanha1v1",theme:"mountain"}); this.scene.pause()});
        this.pause.setScrollFactor(0);
        this.pause.setDepth(10);

        //Variaveis de Jogo
        this.modo=1;//Variavel sobre o estado da personagem, frente,saltar ou tras, 1->frente, 2->tras e 3->salto
        this.lifes=3;//Vidas do player
        this.score=0;//Score do player
        this.scoreSpawnPoint=0;//Serve para saber o score do player a quando de chegar ao spawnpoint, pois ele fica com este score caso morra
        this.spawnpoint=0;//Se chegou ao spawnpoint ou não
        this.flagCabras=0;//Maneira de saber se as cabras estao a andar para direita ou esquerda
        this.flagHelper=0;//Flag para saber se mostrar o Menu de Ajuda ao Player
        this.flagCaixa=0;//Flag para saber se mostrar o menu de ajuda da caixa ao Player
        this.armorLost=0;//Flag para saber se o player acabou de perder a armadura
        this.armor=0;//Flag para saber se o user tem armadura ou nao
        this.end=0;//Flag para saber se o jogo foi terminado
        this.mapaAlturaMetade=366;//Altura do Mapa na personagem
        //este array vai conter as posicoes onde o CPU vai ter de alterar o seu comportamento, seja para subir, saltar ou descer
        this.arrayPosicoesCPU=[60,265,400,440,715,762,815,1005,1545,1620,1630,1650,1690,1740,1760,1865,2400,2435,2470,2500,2510,2520,2550,2560,2670,2740,2780,2790,2800,2830,3175,3280,3675,3785,3850,3900];
        //este array vai conter os movimentos que o CPU vai ter de executar ao encontrar a posição i, ou seja, a chegar a arrayPosicoesCPU[i] faz o movimento gotoPosicoesCPU[i]
        this.gotoPosicoesCPU=[[1.5,0],[1.5,-1],[1.5,0],[2.5,-8],[2,0],[1.5,-6],[2.5,0],[2,-1],[2,0],[2,-8],[1.5,0],[2,-8],[1.5,0],[2,-6],[1.5,0],[2.5,-6],[1.5,0],[1,-4],[1,-8],[1.5,-8],[1.5,0],[1.5,-8],[2,-8],[2,-10],[1.5,0],[2.5,-8],[2,-8],[2,-8],[1.5,0],[2,-10],[1.5,0],[2,-8],[2,0],[2,-7],[3,-8],[2,0]];

        //animations
        this.createAnimations();

        //Controles
        this.controls = this.input.keyboard.createCursorKeys();

        //Player
        //this.player = this.physics.add.sprite(32,600, this.playerKey);
        this.player = this.physics.add.sprite(3300,500, this.playerKey);
        this.player.setSize(40,50);
        this.player.setOffset(11,9);

        //Score
        this.cabeca=this.physics.add.staticImage(50,70,this.headKey);
        this.cabeca.setScrollFactor(0);
        this.vidas=this.add.text(30,30,'Coins: 0\n    x3',{fontSize:'20px',fill:'white'});

        //CPU
       this.cpu=this.physics.add.sprite (32,300, this.cpuKey).setSize(40,50).setOffset(11,9);

        //Enemy
        this.createEnemies();

        //Coins
        this.createCoins();

        //PowerUps
        this.createCaixa();

        //Fim do nivel
        this.createBau();

        //camaras para seguir o jogador
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        //this.background.setScrollFactor(0);
        this.vidas.setScrollFactor(0);

        //colisoes
        this.createColisoes();
    }

    update(){
        let velocityX=160;
        let velocityY=430;
        this.cpuAnim();
        this.startCabra();
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
            frames: this.anims.generateFrameNumbers( this.playerKey, {start: 12, end: 13}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers( this.playerKey, {start: 10, end: 11}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'holdR',
            frames: this.anims.generateFrameNumbers( this.playerKey, {start: 0, end: 4}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'holdL',
            frames: this.anims.generateFrameNumbers( this.playerKey, {start: 5, end: 9}),
            frameRate: 2,
            repeat: -1
        });
        //animaçoes armadura
        this.anims.create({
            key:'leftArmor',
            frames: this.anims.generateFrameNumbers( this.playerKey, {start: 26, end: 27}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'rightArmor',
            frames: this.anims.generateFrameNumbers( this.playerKey, {start: 24, end: 25}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'holdRArmor',
            frames: this.anims.generateFrameNumbers( this.playerKey, {start:14, end: 18}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'holdLArmor',
            frames: this.anims.generateFrameNumbers( this.playerKey, {start: 19, end: 23}),
            frameRate: 2,
            repeat: -1
        });
        //animações perder armadura
        this.anims.create({
            key:'leftArmorPerder',
            frames: this.anims.generateFrameNumbers( this.playerKey, {frames:[12,26,13,27]}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'rightArmorPerder',
            frames: this.anims.generateFrameNumbers( this.playerKey, {frames:[10,24,11,25 ]}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'holdRArmorPerder',
            frames: this.anims.generateFrameNumbers( this.playerKey, {frames: [0,14,1,15,2,16,3,17]}),
            frameRate: 2,
            repeat: -1
        });
        this.anims.create({
            key: 'holdLArmorPerder',
            frames: this.anims.generateFrameNumbers( this.playerKey, {frames:[5,18,6,19,7,20,8,21,9,22]}),
            frameRate: 2,
            repeat: -1
        });
        //animacoes CPU
        this.anims.create({
            key: 'rightCPU',
            frames: this.anims.generateFrameNumbers( this.cpuKey, {start: 10, end: 11}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'holdRCPU',
            frames: this.anims.generateFrameNumbers( this.cpuKey, {start: 0, end: 4}),
            frameRate: 2,
            repeat: -1
        });
        //animaçoes cabra
        this.anims.create({
            key: 'rightCabra',
            frames: this.anims.generateFrameNumbers('cabra', {start: 0, end: 3}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'leftCabra',
            frames: this.anims.generateFrameNumbers('cabra', {start: 4, end: 7}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'rightRunCabra',
            frames: this.anims.generateFrameNumbers('cabra', {start: 8, end: 9}),
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key: 'leftRunCabra',
            frames: this.anims.generateFrameNumbers('cabra', {start: 10, end: 11}),
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
        //array com as posiçoes das moedas
        this.positionCoins=[[616,480],[670,480],[757,558],[1683,558],[2443,645],[2540,635],[2650,600],[2750,600],[3235,500],[616,190],[670,190],[757,264],[1683,273],[2443,360],[2540,346],[2650,300],[2750,300],[3235,205]];
        for(let i=0;i<this.positionCoins.length;i++) {
            this.coins.create(this.positionCoins[i][0], this.positionCoins[i][1], 'coins').body.setSize(10, 15).setOffset(11, 7);
        }

        this.startCoins();
    }

    createEnemies(){
        this.cabras=this.physics.add.group();
        //array com as posiçoes dos inimigos
        this.vetorPosicaoCabras=[[570,460],[2637,600],[3705,600],[570,175],[2637,331],[3705,305]];
        for(let i=0;i<this.vetorPosicaoCabras.length;i++) {
            this.cabras.create(this.vetorPosicaoCabras[i][0],this.vetorPosicaoCabras[i][1] , 'cabra').setScale(0.9).setSize(65, 40).setOffset(2, 30);
        }
        this.physics.add.collider(this.cabras,this.layerGround);
        //vai fazer a animação da cabra andar para direita e esquerda
        this.tweens.add({
            targets: this.cabras.getChildren(),
            duration: 2000,
            repeat: -1,            // -1: infinity
            yoyo: true,
            x:'+=100'
        });
    }

    createColisoes(){
        this.physics.world.setBounds(0,0,4000,704);
        this.layerGround.setCollisionByExclusion([-1]);
        this.layerDivisor.setCollisionByExclusion([-1]);

        //player
        this.player.setCollideWorldBounds(true);
        this.physics.add.overlap(this.player,this.coins,this.catchCoin,null,this);
        this.physics.add.overlap(this.player,this.sign,this.overSign,null,this);
        this.physics.add.overlap(this.player,this.stairs,this.upStair,null,this);
        this.physics.add.overlap(this.player,this.cabras,this.morte,this.returnCollisionCabras,this);
        this.physics.add.overlap(this.player,this.layerRochas,this.morte,this.returnCollisionRochas,this);
        this.physics.add.collider(this.player,this.layerGround,null,this.returnCollisionMapa,this);
        this.physics.add.collider(this.player,this.bau,this.endLevel,null,this);
        this.physics.add.collider(this.player,this.caixa,this.catchCaixa,null,this);
        this.physics.add.collider(this.player,this.layerDivisor);

        //cpu
        this.cpu.setCollideWorldBounds(true);
        this.physics.add.collider(this.cpu, this.layerGround);
        this.physics.add.collider(this.cpu, this.layerDivisor);
        this.physics.add.collider(this.cpu,this.coins,this.catchCoin,null,this);
        this.physics.add.collider(this.cpu,this.caixa);
        this.physics.add.collider(this.cpu,this.bau2,this.endLevel,null,this);
    }

    createCaixa(){
        this.caixa=this.physics.add.staticGroup();
        //array com a posição das caixas
        this.posicaoCaixas=[[156,523],[1718,450],[3769,538],[156,240],[1718,170],[3769,258]];
        for(let i=0;i<this.posicaoCaixas.length;i++) {
            this.caixa.create(this.posicaoCaixas[i][0], this.posicaoCaixas[i][1], 'caixa').setSize(30, 30);
        }
    }

    createBau(){
        //cria 2 baus, 1 para o CPU e outro para o Jogador
        this.bau=this.physics.add.staticSprite(3950,550,"bauF");
        this.bau.setScale(0.5,0.5);
        this.bau.setSize(36,25);
        this.bau.setOffset(17,20);
        this.bau2=this.physics.add.staticSprite(3950,259,"bauF");
        this.bau2.setScale(0.5,0.5);
        this.bau2.setSize(36,25);
        this.bau2.setOffset(17,20);
    }

    startCoins(){
        this.coins.playAnimation('coin',true);
    }

    startCabra(){
        //Função que vai controlar a animaçaão das cabras
        let cabritas = this.cabras.getChildren();
        let offsetPlayerX=200;//Offset do eixo X de onde a cabra se põe em posição de ataque
        let offsetPlayerY=150;//Offset do eixo Y de onde a cabra se põe em posição de ataque
        let velocityX=200;//Velocidade da cabra
        let offsetCabras=100;//Posição final da cabra
        let i=0;
        for (i; i<cabritas.length;i++){
            let cabras=cabritas[i];
            if(((this.player.x>=cabras.x-offsetPlayerX && this.player.x<=cabras.x+offsetPlayerX && this.player.y>=cabras.y-offsetPlayerY && this.player.y<=cabras.y+offsetPlayerY) || (this.cpu.body.x>=cabras.x-offsetPlayerX && this.cpu.body.x<=cabras.x+offsetPlayerY && this.cpu.body.y>=cabras.y-offsetPlayerY && this.cpu.body.y<=cabras.y+offsetPlayerY)) && this.flagCabras==1){
                cabras.anims.play('leftRunCabra',true);
                cabras.setVelocityX(velocityX);
            }
            else if(((this.player.x>=cabras.x-offsetPlayerX && this.player.x<=cabras.x+offsetPlayerX && this.player.y>=cabras.y-offsetPlayerY && this.player.y<=cabras.y+offsetPlayerY) || (this.cpu.body.x>=cabras.x-offsetPlayerX && this.cpu.body.x<=cabras.x+offsetPlayerX && this.cpu.body.y>=cabras.y-offsetPlayerY && this.cpu.body.y<=cabras.y+offsetPlayerY)) && this.flagCabras==0){
                cabras.anims.play('rightRunCabra',true  );
            }
            else if(cabras.x==this.vetorPosicaoCabras[i][0]+offsetCabras){
                cabras.anims.play('leftCabra',true);
                this.flagCabras=1;
            }
            else if(cabras.x==this.vetorPosicaoCabras[i][0]){
                cabras.anims.play('rightCabra',true);
                this.flagCabras=0;
            }
        }
    }

    cpuAnim(){
        //função que vai pegar no array de posiçoes do CPU e vai fazer o comportamento dele atraves do array de goto que vai ter as coordenadas de onde o CPU tem de ir
        let originX=32;
        let originY=150;
        if(this.cpu.body.y==this.mapaAlturaMetade){//quer dizer q morreu
            if(this.cpu.body.x>this.sign2.x){
                this.gotoXY(this.sign2.x,this.sign2.y);
                for(let i=9;i<this.positionCoins.length;i++){//Vai recreiar as coins do CPU
                    this.coins.create(this.positionCoins[i][0],this.positionCoins[i][1],'coins').body.setSize(10,15).setOffset(11,7);
                }
            }
            else{
                this.gotoXY(originX,originY);
                for(let i=9;i<this.positionCoins.length;i++){
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
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[24][0],this.cpu.body.y+this.gotoPosicoesCPU[25][1]);
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
        else if(this.cpu.body.x<this.arrayPosicoesCPU[33]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[33][0],this.cpu.body.y+this.gotoPosicoesCPU[33][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[34]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[34][0],this.cpu.body.y+this.gotoPosicoesCPU[34][1]);
        }
        else if(this.cpu.body.x<this.arrayPosicoesCPU[35]){
            this.gotoXY(this.cpu.body.x+this.gotoPosicoesCPU[35][0],this.cpu.body.y+this.gotoPosicoesCPU[35][1]);
        }

    }

    morte(player,rochas){
        let xOrigin=32;
        let yOrigin=600;
        if (this.armor == 0 && this.armorLost==0) {//se nao tem a armadura
            this.lifes -= 1;//retira uma vida
            var sound=this.sound.add('deathSound',{
                delay: 0,
                volume: 0.5
            });
            sound.play();
            if (this.lifes == 0) {//acaba o jogo
                this.end = 1;
                this.scene.stop();
                this.scene.start("loseGameScene",{theme:"mountain",backKey:"backgroundMountain"});
            }
            this.flagHelper = 0;//Reinicia as flags
            if (this.spawnpoint == 0) {//Verifica se o Player ja passou o spawnPoint ou nao, se nao passar reiniciar tudo
                this.player.body.x = xOrigin;
                this.player.body.y = yOrigin;
                this.score = 0;
                let i;
                let coins = this.coins.getChildren();
                for (i = 0; i < 9; i++) {// de 0 a 9 pois são o numero de moedas correspondentes ao player
                    coins[i].enableBody(true, this.positionCoins[i][0], this.positionCoins[i][1], true, true);
                }
                this.vidas.setText('Coins: ' + this.score + '\n    x' + this.lifes);
            } else {//se ja passou so vai reiniciar depois deste ponto
                this.player.body.x = this.sign.body.x;
                this.player.body.y = this.sign.body.y;
                this.score = this.scoreSpawnPoint;
                this.vidas.setText('Coins: ' + this.score + '\n    x' + this.lifes);
                let i;
                let coins = this.coins.getChildren();
                for (i = 4; i < 9; i++) { // de 4 a 9 pois são o numero de moedas correspondentes ao player que estão apos o spawnpoint
                    coins[i].enableBody(true, this.positionCoins[i][0], this.positionCoins[i][1], true, true);
                }
            }
        } else if(this.armor==1 && this.armorLost==0){//se tem armadura
            this.armorLost = 1;//começa animação de perder aramdura
            this.time.addEvent({//vai verificar se passado 1500ms o user ainda esta em posiçao q causou a morte, e reinicia as flags de armadura
                delay: 1500,
                callback: () => {
                    this.armor = 0;
                    this.armorLost = 0;
                }
            });
        }
    }

    catchCoin(player,coin){
        //Funão efetuada qnd o player apanha uma moeda, aumenta o score e faz essa moeda desaparecer
        coin.disableBody(true, true);
        let velocityY=430;
        if(player==this.player) {
            this.score += 1;
            this.vidas.setText('Score: ' + this.score + '\n    x' + this.lifes);
            if (this.controls.up.isDown) {
                this.player.setVelocityY(-velocityY);
                this.modo = 1;
            }
            if (this.spawnpoint == 0) {//aumenta o ponto tbm caso ainda n tenha passado o spawnpoint
                this.scoreSpawnPoint += 1;
            }
            var sound=this.sound.add('catchCoinSound',{
                delay: 0,
                volume: 0.5
            });
            sound.play();
        }
    }

    catchCaixa(player,caixa){
        //Apanha a caixa so se o player bater com a cabeça
        if(this.player.body.touching.up){
            caixa.anims.play('caixaFade',true);
            this.time.addEvent({
                delay: 500,
                callback: ()=>{
                    caixa.disableBody(true,true);
                }
            });
            if(this.armor==0){
                this.armor=1;
            }
            else {
                this.score += 1;
            }
            if(this.flagCaixa==0){
                this.scene.launch("helperCaixa");
                this.flagCaixa=1;
            }
            var sound=this.sound.add('catchCaixaSound',{
                delay: 0,
                volume: 0.5
            });
            sound.play();
        }
    }

    endLevel(player,bau){
        //Função efetuada ao acabar o nivel, começa o proximo nivel
        this.end=1;
        var tempoFinal=this.time.now;//Calcula o tempo de jogo
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
                    this.scene.start("winScene",{score:this.score,lifes:this.lifes,time:tempoFinal,player:this.playerKey,cpu:this.cpuKey,headFile:this.headKey,collisionFile:this.collisionKey,theme:'mountain',key:'floresta1v1'});
                }
                else{
                    this.scene.start("loseScene",{score:this.score,lifes:this.lifes,time:tempoFinal,player:this.playerKey,cpu:this.cpuKey,headFile:this.headKey,collisionFile:this.collisionKey,theme:'mountain',key:'floresta1v1'});
                }
                this.scene.stop("montanha1v1");
            }
        });

    }

    overSign(player,sign){
        //Faz a scene de ajuda aparecer
        if(this.flagHelper==0){
            this.scene.launch("helperMontanha");
            this.flagHelper=1;
            this.spawnpoint=1;
        }
    }   

    gotoXY(x,y){
        this.cpu.anims.play('rightCPU',true);
        this.cpu.body.x=x;
        this.cpu.body.y=y;
    }

    upStair(player,stairs){
        let velocityY=100;
        if(this.controls.up.isDown){
            this.player.setVelocityY(-velocityY);
        }
        else if(this.controls.down.isDown){
            this.player.setVelocityY(velocityY);
        }
        else{
            this.player.setVelocityY(0);
        }
    }

    returnCollisionMapa(player,ground){
        return this.colision("Mapa");
    }

    returnCollisionRochas(player,layer){
        return this.colision("MapaRochas");
    }

    returnCollisionCabras(player,cabra){
        return this.colisionEnemy(cabra, this.collisionKey, "CabraAtaque1");
    }

    colisionEnemy(sprite,keyPlayer,keyCabra) { // função para o pixel perfect collision, torna o jogo injogavel
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
                let temp2=this.textures.getPixelAlpha(spriteOffsetX,spriteOffsetY,keyCabra);

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