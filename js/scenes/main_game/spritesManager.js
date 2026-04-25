import { Bullet } from "./objects/bullet.js";
import { PlayerPlane } from "./objects/player_plane.js";
import { getNumberOfSpritesInScene } from "../../helpers.js";

export class SpritesManager {
  spriteArray = [];
  scene = null;
  bulletSprite = null;
  playerPlane = null;
  terrainPainter = null;
  constructor(scene, terrainPainter) {
    this.scene = scene;
    this.terrainPainter = terrainPainter;
    // this.scene.load.image('bullet', '../../../img/bullet.png');
    // this.bulletSprite = this.scene.add.sprite(50, 50, 'bullet').setOrigin(0.5);
  }

  collidePlayerPlane() {
    if(!this.playerPlane.collideWithMap()) return false;
    return true;
  }

  update(cameraYPos) {
    for (var sprIdx in this.spriteArray) {
      const currSprite = this.spriteArray[sprIdx];
      // console.log("spritesManager:20 currSprite::", currSprite);
      if (currSprite.constructor.name == "Bullet") {
        if (currSprite.update(cameraYPos)) {
          // If update returns true, this means that this sprite no
          //    longer needs to be updated and should be removed
          //    from the list.
          const b1 = currSprite;
          this.spriteArray.splice(sprIdx, 1);
        }
      } //if(currSprite.constructor.name == "Bullet") {
      else {
        this.spriteArray.splice(sprIdx, 1);
      }
    } //for (var sprIdx in this.spriteArray) {

    this.playerPlane.update(cameraYPos);
  }

  createBullet(x, y) {
    console.log("spritesManager:45 this.terrainPainter::", this.terrainPainter);
    this.spriteArray.push(new Bullet(
      this.scene, x, y, this.terrainPainter));
    console.log("spritesManager:41 x::", x);
    console.log("spritesManager:42 y::", y);
    console.log("spritesManager:26 createBullet");
  }

  createPlayerPlane(
    x,
    y,
    towerDefenceTileTexture,
    tileArrayItem,
    terrainPainter,
  ) {
    // TODO: remove terrainPainter from this call - it is supplied in constructor
    this.playerPlane = new PlayerPlane(
      this.scene,
      x,
      y,
      towerDefenceTileTexture,
      tileArrayItem,
      terrainPainter,
    );

    return this.playerPlane;
  }

  getPlayerPlanePosition() {
    // console.log("this. :>> ", this.playerPlane.getPosition());
    return this.playerPlane.getPosition();
  }
}
