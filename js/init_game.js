import { RiverRaidScene } from "./scenes/main_game/river_raid_scene.js";
import {TILE_WIDTH_HEIGHT} from './constants.js'

export function initGame() {
    console.log('Hello from initGame :>> ');
    window.onload = () => {
        const config = {
          type: Phaser.AUTO,
          width: 20*TILE_WIDTH_HEIGHT, //640, //20 tiles of 32px
          height: 864, //27 tiles of 32px
          scene: RiverRaidScene,
          parent: "phaser-game-parent",
        };
        const game = new Phaser.Game(config);
      };
}