import { Bullet } from "./objects/bullet.js";
import { PlayerPlane } from "./objects/player_plane.js";

export class SpritesManager {
  spriteArray = [];
  scene = null;
  bulletSprite = null;
  playerPlane = null;
  constructor(scene) {
    this.scene = scene;
    // this.scene.load.image('bullet', '../../../img/bullet.png');
    // this.bulletSprite = this.scene.add.sprite(50, 50, 'bullet').setOrigin(0.5);
  }

  update(cameraYPos) {
    // console.log('SpritesHolder update called :>> ', cameraYPos);
    for (var sprIdx in this.spriteArray) {
      this.spriteArray[sprIdx].update(cameraYPos);
    };

    this.playerPlane.update(cameraYPos);
  }

  createBullet(x, y) {
    this.spriteArray.push(new Bullet(this.scene, x, y));
    // console.log("spritesManager:26 this.spriteArray::", this.spriteArray);
  }

  createPlayerPlane(x, y, towerDefenceTileTexture, tileArrayItem) {
    this.playerPlane = new PlayerPlane(
      this.scene,
      x,
      y,
      towerDefenceTileTexture,
      tileArrayItem,
    );
    return this.playerPlane;
  }
}
