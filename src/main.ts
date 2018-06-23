import 'phaser';

import PlayScene from './scenes/PlayScene';
import EndScene from './scenes/EndScene';
import StartScene from "./scenes/StartScene";

const config:GameConfig = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 360,
    height: 640,
    resolution: 1, 
    backgroundColor: "#EDEEC9",
    scene: [
        StartScene, PlayScene, EndScene
    ],
    physics: {
        default: 'arcade'
    },
};

new Phaser.Game(config);
