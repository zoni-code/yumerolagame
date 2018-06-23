export class ElapsedTimeIndicator {
    private readonly substance: Phaser.GameObjects.Text;
    private timer: number;
    private second: number = 0;

    constructor(private scene: Phaser.Scene, startTime: number) {
        this.substance = this.scene.add.text(10, 0, this.createString()).setColor("#000").setFontSize("12px");
        this.substance.setY(this.scene.sys.game.config["height"] - 7 - this.substance.height);
        this.substance.setDepth(1);
        this.startTimer();
    };

    stop = () => {
        window.clearTimeout(this.timer);
    };

    resume = () => {
        this.startTimer();
    };

    private startTimer = () => {
        this.timer = window.setInterval(() => {
            this.second += 0.1;
            this.substance.setText(this.createString())
        }, 100);
    };

    private createString = () => {
        return "TIME " + this.second.toFixed(1);
    }
}

export class MonkeyIndicator {
    private readonly substance: Phaser.GameObjects.Text;
    private maxMonkeys: number;
    private destroyedMonkeys: number;

    constructor(private scene: Phaser.Scene, maxMonkeys: number, destroyedMonkeys: number) {
        this.maxMonkeys = maxMonkeys;
        this.destroyedMonkeys = destroyedMonkeys;
        this.substance = this.scene.add.text(10, 0, this.createString());
        this.substance.setY(this.scene.sys.game.config["height"] - 13 - this.substance.height * 2);
        this.substance.setDepth(1);
        this.setText(this.substance);
    };

    setDestroyedMonkeys = (destroyedMonkeys: number) => {
        this.destroyedMonkeys = destroyedMonkeys;
        this.setText(this.substance);
    };

    setMaxMonkeys = (maxMonkeys: number) => {
        this.maxMonkeys = maxMonkeys;
        this.setText(this.substance);
    };

    private setText = (text: Phaser.GameObjects.Text) => {
        return text.setText(this.createString()).setColor("#000").setFontSize("12px");
    };

    private createString = (): string => {
        return `SARU ${this.destroyedMonkeys}/${this.maxMonkeys}`;
    }
}

export class LifeIndicator {
    private readonly substance: Phaser.GameObjects.Text;
    private life: number;

    constructor(private scene: Phaser.Scene, initialLife: number) {
        this.life = initialLife;
        this.substance = this.scene.add.text(10, 10, this.createString()).setColor("#000").setFontSize("12px");
        this.substance.setY(this.scene.sys.game.config["height"] - 7 - this.substance.height * 2);
        this.substance.setDepth(1);
    };

    update = (life: number) => {
        this.life = life;
        this.substance.setColor("#000").setText(this.createString());
    };
    private createString = (): string => {
        return `LIFE ${this.life}`;
    }
}

export class TaitaiIndicator {
    private readonly substance: Phaser.GameObjects.Sprite;

    constructor(private scene: Phaser.Scene) {
        this.substance = this.scene.add.sprite(
            this.scene.sys.game.config["width"] / 2,
            this.scene.sys.game.config["height"] - 30,
            "taitai"
        );
        this.substance.setOrigin(0.5, 0.5).setInteractive();
    };
}
