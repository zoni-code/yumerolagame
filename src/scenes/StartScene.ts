class StartScene extends Phaser.Scene {

    constructor() {
        super({
            key: "StartScene"
        });
    }

    preload() {
        this.load.image("bg", "assets/bg.png");
    }

    create() {
        this.add.sprite(180, 320, "bg");

        document.querySelector('#content').addEventListener('click', () => {
            var canvas = this.sys.game.canvas;
            var fullscreen = this.sys.game.device.fullscreen;
            canvas[fullscreen.request]();
        });

        this.input.on("pointerdown", this.toPlayScence, this);
        this.input.keyboard.on("keydown_SPACE", this.toPlayScence);
    }

    toPlayScence = () => {
        this.input.off("pointerdown", this.toPlayScence, this, null);
        this.input.keyboard.off("keydown_SPACE", this.toPlayScence, null, null);
        this.scene.start("PlayScene");
    };
}

export default StartScene;
