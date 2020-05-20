//Basically DONE

/*
 * 0 => Joquinha
 * 1 => Loretinho
 * 2 => Mimi
 */

class PlayerScene extends Phaser.Scene {

    constructor() {
        super({key: 'chooseScene'});
    }

    preload(){
        this.load.image('Joquinha','assets/images/Menus/images/idle/joao_idle.png');
        this.load.image('Loretinho','assets/images/Menus/images/idle/loretinho_idle.png');
        this.load.image('Mimi','assets/images/Menus/images/idle/mimi_idle.png');

    }

    create(){

        var count = 1;
        this.playerKey="playerLoreto";
        this.cpuKey="cpuMimi";
        this.headKey="cabecaLoreto";
        this.collisionKey="PlayerCollisionLoreto";
        this.playerMorto="mortoL";

        let window_info = this.add.sprite(0,0,'w_450x300_mountain').setOrigin(0,0);
        let text_info = this.add.bitmapText(150,30,'pixel','Informações',20).setOrigin(0.5);
        this.text_char = this.add.bitmapText(150,160,'pixel','',15).setOrigin(0.5);

        let backButton = this.add.sprite(25,20,'backButton')
            .setInteractive({useHandCursor: true})
            .on('pointerdown',() => {this.scene.start("principalScene");});

        this.add.container(90,75,[window_info,text_info,backButton]);

        this.add.container(90,75,[window_info,text_info,this.text_char,backButton]);



        let window_im = this.add.sprite(0,0,'w_300x300_mountain').setOrigin(0,0);
        this.prevChar = this.add.sprite(40,150,'backButton').setScale(1.5).setInteractive({useHandCursor: true})
            .on('pointerdown',() => {
                count--;
                this.changeChar(count);
                console.log(count);
            });
        this.nextChar = this.add.sprite(260,150,'nextButton').setScale(1.5).setInteractive({useHandCursor: true})
            .on('pointerdown',() => {
                count++;
                this.changeChar(count);
                console.log(count);
            });

        this.add.container(410,130,[window_im,this.nextChar,this.prevChar]);




        let buttonSP = this.add.sprite(0,0,'btn_300x35_mountain',0);
        let textSP = this.add.bitmapText(0,0,'pixel','Jogar Modo SinglePlayer',15).setOrigin(0.5);

        this.add.container(560,455,[buttonSP,textSP])// Ao clicar no botao do SinglePlayer, modo de treino
            .setSize(300,35)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown',() => {
                buttonSP.setFrame(1);
                textSP.y = 5;

            })
            .on('pointerup',() => {
                buttonSP.setFrame(0);
                textSP.y = 0;
                this.scene.stop();
                this.scene.start ("chooseScenarioScene",{player:this.playerKey,headFile:this.headKey,collisionFile:this.collisionKey});
                this.scene.stop("background");
                this.scene.stop("audioManager");
            });

        let buttonC = this.add.sprite(0,0,'btn_300x35_mountain',0);
        let textC = this.add.bitmapText(0,0,'pixel','Jogar Modo Corrida',15).setOrigin(0.5);

        this.add.container(560,500,[buttonC,textC])// Ao clicar no modo corrida prepara para as 3 corridas
            .setSize(300,35)
            .setInteractive({useHandCursor:true}, Phaser.Geom.Rectangle.Contains)
            .on('pointerdown',() => {
                buttonC.setFrame(1);
                textC.y = 5;

            })
            .on('pointerup',() => {
                buttonC.setFrame(0);
                textC.y = 0;
                this.scene.run("montanha1v1",{player:this.playerKey,cpu:this.cpuKey,headFile:this.headKey,collisionFile:this.collisionKey});
                this.scene.stop();
                this.scene.stop("background");
                this.scene.stop("audioManager");
            });



        //INICIALIZAÇÃO DOS BONECOS
        this.nameChar = this.add.bitmapText(560,100,'pixel',"",30).setOrigin(0.5);

        this.boneco = this.add.sprite(400+150,130+150,"").setScale(0.9);

        this.changeChar(count);

    }

    changeChar(id) {
        if(id==0){
        //ter botão para voltar atrás escondido
            this.showchar("Joquinha",
                "Com o seu amor por\naventuras e tesouros, passou\nanos da sua vida à procura do\nfantástico tesouro da montanha\nmisteriosa. Ele sabe tudo sobre\neste tesouro e é quem lidera\na esquipa por esta grande\naventura!");
            this.prevChar.visible = false;
            this.playerKey="playerJoao";
            this.cpuKey="cpuLoreto";
            this.headKey="cabecaJoao";
            this.collisionKey="PlayerCollisionJoao";
        }
        else if(id==1){
            this.showchar("Loretinho",
                "A nossa Loretinho é o apoio\nemocional da equipa. Sempre\npronta a acalmar todos em\nalturas de maior tensão.\nQuando a equipa se encontra\nem perigo, é a Loretinho que\nsempre ajuda!");
            this.prevChar.visible = true;
            this.nextChar.visible = true;
            this.playerKey="playerLoreto";
            this.cpuKey="cpuMimi";
            this.headKey="cabecaLoreto";
            this.collisionKey="PlayerCollisionLoreto";
        }
        else if(id==2){
            this.showchar("Mimi",
                "Mimi é muito curiosa e aventu-\nreira, sempre pronta para uma\nnova aventura. Do grupo, é a\nmais destemida e a que sempre\nconvence o grupo a ir mais\nlonge!");
            this.nextChar.visible = false;
            this.playerKey="playerMimi";
            this.cpuKey="cpuJoao";
            this.headKey="cabecaMimi";
            this.collisionKey="PlayerCollisionMimi";
        }
    }

    showchar(name/*, power*/){
        //VER FORMA DE FAZER SET EM VEZ DE ATUALIZAR NOVAMENTE
        this.nameChar.setText(name);
        this.boneco.setTexture(name);


        //INFO DO TEXTO
    }

    showchar(name,text){
        this.nameChar.setText(name);
        this.boneco.setTexture(name);
        this.text_char.setText(text);
    }
}
