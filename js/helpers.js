import { CAMERA_SCROLL_DELTA, SCENE_ROW_LEN } from "./constants.js";

export function getRandomInt(max) {
  //Generates random integer number from zero to (max-1)
  return Math.floor(Math.random() * max);
}

export function fillArray(tileID) {
  var scrArr = [];
  for (var y = 0; y < SCENE_ROW_NO; y++) {
    scrArr.push([]);
    for (var x = 0; x < SCENE_ROW_LEN; x++) {
      //this.main_tile_plate.draw(this.tileArr[tileID], x*32, y*32)
      scrArr[y].push(tileID);
    }
  }
  return scrArr;
}

export function getTileArrayFromTileset(set_texture, tileWidth) {
  var row_len = set_texture.getSourceImage().width / tileWidth;
  var no_rows = set_texture.getSourceImage().height / tileWidth;

  //Populate tiles array
  var tileArr = [];

  var i = 0;
  for (var y = 0; y < no_rows; y++) {
    for (var x = 0; x < row_len; x++) {
      var x_coord = x * tileWidth;
      var y_coord = y * tileWidth;
      tileArr.push(
        set_texture.add(
          "frm_" + i,
          0,
          x * tileWidth,
          y * tileWidth,
          tileWidth,
          tileWidth,
        ),
      );
      i++;
    } //for (var x = 0; x < row_len; x++) {
  } //for (var y = 0; y < no_rows; y++) {
  return tileArr;
} //getTileArrayFromTileset(set_texture) {

export function replaceValuesInArray(oldArray, startPos, ...replacingValues) {
  var newArr = oldArray.slice();
  for (let newVal of replacingValues) {
    newArr[startPos] = newVal;
    startPos++;
  }
  return newArr;
}

export function zeroFill(num, len) {
  return (Array(len).join("0") + num).slice(-len);
}

export function addTextToScene(scene, str, x, y, color = "#aaaaaa") {
  return scene.add
    .text(x, y, str, {
      font: "14px Arial Narrow",
      fill: color,
    })
    .setOrigin(0);
  dbgText.setText([`#${i}`]);
}

//This to be reworked with bobs (maybe?). Now usual text rendering will be used.
export function drawNumber(number) {
  var num = number;
  var currDivider = 10;
  var digitArr = [];

  while (num > 0.01) {
    digitArr.push(num % currDivider);
    num = Math.floor(num / 10);
  }

  while (digitArr.length < 5) {
    digitArr.push(0);
  }

  digitArr.reverse();

  var i = 0;
  for (var digit in digitArr) {
    this.fixed_plate.draw(
      this.towerDefenceTileArray[276 + digitArr[digit]],
      this.game.config.width - 200 + i * 32,
      this.game.config.height - 100,
    );
    i++;
  }
  this.fixed_plate.draw(this.towerDefenceTileArray[278], 250, 250);

  // console.log('digitArr :>> ', digitArr);
} //END drawNumber(number) {

export function getNumberOfSpritesInScene(scene) {
  // Source - https://stackoverflow.com/a/70903649
  // Posted by winner_joiner, modified by community. See post 'Timeline' for change history
  // Retrieved 2026-04-20, License - CC BY-SA 4.0

  // where this = the current scene
  let allSprites = scene.children.list.filter(
    (x) => x instanceof Phaser.GameObjects.Sprite,
  );
  return allSprites.length;
}

// export function drawCross(scene, x, y) {
//   // console.log("helpers:113 cameraScrollY::", cameraScrollY);
//   // ln.visible = true;
//   // ln2.visible = true;
//   // const circ = scene.add.circle(x, y, 10, 0x00ff00).setOrigin(0.5, 0.5);
// }

export function createExplosion(scene, x, y) {
  const explAnimation = scene.add.sprite(x, y, "fuel_gauge");

  explAnimation.anims.create({
    key: "explosion",
    frames: scene.anims.generateFrameNames("terrain_atlas", {
      frames: [
        "sprite5",
        "sprite6",
        "sprite7",
        "sprite8",
        "sprite9",
        "sprite112",
      ],
    }),
    frameRate: 4,
    repeat: 0, // -1 = infinite loop
    // duration: 1000,
  });

  explAnimation.anims.play("explosion")
}

export class HighlightPoint {
  scene = null;
  x = -100;
  y = -100;
  initialY = -100;
  vertLineSprite = null;
  horzLineSprite = null;
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.initialY = y;

    this.vertLineSprite = scene.add
      .line(x, y, 0, 0, 0, 20, 0xff0000)
      .setOrigin(0.5, 0.5);
    this.vertLineSprite.setLineWidth(1);

    this.horzLineSprite = scene.add
      .line(x, y, 0, 0, 20, 0, 0xff0000)
      .setOrigin(0.5, 0.5);
    this.horzLineSprite.setLineWidth(1);
  }

  update(cameraScrollY) {
    // console.log("helpers:146 cameraScrollY::", cameraScrollY);
    // console.log("helpers:147 this.initialY::", this.initialY);
    if (cameraScrollY <= 0) {
      this.vertLineSprite.y = this.initialY;
      this.horzLineSprite.y = this.initialY;
    } else {
      this.vertLineSprite.y -= CAMERA_SCROLL_DELTA;
      this.horzLineSprite.y -= CAMERA_SCROLL_DELTA;
    }
    // console.log("helpers:154 this.vertLineSprite.y::", this.vertLineSprite.y);
  }

  destroy() {
    // console.log("High light point to be destroyed :>> ");
    this.vertLineSprite.Visible = false;
    this.vertLineSprite.destroy();
    this.horzLineSprite.Visible = false;
    this.horzLineSprite.destroy();
  }
}
