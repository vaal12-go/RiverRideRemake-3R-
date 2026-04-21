import { RiverRaidScene } from "./scenes/main_game/river_raid_scene.js";
import {TILE_WIDTH_HEIGHT} from './constants.js'

export function initGame() {
    console.log('Hello from initGame :>> ');
    window.onload = () => {
        const config = {
          renderType: Phaser.CANVAS,
          width: 20*TILE_WIDTH_HEIGHT, //640, //20 tiles of 32px
          height: 864, //27 tiles of 32px
          scene: RiverRaidScene,
          parent: "phaser-game-parent",
          // zoom: 1,
          roundPixels: false,
          // pixelArt: true
          render: {
            //pixelArt: true, // enabling this appears to "fix" it
            antialias: false,
          },
        };
        const game = new Phaser.Game(config);
      };
}