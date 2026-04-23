import * as constants from "../../constants.js";
import { getTileArrayFromTileset, HighlightPoint } from "../../helpers.js";
import { TerrainPainter } from "./terrain_painter.js";
import { SpritesManager } from "./spritesManager.js";

export class RiverRaidScene extends Phaser.Scene {
  towerDefenceTileTexture;
  towerDefenceTileArray;
  fixed_plate;
  fixed_plate_img;
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

  terrainPainter = null;
  dashboard = null;
  dbgText = null;
  cameraYDBGText = null;

  positionalUpdatedObjectsArray = []; //All should have method update(cameraPosition)
  spritesManager = null;

  PLANE_Y_POS = -10;

  explosion_sprite = null;

  preload() {
    this.load.image("bg1", "img/red.png");
    this.load.image("ybg", "img/yellow_bg.png");
    this.load.image("bg_tileset", "img/tiles_packed_32.png");
    this.load.image("tower_defence_tileset", "img/towerDefense_tilesheet.png");
    this.load.image("fuel_gauge", "img/FuelGauge.png");
    this.load.image("fuel_tank", "img/fuel/Fuel_29Feb2025.png");
    this.load.image("jet", "img/jet/detailed_jet.png");
    this.load.image("bullet", "img/bullet_small.png");
    this.load.image("player_plane", "img/PlayerPlane_40x40.png");
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
    // TODO: add debug console output, which will work depending on the file it is located in.
    console.log("import.meta.url :>> ", import.meta.url);
    this.cycleNo = 0;
    this.terrainPainter = new TerrainPainter(this);

    this.positionalUpdatedObjectsArray.push(this.terrainPainter);
    // this.dashboard = new Dashboard(this);
    // this.positionalUpdatedObjectsArray.push(this.dashboard);

    console.log("River raid main game scene start");
    console.log("this.SCENE_ROW_LEN :>> ", constants.SCENE_ROW_LEN);
    console.log("this.game.config.height :>> ", this.game.config.height);
    console.log("this.game.config.width :>> ", this.game.config.width);

    // this.explosion_sprite = this.add.sprite(100, 300, "fuel_gauge");

    // const frms = this.anims.generateFrameNames("terrain_atlas", {
    //   prefix: "sprite",
    //   start: 5,
    //   end: 9,
    // });

    const frms = this.anims.generateFrameNames("terrain_atlas", {
      frames: ['sprite5','sprite6','sprite7','sprite8', 'sprite9', 'sprite112'],
    });

    // console.log("river_raid_scene:77 frms::", frms);
    // https://generalistprogrammer.com/tutorials/phaser-animation-sprite-sheet-guide
    // this.explosion_sprite.anims.create({
    //   key: "explosion",
    //   frames: frms,
    //   frameRate: 4,
    //   repeat: 0, // -1 = infinite loop
    //   // duration: 1000,
    // });


    // this.explosion_sprite.anims.play("explosion");

    // this.cameras.main.scrollY = constants.TILE_WIDTH_HEIGHT
    this.cameras.main.scrollY = 0;

    this.fixed_plate_img = this.add
      .image(0, this.game.config.height, this.fixed_plate)
      .setOrigin(0);

    this.fixed_plate_img.y = this.game.config.height;

    this.towerDefenceTileTexture = this.textures.get("tower_defence_tileset");
    this.towerDefenceTileArray = getTileArrayFromTileset(
      this.towerDefenceTileTexture,
      64,
    );

    this.spritesManager = new SpritesManager(this);
    this.positionalUpdatedObjectsArray.push(this.spritesManager);

    this.PLANE_Y_POS = this.game.config.height - 150;
    console.log(
      "river_raid_scene:88 this.terrainPainter::",
      this.terrainPainter,
    );
    this.spritesManager.createPlayerPlane(
      (this.game.config.width - 32) / 2,
      this.PLANE_Y_POS,
      this.towerDefenceTileTexture,
      this.towerDefenceTileArray[270],
      this.terrainPainter,
    );

    this.dbgText = this.add
      .text(20, 20, "Move the mouse", {
        font: "12px Courier",
        fill: "#000000",
      })
      .setOrigin(0);

    this.cameraYDBGText = this.add
      .text(20, 50, "qwe1", {
        font: "12px Courier",
        fill: "#000000",
      })
      .setOrigin(0);

    this.initInputs();

    const point10 = new HighlightPoint(this, 10, 10);

    // this.dbgText.y = this.cameras.main.scrollY;
    // this.dbgText.setText(
    //   `Frame ${this.cycleNo} \n
    //    `,
    // );
  } //create() {

