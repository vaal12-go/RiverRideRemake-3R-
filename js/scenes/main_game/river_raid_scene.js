import * as constants from "../../constants.js";
import { getTileArrayFromTileset } from "../../helpers.js";
import { TerrainPainter } from "./terrain_painter.js";
import { SpritesManager } from "./spritesManager.js";

// window.addEventListener("load", () => {
//   // TODO: if this is necessary - this belongs in window initialization.
//   console.log("window loaded :>> ");
// });

export class RiverRaidScene extends Phaser.Scene {
  towerDefenceTileTexture;
  towerDefenceTileArray;
  fixed_plate;
  fixed_plate_img;

  // airplane_sprite;

  keyA;
  left_key;
  right_key;
  space_key;
  pause_key;
  debug_key_logging_enabled = false;
  debug_sound_disable = true;
  game_paused = true;
  step_forward_key;
  step_once = false;
  cycleNo;

  terraPainter = null;
  dashboard = null;
  dbgText = null;

  positionalUpdatedObjectsArray = []; //All should have method update(cameraPosition)
  // objectPainter = null;
  spritesManager = null;

  preload() {
    this.load.image("bg1", "img/red.png");
    this.load.image("ybg", "img/yellow_bg.png");
    this.load.image("bg_tileset", "img/tiles_packed_32.png");
    this.load.image("tower_defence_tileset", "img/towerDefense_tilesheet.png");
    this.load.image("fuel_gauge", "img/FuelGauge.png");
    this.load.image("fuel_tank", "img/fuel/Fuel_29Feb2025.png");
    this.load.image("jet", "img/jet/detailed_jet.png");
    this.load.image("bullet", "img/bullet.png");
    this.load.audio("gunShot", [
      "audio/Beefy-AR10-7.62x51-308-Close-Single-Gunshot-B.mp3",
    ]);
    //https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
    this.load.tilemapCSV(
      constants.STARTING_TILEMAP,
      "tilemaps/flyer_starting map_29Jan2025._BGLayer1.csv",
    );
    this.load.atlas(
      "terrain_atlas",
      "img/tiles_packed_32.png",
      "img/terrain_sprites_atlas.json",
    );
  }

  create() {
    this.cycleNo = 0;
    this.terraPainter = new TerrainPainter(this);
    this.positionalUpdatedObjectsArray.push(this.terraPainter);
    // this.dashboard = new Dashboard(this);
    // this.positionalUpdatedObjectsArray.push(this.dashboard);

    console.log("River raid main game scene start");
    console.log("this.SCENE_ROW_LEN :>> ", constants.SCENE_ROW_LEN);
    console.log("this.game.config.height :>> ", this.game.config.height);
    console.log("this.game.config.width :>> ", this.game.config.width);

    this.cameras.main.scrollY = constants.TILE_WIDTH_HEIGHT;
    this.fixed_plate_img = this.add
      .image(0, this.game.config.height, this.fixed_plate)
      .setOrigin(0);

    this.fixed_plate_img.y = this.game.config.height;

    this.towerDefenceTileTexture = this.textures.get("tower_defence_tileset");
    this.towerDefenceTileArray = getTileArrayFromTileset(
      this.towerDefenceTileTexture,
      64,
    );

    // this.airplane_sprite = this.add
    //   .sprite(
    //     50,
    //     50,
    //     this.towerDefenceTileTexture,
    //     this.towerDefenceTileArray[270],
    //   )
    //   .setOrigin(0.5);
    // this.airplane_sprite.angle = -90;
    // this.airplane_sprite.y = this.game.config.height - 150;
    // this.airplane_sprite.x = (this.game.config.width - 32) / 2;

    this.spritesManager = new SpritesManager(this);
    this.positionalUpdatedObjectsArray.push(this.spritesManager);

    this.spritesManager.createPlayerPlane(
      (this.game.config.width - 32) / 2,
      this.game.config.height - 150,
      this.towerDefenceTileTexture,
      this.towerDefenceTileArray[270],
    );

    this.dbgText = this.add
      .text(20, 20, "Move the mouse", {
        font: "16px Courier",
        fill: "#000000",
      })
      .setOrigin(0);

    this.initInputs();

    // this.dbgText.y = this.cameras.main.scrollY;
    // this.dbgText.setText(
    //   `Frame ${this.cycleNo} \n
    //    `,
    // );
  } //create() {

