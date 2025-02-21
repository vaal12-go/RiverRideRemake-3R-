window.addEventListener("load", () => {
  console.log("window loaded :>> ");
});

class FlyerScene extends Phaser.Scene {
  towerDefenceTileTexture;
  towerDefenceTileArray;
  fixed_plate;
  fixed_plate_img;

  airplane_sprite;

  keyA;
  left_key;
  right_key;
  space_key;
  pause_key;
  // game_paused = false;
  game_paused = true;
  step_forward_key;
  step_once = false;
  cycleNo;

  bgUpdater = null;
  terraPainter = null;
  dashboard = null;
  dbgText = null;

  positionalUpdatedObjectsArray = []; //All should have method update(cameraPosition)

  preload() {
    this.load.image("bg1", "img/red.png");
    this.load.image("ybg", "img/yellow_bg.png");
    this.load.image("bg_tileset", "img/tiles_packed_32.png");
    this.load.image("tower_defence_tileset", "img/towerDefense_tilesheet.png");
    this.load.image("fuel_gauge", "img/FuelGauge.png");
    this.load.audio("gunShot", [
      "audio/Beefy-AR10-7.62x51-308-Close-Single-Gunshot-B.mp3",
    ]);
    //https://medium.com/@michaelwesthadley/modular-game-worlds-in-phaser-3-tilemaps-1-958fc7e6bbd6
    this.load.tilemapCSV(
      STARTING_TILEMAP,
      "../tilemaps/flyer_starting map_29Jan2025._BGLayer1.csv"
    );
    this.load.atlas(
      "terrain_atlas",
      "img/tiles_packed_32.png",
      "img/terrain_sprites_atlas.json"
    );
  }

  create() {
    this.cycleNo = 0;
    this.terraPainter = new TerrainPainter(this);
    this.positionalUpdatedObjectsArray.push(this.terraPainter);

    // this.dashboard = new Dashboard(this);
    // this.positionalUpdatedObjectsArray.push(this.dashboard);

    console.log("this.SCENE_ROW_NO :>> ", SCENE_ROW_NO);
    console.log("this.SCENE_ROW_LEN :>> ", SCENE_ROW_LEN);
    console.log("this.game.config.height :>> ", this.game.config.height);
    console.log("this.game.config.width :>> ", this.game.config.width);

    this.cameras.main.scrollY = TILE_WIDTH_HEIGHT;
    // this.cameras.main.y = 0;
    // this.cameras.main.scrollX = 0;
    this.fixed_plate_img = this.add
      .image(0, this.game.config.height, this.fixed_plate)
      .setOrigin(0);

    this.fixed_plate_img.y = this.game.config.height;

    this.towerDefenceTileTexture = this.textures.get("tower_defence_tileset");
    this.towerDefenceTileArray = getTileArrayFromTileset(
      this.towerDefenceTileTexture,
      64
    );

    this.airplane_sprite = this.add
      .sprite(
        50,
        50,
        this.towerDefenceTileTexture,
        this.towerDefenceTileArray[270]
      )
      .setOrigin(0.5);
    this.airplane_sprite.angle = -90;
    this.airplane_sprite.y = this.game.config.height - 150;
    this.airplane_sprite.x = (this.game.config.width - 32) / 2;

    this.dbgText = this.add
      .text(20, 20, "Move the mouse", {
        font: "16px Courier",
        fill: "#000000",
      })
      .setOrigin(0);
    // this.dbgText.setText(["This is debug text"]);

    this.initInputs();

    this.dbgText.y = this.cameras.main.scrollY;
    this.dbgText.setText(
      `Frame ${this.cycleNo} \n 
       NumPad Plus - proceeed/stop \n 
       NumPad Minus - proceed one frame \n 
       Space - shoot sound \n
       Arrow left\\right - plane moves left and right`
    );
  }

