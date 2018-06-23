import { HasSubstance } from "./HasSubstance";
import { Something } from "./Something";
import { Events } from "../utils/Events";

export class Player implements HasSubstance {
    public life: int = 3;
    private readonly substance: Phaser.Physics.Arcade.Sprite;
    private isTaitai: boolean;
    private taitaiTimer: number;

    constructor(private scene: Phaser.Scene) {
        this.substance = scene.physics.add.sprite(
            this.scene.sys.game.config["width"] / 2,
            525,
            "rola");
        this.substance.setOrigin(0.5, 0.5);
        this.substance.setBounce(0);
        this.substance.setCollideWorldBounds(true);

        this.scene.anims.create({
            key: 'taitai',
            frames: this.scene.anims.generateFrameNumbers('rola', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: 1
        });

        this.scene.anims.create({
            key: 'stop',
            frames: [ { key: 'rola', frame: 0 } ],
            frameRate: 20
        });
    };

    catch = (something: Something) => {
        if (this.isTaitai) {
            this.bounce(something);
        } else {
            this.getDamage(something);
        }
    };

    bounce = (something: Something) => {
        const diff = this.substance.x - something.getSubstance().x;
        something.getSubstance().setVelocityY(-900);
        something.getSubstance().setVelocityX(- diff);
        something.isBounced = true;
        this.scene.events.emit(Events.PLAYER_BOUNCED, something);
    };

    getDamage = (something: Something) => {
        this.life -= something.damage;
        something.destroy();
        if (this.life === 0) {
            this.scene.events.emit(Events.PLAYER_DEAD);
        } else {
            this.scene.events.emit(Events.PLAYER_LIFE_CHANGED, this.life);
        }
    };

    toRight = () => {
        this.substance.setVelocityX(400);
    };

    toLeft = () => {
        this.substance.setVelocityX(-400);
    };

    stop = () => {
        this.substance.setVelocityX(0);
    };

    getSubstance = () => {
        return this.substance;
    };

    get taitai() {
        return this.isTaitai;
    }

    set taitai(value) {
        this.isTaitai = value;
        if (this.isTaitai) {
            window.clearTimeout(this.taitaiTimer);
            this.substance.anims.play("taitai");

            this.taitaiTimer = window.setTimeout(() => {
                this.substance.anims.play("stop");
                this.isTaitai = false;
            }, 500);
        }
    }
}
