import {CAMERA_SCROLL_DELTA} from '../../../constants.js';

export class PlayerPlane {
  scene = null;
  planeSprite = null;
  planeInitialY = -10;
  left_key = null;
  right_key = null;

  constructor(scene, x, y, towerDefenceTileTexture, tileArrayItem) {
    this.scene = scene;
    // console.log("player_plane:7 towerDefenceTileTexture::", towerDefenceTileTexture);
    // console.log("player_plane:8 tileArrayItem::", tileArrayItem);

    this.planeInitialY = y;

    // console.log("player_plane:10 x::", x);
    // console.log("player_plane:11 y::", y);
    this.planeSprite = this.scene.add
      .sprite(50, 50, towerDefenceTileTexture, tileArrayItem)
      .setOrigin(0.5);

    this.planeSprite.angle = -90;
    this.planeSprite.x = x;
    this.planeSprite.y = y;

    this.left_key = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT,
    );
    this.right_key = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    );
    // this.airplane_sprite.y = this.game.config.height - 150;
    // this.airplane_sprite.x = (this.game.config.width - 32) / 2;
  }

  update(cameraYPos) {
    // console.log("player_plane:20 cameraYPos::", cameraYPos);
    if (this.left_key.isDown) {
      if (this.debug_key_logging_enabled) console.log("left isdown :>> ");
      this.planeSprite.x -= 2;
    }

    if (this.right_key.isDown) {
      if (this.debug_key_logging_enabled) console.log("right isdown :>> ");
      this.planeSprite.x += 2;
    }

    if (cameraYPos <= 0) 
        this.planeSprite.y = this.planeInitialY
    else
        this.planeSprite.y -= CAMERA_SCROLL_DELTA;


  }
}
