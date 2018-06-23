import { HasSubstance } from "./HasSubstance";
import { Events } from "../utils/Events";

export class Something implements HasSubstance {
    public readonly damage: int = 0.5;
    private readonly substance: Phaser.Physics.Arcade.Sprite;
    private destoryTimer: number;
    public isBounced: boolean = false;

    constructor(private scene: Phaser.Scene, initialX: number, initialY: number, monkeyHeight: number) {
        this.substance = scene.physics.add.sprite(initialX, initialY + monkeyHeight, "oke");
        this.substance.setVelocityY(400);
        this.substance.setVelocityX(100 * Math.random() - 50);
        this.substance.setZ(200);

        this.destoryTimer = window.setInterval(() => {
            if (
                this.substance.x < -50 || this.substance.x > 700
                || this.substance.y < -50|| this.substance.y > 700
            ) {
                this.destroy();
            }
        }, 3000);
    };

    destroy = () => {
        this.substance.destroy();
        window.clearInterval(this.destoryTimer);
        this.scene.events.emit(Events.SOMETHING_DESTROY, this);
    };

    getSubstance = () => {
        return this.substance;
    };
}
