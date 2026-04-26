import { createExplosion } from "../../../helpers.js";

export class Bullet {
  scene = null;
  x = -10;
  y = -10;
  initial_y = -10;
  sprite = null;
  IMG_RESOURCE = "bullet";

  current_bullet_y_offset = 0;
  constructor(scene, x, y, terrainPainter) {
    // console.log("bullet:14 terrainPainter::", terrainPainter);
    this.scene = scene;
    this.initial_y = y;
    this.sprite = this.scene.add.sprite(x, y, this.IMG_RESOURCE);
    console.log("Bullet created :>> ");
    this.terrainPainter = terrainPainter;
  }

  update(cameraYPos) {
    this.current_bullet_y_offset += 4;
    if (cameraYPos == 0)
      this.sprite.y = this.initial_y - this.current_bullet_y_offset;
    else
      this.sprite.y =
        this.initial_y - (32 - cameraYPos) - this.current_bullet_y_offset;
    console.log("bullet:30 cameraYPos::", cameraYPos);
    console.log("bullet:29 this.sprite.y::", this.sprite.y);

    if (this.sprite.y <= 0) {
      this.sprite.destroy();
      return true;
    }
    if (this.collideWithMap()) {
      console.log("Tile collided with map :>> ");

      createExplosion(this.scene, this.sprite.x, this.sprite.y);
      this.sprite.destroy();
      return true;
    }
    return false;
  }

  collideWithMap() {
    const tileUnderBullet = this.terrainPainter.getTileTypeUnderScreenCoords(
      this.sprite.x,
      this.sprite.y,
    );
    console.log("Tile under bullet :>> ", tileUnderBullet);
    if (tileUnderBullet == 109) {
      console.log("Bridge found the bullet :>> ");
      return true;
    }
    return false;
  }
}
