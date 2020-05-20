class audioManager extends Phaser.Scene{

    constructor() {
        super({key: "audioManager"});
    }

    preload(){}

    /**
     * NOTA:
     * Recent versions of Chrome require the user to interact with the page in some way before they allow it to play audio.
     */

    create(){
        this.theme = this.sound.add('themeSong',{
            loop: true,
            delay: 0,
            volume: 0.3
        });
        this.theme.play();
    }

    more_volume(){
        this.theme.volume+=0.1;
    }

    less_volume(){
        if(this.theme.volume>0.1) {
            this.theme.volume -= 0.1;
        }
    }

    no_volume(){
        this.theme.mute = !this.theme.mute;
    }
}