  initInputs() {
    //Cursor keys:https://github.com/phaserjs/examples/blob/master/public/src/input/keyboard/cursor%20keys.js
    // this.cursors = this.input.keyboard.createCursorKeys();

    //Keycodes: https://docs.phaser.io/api-documentation/namespace/input-keyboard-keycodes
    //Example: https://github.com/phaserjs/examples/blob/master/public/src/input/keyboard/add%20key.js
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

    this.space_key = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
    this.pause_key = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.ENTER,
    );
    this.step_forward_key = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.NINE,
    );

    // var sceneObj = this;
    this.pause_key.on("up", (event) => {
      if (this.debug_key_logging_enabled) console.log("key up :>> ");
      this.game_paused = !this.game_paused;
    });

    this.step_forward_key.on("up", (event) => {
      if (this.debug_key_logging_enabled) console.log("Step key up :>> ");
      this.step_once = true;
    });

    this.space_key.on("down", (evt) => {
      if (this.debug_key_logging_enabled) console.log("SPACE isdown :>> ");
      //Audio example: https://github.com/phaserjs/examples/blob/master/public/src/audio/HTML5%20Audio/play%20audio%20file.js
      if (!this.debug_sound_disable) {
        const music = this.sound.add("gunShot");
        music.play();
      }
      const planeXPos = this.spritesManager.getPlayerPlanePosition();
      this.spritesManager.createBullet(planeXPos + 1, this.PLANE_Y_POS - 34);
    }); //this.space_key.on("down", (evt)=> {
  }

  // putRandomTanks(scrArr) {
  //   for (var i = 0; i < 10; i++) {
  //     // ID:28 tank
  //     scrArr[getRandomInt(SCENE_ROW_NO)][getRandomInt(SCENE_ROW_LEN)] = 28;
  //   }
  // }

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

  plainPoint = null;

  update() {
    this.dbgText.y = this.cameras.main.scrollY;
    this.dbgText.setText(`Frame ${this.cycleNo}`);
    this.cameraYDBGText.y = this.cameras.main.scrollY + 20;
    this.cameraYDBGText.setText(
      `Camera scrollY - ${this.cameras.main.scrollY}`,
    );

    if (this.game_paused && !this.step_once) {
      return;
    }

    if (this.step_once) {
      this.step_once = false;
    }

    this.cycleNo += 1;
    if (this.cycleNo > 1000) this.cycleNo = 0;

    for (let updObj of this.positionalUpdatedObjectsArray) {
      updObj.update(this.cameras.main.scrollY);
    }

    if(!this.spritesManager.collidePlayerPlane()) {
      console.log('Game will be paused and GameEndScene called :>> ');

      this.game_paused = true;
      this.scene.launch("game_end");  

    }
      

    if (this.plainPoint !== null) {
      this.plainPoint.destroy();
    }

    const planePosX = this.spritesManager.getPlayerPlanePosition().x;
    // console.log("river_raid_scene:201 planePosX::", planePosX);
    var highLightPointY = this.PLANE_Y_POS - (32 - this.cameras.main.scrollY);
    if (this.cameras.main.scrollY <= 0) {
      highLightPointY = this.PLANE_Y_POS;
    }
    this.plainPoint = new HighlightPoint(
      this,
      planePosX,
      // highLightPointY
      this.spritesManager.getPlayerPlanePosition().y,
    );

    // console.log("river_raid_scene:222 highLightPointY::", highLightPointY);

    // this should be in the end of the update as this sets new camera scroll
    if (this.cameras.main.scrollY <= 0) {
      this.cameras.main.scrollY =
        constants.TILE_WIDTH_HEIGHT - constants.CAMERA_SCROLL_DELTA;
      // this.fixed_plate_img.y = this.game.config.height;
    } else {
      this.cameras.main.scrollY -= constants.CAMERA_SCROLL_DELTA;
    }
  } //update() {
} //class RiverRaidScene extends Phaser.Scene {