  initInputs() {
    //Cursor keys:https://github.com/phaserjs/examples/blob/master/public/src/input/keyboard/cursor%20keys.js
    // this.cursors = this.input.keyboard.createCursorKeys();

    //Keycodes: https://newdocs.phaser.io/docs/3.54.0/Phaser.Input.Keyboard.KeyCodes
    //Example: https://github.com/phaserjs/examples/blob/master/public/src/input/keyboard/add%20key.js
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    // this.left_key = this.input.keyboard.addKey(
    //   Phaser.Input.Keyboard.KeyCodes.LEFT,
    // );
    // this.right_key = this.input.keyboard.addKey(
    //   Phaser.Input.Keyboard.KeyCodes.RIGHT,
    // );
    this.space_key = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    this.pause_key = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ZERO,
    );
    this.step_forward_key = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.NINE,
    );

    var sceneObj = this;
    this.pause_key.on("up", (event) => {
      if (this.debug_key_logging_enabled) console.log("key up :>> ");
      sceneObj.game_paused = !sceneObj.game_paused;
    });

    this.step_forward_key.on("up", (event) => {
      if (this.debug_key_logging_enabled) console.log("Step key up :>> ");
      sceneObj.step_once = true;
    });

    this.space_key.on("down", (evt) => {
      if (this.debug_key_logging_enabled) console.log("SPACE isdown :>> ");
      //Audio example: https://github.com/phaserjs/examples/blob/master/public/src/audio/HTML5%20Audio/play%20audio%20file.js
      if (!this.debug_sound_disable) {
        const music = this.sound.add("gunShot");
        music.play();
      }

      this.spritesManager.createBullet(200, 200);
    }); //this.space_key.on("down", (evt)=> {
  }

  // putRandomTanks(scrArr) {
  //   for (var i = 0; i < 10; i++) {
  //     // ID:28 tank
  //     scrArr[getRandomInt(SCENE_ROW_NO)][getRandomInt(SCENE_ROW_LEN)] = 28;
  //   }
  // }

  // processLongKeyPresses() {
  //   if (this.left_key.isDown) {
  //     if (this.debug_key_logging_enabled) console.log("left isdown :>> ");
  //     // this.airplane_sprite.x = this.airplane_sprite.x - 2;
  //     // this.airplane_sprite.angle = -100;
  //   }

  //   if (this.right_key.isDown) {
  //     if (this.debug_key_logging_enabled) console.log("right isdown :>> ");
  //     // this.airplane_sprite.x = this.airplane_sprite.x + 2;
  //   }
  // } //processLongKeyPresses() {

  draw_line_grid() {
    // Function to draw different auxillary lines/dots on the canvas
    const graphics = this.add.graphics({
      x: 0,
      y: 0,
      lineStyle: { width: 2, color: 0x0000aa },
    });

    for (var y = 0; y < 900; y += 32) {
      graphics.lineBetween(0, y, 100, y);
    }
  }

  update() {
    this.dbgText.y = this.cameras.main.scrollY;
    this.dbgText.setText(`Frame ${this.cycleNo}`);

    if (this.game_paused && !this.step_once) {
      return;
    }

    if (this.step_once) {
      this.step_once = false;
    }

    // this.processLongKeyPresses();

    this.cycleNo += 1;
    if (this.cycleNo > 1000) this.cycleNo = 0;
    // this.airplane_sprite.scaleY = 1;
    // this.airplane_sprite.angle = -90;

    this.cameras.main.scrollY -= constants.CAMERA_SCROLL_DELTA;
    this.fixed_plate_img.y -= constants.CAMERA_SCROLL_DELTA;
    // this.airplane_sprite.y -= constants.CAMERA_SCROLL_DELTA;

    for (let updObj of this.positionalUpdatedObjectsArray) {
      updObj.update(this.cameras.main.scrollY);
    }

    if (this.cameras.main.scrollY <= 0) {
      this.cameras.main.scrollY = constants.TILE_WIDTH_HEIGHT;
      this.fixed_plate_img.y = this.game.config.height;
      // this.airplane_sprite.y = this.game.config.height - 150;
    }
  } //update() {
} //class RiverRaidScene extends Phaser.Scene {
