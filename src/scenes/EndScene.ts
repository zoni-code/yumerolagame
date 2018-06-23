import TwitterUtil from "../utils/TwitterUtil";

class EndScene extends Phaser.Scene {

    constructor() {
        super({
            key: "EndScene"
        });
    }

    preload() {
        this.load.image("mushroom", "assets/sprites/mushroom.png");
    }

    create() {
        this.add.text(10, 20, "クリア").setColor("#000").setInteractive();
        const tweetButton = this.add.text(100, 200, "ツイート").setColor("#000").setInteractive();
        tweetButton.on('pointerdown', function () {
            TwitterUtil.openTweetWindow(this.isClear, this.time);
        });
    }
}

export default EndScene;
