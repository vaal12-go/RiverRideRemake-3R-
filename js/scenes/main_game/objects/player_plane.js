import { CAMERA_SCROLL_DELTA } from "../../../constants.js";
import {createExplosion} from "../../../helpers.js";

export class PlayerPlane {
  scene = null;
  planeSprite = null;
  planeInitialY = -10;
  left_key = null;
  right_key = null;
  terrainPainter = null;
  currentCameraYOffset = -10;

  constructor(
    scene,
    x,
    y,
    towerDefenceTileTexture,
    tileArrayItem,
    terrainPainter,
  ) {
    this.scene = scene;
    console.log("player_plane:20 terrainPainter::", terrainPainter);
    this.terrainPainter = terrainPainter;

    this.planeInitialY = y;

    // this.planeSprite = this.scene.add
    //   .sprite(x, y, towerDefenceTileTexture, tileArrayItem)
    //   .setOrigin(0.5, 0.5);
    this.planeSprite = this.scene.add
      .sprite(x, y, "player_plane")
      .setOrigin(0.5, 0.5);
    this.planeSprite.x = x;
    this.planeSprite.y = y;

    this.left_key = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT,
    );
    this.right_key = this.scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT,
    );
  }

  update(cameraYPos) {
    this.currentCameraYOffset = cameraYPos;
    if (this.left_key.isDown) {
      if (this.debug_key_logging_enabled) console.log("left isdown :>> ");
      if (this.planeSprite.x >= 30) this.planeSprite.x -= 2;
    }

    if (this.right_key.isDown) {
      if (this.debug_key_logging_enabled) console.log("right isdown :>> ");
      if (this.planeSprite.x <= 610) this.planeSprite.x += 2;
    }

    if (cameraYPos <= 0) this.planeSprite.y = this.planeInitialY;
    else this.planeSprite.y -= CAMERA_SCROLL_DELTA;
    // console.log("player_plane:57 this.planeSprite.y::", this.planeSprite.y);
  }

  collideWithMap() {
    if(!this.planeSprite.visible) return;
    const plainX = this.planeSprite.x;
    // console.log("player_plane:58 plainX::", plainX);
    const plainY = this.planeSprite.y;
    // console.log("player_plane:60 plainY::", plainY);
    // console.log("player_plane:61 this.terrainPainter::", this.terrainPainter);
    // var plainPointY = this.planeSprite.y - (32 - this.cameras.main.scrollY);
    // if(this.cameras.main.scrollY <= 0) {
    //   highLightPointY = this.PLANE_Y_POS;
    // }
    const tileUnderPlane =
      this.terrainPainter.getTileTypeUnderScreenCoords(plainX, plainY);
    // console.log("player_plane:73 tileUnderPlane::", tileUnderPlane);

    if(tileUnderPlane != 42) {
      createExplosion(this.scene, plainX, plainY);
      this.planeSprite.visible = false;
      return false;
    }

    return true;
  }

  getPosition() {
    return {
      x: this.planeSprite.x,
      y: this.planeSprite.y,
    };
  }
}