  initInputs() {
    //Cursor keys:https://github.com/phaserjs/examples/blob/master/public/src/input/keyboard/cursor%20keys.js
    // this.cursors = this.input.keyboard.createCursorKeys();

    //Keycodes: https://newdocs.phaser.io/docs/3.54.0/Phaser.Input.Keyboard.KeyCodes
    //Example: https://github.com/phaserjs/examples/blob/master/public/src/input/keyboard/add%20key.js
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.left_key = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.LEFT
    );
    this.right_key = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.RIGHT
    );
    this.space_key = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
    this.pause_key = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.NUMPAD_ADD
    );
    this.step_forward_key = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.NUMPAD_SUBTRACT
    );

    var sceneObj = this;
    this.pause_key.on("up", (event) => {
      console.log("key up :>> ");
      sceneObj.game_paused = !sceneObj.game_paused;
    });

    this.step_forward_key.on("up", (event) => {
      console.log("Step key up :>> ");
      sceneObj.step_once = true;
    });

    this.space_key.on("down", (evt) => {
      console.log("SPACE isdown :>> ");
      //Audio example: https://github.com/phaserjs/examples/blob/master/public/src/audio/HTML5%20Audio/play%20audio%20file.js
      const music = this.sound.add("gunShot");
      music.play();
      // this.airplane_sprite.y = this.airplane_sprite.x - 2
    }); //this.space_key.on("down", (evt)=> {
  }

  // putRandomTanks(scrArr) {
  //   for (var i = 0; i < 10; i++) {
  //     // ID:28 tank
  //     scrArr[getRandomInt(SCENE_ROW_NO)][getRandomInt(SCENE_ROW_LEN)] = 28;
  //   }
  // }

  processLongKeyPresses() {
    if (this.left_key.isDown) {
      console.log("left isdown :>> ");
      this.airplane_sprite.x = this.airplane_sprite.x - 2;
      this.airplane_sprite.angle = -100;
    }

    if (this.right_key.isDown) {
      console.log("right isdown :>> ");
      this.airplane_sprite.x = this.airplane_sprite.x + 2;
    }
  } //processLongKeyPresses() {

  update() {
    if (this.game_paused && !this.step_once) {
      return;
    }

    if (this.step_once) {
      this.step_once = false;
    }

    this.processLongKeyPresses();

    // console.log(
    //   "this.cameras.main.scrollY BEFORE UPDATE :>> ",
    //   this.cameras.main.scrollY
    // );

    this.cycleNo += 1;
    if (this.cycleNo > 1000) this.cycleNo = 0;
    this.airplane_sprite.scaleY = 1;
    this.airplane_sprite.angle = -90;

    // if (this.space_key.isDown) {
    //   console.log("SPACE isdown :>> ");
    //   //Audio example: https://github.com/phaserjs/examples/blob/master/public/src/audio/HTML5%20Audio/play%20audio%20file.js
    //   const music = this.sound.add("gunShot");
    //   music.play();
    //   // this.airplane_sprite.y = this.airplane_sprite.x - 2
    // }

    this.cameras.main.scrollY -= CAMERA_SCROLL_DELTA;
    this.fixed_plate_img.y -= CAMERA_SCROLL_DELTA;
    this.airplane_sprite.y -= CAMERA_SCROLL_DELTA;
    this.dbgText.y = this.cameras.main.scrollY;
    this.dbgText.setText(
      `Frame ${this.cycleNo} \n NumPad Plus - proceeed \n NumPad Minus - proceed one frame \n Space - shoot sound`
    );
    // console.log(
    //   "this.cameras.main.scrollY AFTER+ UPDATE :>> ",
    //   this.cameras.main.scrollY
    // );

    for (let updObj of this.positionalUpdatedObjectsArray) {
      updObj.update(this.cameras.main.scrollY);
    }
    // this.bgUpdater.update(this.cameras.main.scrollY)

    if (this.cameras.main.scrollY <= 0) {
      // this.cameras.main.scrollY = this.game.config.height;
      this.cameras.main.scrollY = TILE_WIDTH_HEIGHT;
      this.fixed_plate_img.y = this.game.config.height;
      // this.airplane_sprite.y = this.game.config.height + 200;
      this.airplane_sprite.y = this.game.config.height - 150;
    }
  } //update() {
} //class FlyerScene extends Phaser.Scene {
