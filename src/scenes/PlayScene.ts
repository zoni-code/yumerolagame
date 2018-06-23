import { ElapsedTimeIndicator, LifeIndicator, MonkeyIndicator, TaitaiIndicator } from "../objects/Indicators";
import { Player } from "../objects/Player";
import { Events } from "../utils/Events";
import { Something } from "../objects/Something";
import { Monkey } from "../objects/Monkey";

class PlayScene extends Phaser.Scene {

    private manager: Manager;

    constructor() {
        super({
            key: "PlayScene"
        });
    }

    preload() {
        this.load.spritesheet("rola", "assets/rola.png", { frameWidth: 87, frameHeight: 62 });
        this.load.image("taitai", "assets/taitai.png");
        this.load.image("monkey", "assets/monkey.png");
        this.load.image("oke", "assets/oke.png");
        this.load.image("bg", "assets/bg.png");
    }

    create() {
        this.physics.world.setBounds(20, -30, 320, 585);
        this.manager = new Manager(this);
    }

    update() {

    }
}

class Manager {

    private player: Player;
    private monkeys: {[key: number]: Monkey};
    private lifeIndicator: LifeIndicator;
    private monkeyIndicator: MonkeyIndicator;
    private elapsedTimeIndicator: ElapsedTimeIndicator;
    private taitaiIndicator: TaitaiIndicator;

    private startTime: number;
    private isDragging: boolean;
    private isPaused: boolean;

    private firstMaxMonkeys: int = 1;
    private secondMaxMonkeys: int = 10;
    private monkeyDestroyed = 0;

    constructor(private scene: Phaser.Scene) {
        this.init();
    };

    init() {
        this.scene.add.sprite(180, 320, "bg");

        this.player = new Player(this.scene);
        this.lifeIndicator = new LifeIndicator(this.scene, this.player.life);
        this.monkeyIndicator = new MonkeyIndicator(this.scene, this.secondMaxMonkeys, this.monkeyDestroyed);
        this.startTime = new Date().getTime();
        this.elapsedTimeIndicator = new ElapsedTimeIndicator(this.scene, this.startTime);
        this.taitaiIndicator = new TaitaiIndicator(this.scene);

        this.scene.input.keyboard.on("keydown_SPACE", (event) => {
            this.player.taitai = true;
        });
        this.scene.input.keyboard.on("keydown_LEFT", (event) => {
            this.player.toLeft();
        });
        this.scene.input.keyboard.on("keyup_LEFT", (event) => {
            this.player.stop();
        });
        this.scene.input.keyboard.on("keydown_RIGHT", (event) => {
            this.player.toRight();
        });
        this.scene.input.keyboard.on("keyup_RIGHT", (event) => {
            this.player.stop();
        });
        this.scene.input.on("pointerdown", (pointer: Phaser.Geom.Point) => {
            this.isDragging = true;
            const thresholdX = this.scene.sys.game.config["width"] / 2;
            const thresholdY = this.scene.sys.game.config["height"] - 70;
            if (pointer.y > thresholdY) {
                this.player.taitai = true;
            } else if (pointer.x < thresholdX) {
                this.player.toLeft();
            } else {
                this.player.toRight();
            }
        }, this);
        this.scene.input.on("pointerup", (pointer: Phaser.Geom.Point) => {
            this.isDragging = false;
            this.player.stop();
        }, this);

        this.scene.events.on(Events.MONKEY_DESTROY, (monkey) => {
            this.monkeys[monkey.position] = null;
            this.monkeyDestroyed++;
            this.monkeyIndicator.setDestroyedMonkeys(this.monkeyDestroyed);
            window.setTimeout(() => {
                if (this.monkeyDestroyed === this.firstMaxMonkeys) {
                    // this.scene.physics.pause();
                    // this.scene.events.emit(Events.GAME_STOP);
                    // this.isPaused = true;
                    // window.setTimeout(() => {
                    //     this.changeSetting(this.secondMaxMonkeys);
                    //     // TODO: 敵の数が増えた。おもしろいじゃない
                    //     this.addMonkeyPosition();
                    //     this.scene.physics.resume();
                    //     this.scene.events.emit(Events.GAME_RESUME);
                    //     this.isPaused = false;
                    // }, 2000);
                }
                if (this.monkeyDestroyed === this.secondMaxMonkeys) {
                    this.toEnd(true);
                }
            }, 110);
        });

        this.scene.events.on(Events.MONKEY_THROW, (something: Something) => {
            this.bindPlayerAndSomething(this.player, something);
        });

        this.scene.events.on(Events.PLAYER_BOUNCED, (something: Something) => {
            Object.keys(this.monkeys).forEach((key) => {
                const monkey = this.monkeys[key];
                if (monkey) {
                    this.bindMonkeyAndSomething(this.monkeys[key], something);
                }
            });
        });

        this.scene.events.on(Events.PLAYER_LIFE_CHANGED, (life: number) => {
            this.lifeIndicator.update(life);
        });

        this.scene.events.on(Events.PLAYER_DEAD, () => {
            this.toEnd(false);
        });

        this.scene.events.on(Events.GAME_STOP, () => {
            this.elapsedTimeIndicator.stop();
        });

        this.scene.events.on(Events.GAME_RESUME, () => {
            this.elapsedTimeIndicator.resume();
        });

        this.monkeys = {
            [MonkeyPosition.FRONT] : new Monkey(this.scene, 1),
            [MonkeyPosition.CENTER]: new Monkey(this.scene, 2),
            [MonkeyPosition.BACK]: new Monkey(this.scene, 3)
        };
        this.initMonkey();
        this.startMonkeyInterval();
    }

    changeSetting = (maxMonkeys: int) => {
        this.monkeyIndicator.setMaxMonkeys(maxMonkeys);
    };

    private initMonkey() {
        Object.keys(this.monkeys).forEach((key) => {
            this.monkeys[key].init();
        });
    }

    private startMonkeyInterval() {
        window.setInterval(() => {
            if (!this.isPaused) {
                this.createMonkey();
            }
        }, 1000);
    }

    private createMonkey() {
        Object.keys(this.monkeys).forEach((key) => {
            if (this.monkeys[key] === null) {
                this.monkeys[key] = new Monkey(this.scene, parseInt(key, 10));
                window.setTimeout(() => {
                    this.monkeys[key].init();
                }, 1000);
            }
        });
    }
    private addMonkeyPosition() {
        this.monkeys = {
            [MonkeyPosition.FRONT] : new Monkey(this.scene, 1),
            [MonkeyPosition.CENTER]: new Monkey(this.scene, 2),
            [MonkeyPosition.BACK]: new Monkey(this.scene, 3)
        };
        this.initMonkey();
    }

    private toEnd(isClear: boolean) {
        this.scene.scene.start("EndScene", {
            isClear: isClear,
            elapsedTime: new Date().getTime() - this.startTime
        });
    }

    private bindPlayerAndSomething = (player: Player, something: Something) => {
        this.scene.physics.add.collider(
            this.player.getSubstance() as Phaser.Physics.Body, something.getSubstance() as Phaser.Physics.Body,
            () => {
                this.player.catch(something)
            }
        );
    };

    private bindMonkeyAndSomething = (monkey: Monkey, something: Something) => {
        this.scene.physics.add.collider(
            monkey.getSubstance() as Phaser.Physics.Body, something.getSubstance() as Phaser.Physics.Body,
            () => {
                monkey.catch(something)
            }
        );
    };
}

export enum MonkeyPosition {
    FRONT = 1,
    CENTER = 2,
    BACK = 3
}
export default PlayScene;
