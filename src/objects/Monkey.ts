import { HasSubstance } from "./HasSubstance";
import { Something } from "./Something";
import { MonkeyPosition } from "../scenes/PlayScene";
import { Events } from "../utils/Events";

export class Monkey implements HasSubstance {
    private substance: Phaser.Physics.Arcade.Sprite;
    private moveTimer: number;
    private throwTimer: number;
    private gameWidth = parseInt(this.scene.sys.game.config["width"], 10);

    constructor(private scene: Phaser.Scene, public readonly position: MonkeyPosition) {
        this.substance = scene.physics.add.sprite(this.gameWidth * Math.random(), 0, "monkey");
        this.substance.visible = false;
    };

    init = () => {
        this.substance.visible = true;
        this.substance.setY(95 + this.substance.height * ( this.position * 0.75) - this.substance.height / 2);
        this.substance.setAlpha(0.8);
        this.substance.setBounce(0);
        this.substance.setCollideWorldBounds(true);
        (this.substance as Phaser.Physics.Body).body.onWorldBounds = true;

        this.moveTimer = window.setInterval(() => {
            this.moveRandom();
        }, 100 + Math.random() * 500);
        window.setTimeout(() => {
            this.throwInterval();
        }, 2000 + Math.random() * 500);
        this.moveRandom();
    };

    catch = (something: Something) => {
        if (something.isBounced) {
            something.destroy();
            this.destroy();
        }
    };

    throw = () => {
        const something = new Something(this.scene, this.substance.x, this.substance.y, this.substance.height);
        this.scene.events.emit(Events.MONKEY_THROW, something);
        if (this.substance) {
            this.substance.setVelocityX(0);
        }
    };

    moveRandom = () => {
        this.substance.setVelocityX(2 * (this.gameWidth * Math.random() - this.gameWidth / 2));
    };

    destroy = () => {
        window.clearInterval(this.moveTimer);
        window.clearTimeout(this.throwTimer);
        this.substance.destroy();
        this.scene.events.emit(Events.MONKEY_DESTROY, this);
    };

    getSubstance = () => {
        return this.substance;
    };

    private throwInterval = () => {
        if (Math.random() < 0.5) {
            this.throw();
        }
        this.throwTimer = window.setInterval(() => {
            window.clearInterval(this.throwTimer);
            this.throwInterval()
        }, 1000  + Math.random() * 500);
    };
}
