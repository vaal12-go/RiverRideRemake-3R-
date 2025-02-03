window.addEventListener("load", () => {
  // console.log("I am loaded :>> ");
  document
    .getElementById("phaser-game-parent")
    .addEventListener("focusout", () => {
      console.log("parent lost focus :>> ");
    });
});

class FlyerScene extends Phaser.Scene {
  //Example from: https://phaser.io/examples/v3/view/game-objects/render-texture/graphics-to-render-texture
  rt;
  tls_txture;
  tileArr;
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
  game_paused = false;
  cycleNo;

  bgUpdater = null;
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
      "startingMap",
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
    this.bgUpdater = new BGUpdater(this, "bg_tileset");
    this.positionalUpdatedObjectsArray.push(this.bgUpdater);
    this.fixed_plate = this.textures.addDynamicTexture(
      "fixedTexture",
      this.game.config.width,
      this.game.config.height
    );
    const blitter = this.add.blitter(100, 1500, "terrain_atlas");

    this.dashboard = new Dashboard(this);
    this.positionalUpdatedObjectsArray.push(this.dashboard);

    console.log("this.SCENE_ROW_NO :>> ", SCENE_ROW_NO);
    console.log("this.SCENE_ROW_LEN :>> ", SCENE_ROW_LEN);
    console.log("this.game.config.height :>> ", this.game.config.height);
    console.log("this.game.config.width :>> ", this.game.config.width);

    this.cameras.main.scrollY = this.game.config.height;
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
    // this.add.image(1200, 1200, this.towerDefenceTileTexture);

    this.airplane_sprite = this.add
      .sprite(
        50,
        50,
        this.towerDefenceTileTexture,
        this.towerDefenceTileArray[270]
      )
      .setOrigin(0.5);
    this.airplane_sprite.angle = -90;
    this.airplane_sprite.y = this.game.config.height + 200;

    this.dbgText = this.add
      .text(20, 20, "Move the mouse", {
        font: "16px Courier",
        fill: "#000000",
      })
      .setOrigin(0);
    this.dbgText.setText(["This is debug text"]);

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

    var sceneObj = this;
    this.pause_key.on("up", function (event) {
      console.log("key up :>> ");
      /* ... */
      // if(this.pause_key.isDown) {
      sceneObj.game_paused = !sceneObj.game_paused;
      // }
    });

    const frame52 = this.textures.getFrame("terrain_atlas", "sprite52");
    const frame53 = this.textures.getFrame("terrain_atlas", "sprite53");

    blitter.create(0, 0, frame52);
    blitter.create(100, 0, frame53);

    // Tileset example: https://phaser.io/examples/v3/view/tilemap/base-tile-size
    // this.tls_txture  = this.add
    // .renderTexture(0, 0, 300, 300)
    // .setOrigin(0);

    // this.tls_txture.draw("tls", 0, 0)

    // fill this.main_tile_plate with grass - ID:50

    // this.cameras.main.scrollY = this.game.config.height*2;

    // console.log('this.tls_txture.getSourceImage().width :>> ', this.tls_txture.getSourceImage().width);

    // Frame: https://photonstorm.github.io/phaser3-docs/Phaser.Textures.Frame.html
    // this.frm1 = this.tls_txture.add("frm1", 0, 31, 31, 32, 32)

    // console.log("this.game.config.width :>> ", this.game.config.width);
    // this.add.image(0, 0, "ybg").setOrigin(0);
    // this.img1 = this.add.image(0, 0, "bg1").setOrigin(0);
    // this.rt = this.add
    //   .renderTexture(0, 0, this.game.config.width, this.game.config.height)
    //   .setOrigin(0);

    // const cam = this.cameras.main;
    // // this.cameras.main.setOrigin(0)
    // this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2);

    // this.rt.beginDraw();
    // var k = 0;
    // for (k = 0; k < 800; k = k + 40) {
    //   this.rt.draw("bg1", k, this.i + k);
    //   for(var z=72; z<tileArr.length;z++) {
    //     this.rt.draw(tileArr[z], (z-72)*40, this.i+400)
    //   }
    //   // this.rt.draw(this.frm1, k, this.i + k+10)
    // }
    // this.i += 10;
    // if (this.i > 200) this.i = 0;

    // this.rt.endDraw();
    // console.log('cam :>> ', cam);

    // const src = this.textures.get('bg1').getSourceImage();
    // this.swatchData = this.textures.createCanvas('swatch', 200, 200);
    // this.swatchData.draw(10, 10, src);

    // this.add.image(510, 510, "bg1");

    // console.log("Will put tanks :>> ");
    // this.putRandomTanks(this.screenTilesArrays[1]);
    // this.drawArrayToTexture(
    //   this.screenTilesArrays[1], this.game.config.height);
  }

  putRandomTanks(scrArr) {
    for (var i = 0; i < 10; i++) {
      // ID:28 tank
      scrArr[getRandomInt(SCENE_ROW_NO)][getRandomInt(SCENE_ROW_LEN)] = 28;
    }
  }

  drawArrayToTexture(scrArr, textureStartY) {
    this.main_tile_plate.beginDraw();
    for (var y = 0; y < this.SCENE_ROW_NO; y++) {
      for (var x = 0; x < this.SCENE_ROW_LEN; x++) {
        //https://newdocs.phaser.io/docs/3.70.0/Phaser.Textures.DynamicTexture#batchDraw
        this.main_tile_plate.batchDraw(
          this.tileArr[scrArr[y][x]],
          x * 32,
          y * 32 + textureStartY
        );
        // this.main_tile_plate.draw(
        //   this.tileArr[scrArr[y][x]],
        //   x * 32,
        //   y * 32 + textureStartY
        // );
        // console.log('(y)*32+scr*this.game.config.height :>> ', (y)*32+scr*this.game.config.height);
        // console.log('this.screenTilesArrays[scr][x][y] :>> ', this.screenTilesArrays[scr][x][y]);
      }
    }
    this.main_tile_plate.endDraw();
  }

  drawNumber(number) {
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
        this.game.config.height - 100
      );
      i++;
    }
    this.fixed_plate.draw(this.towerDefenceTileArray[278], 250, 250);

    // console.log('digitArr :>> ', digitArr);
  } //END drawNumber(number) {

  update() {
    if (this.game_paused) {
      return;
    }

    this.cycleNo += 1;
    if (this.cycleNo > 1000) this.cycleNo = 0;
    this.airplane_sprite.scaleY = 1;
    this.airplane_sprite.angle = -90;

    if (this.left_key.isDown) {
      console.log("left isdown :>> ");
      this.airplane_sprite.x = this.airplane_sprite.x - 2;
      // this.airplane_sprite.scaleY = 0.5;
      this.airplane_sprite.angle = -100;
    }

    if (this.right_key.isDown) {
      console.log("right isdown :>> ");
      this.airplane_sprite.x = this.airplane_sprite.x + 2;
    }

    if (this.space_key.isDown) {
      console.log("SPACE isdown :>> ");
      //Audio example: https://github.com/phaserjs/examples/blob/master/public/src/audio/HTML5%20Audio/play%20audio%20file.js
      const music = this.sound.add("gunShot");
      music.play();
      // this.airplane_sprite.y = this.airplane_sprite.x - 2
    }

    if (this.cycleNo % 2 == 0) {
      this.fixed_plate.beginDraw();
      //TODO: this probably may be optimized with https://newdocs.phaser.io/docs/3.70.0/Phaser.Textures.DynamicTexture#fill
      this.fixed_plate.clear(100, 500, 200, 100);

      this.drawNumber(this.cycleNo);
      this.fixed_plate.endDraw();
    }

    this.cameras.main.scrollY -= CAMERA_SCROLL_DELTA;
    this.fixed_plate_img.y -= CAMERA_SCROLL_DELTA;
    this.airplane_sprite.y -= CAMERA_SCROLL_DELTA;
    this.dbgText.y = 20 + this.cameras.main.scrollY;
    this.dbgText.setText(`Hello ${this.cycleNo}`);

    for (let updObj of this.positionalUpdatedObjectsArray) {
      updObj.update(this.cameras.main.scrollY);
    }
    // this.bgUpdater.update(this.cameras.main.scrollY)

    if (this.cameras.main.scrollY <= 0) {
      this.cameras.main.scrollY = this.game.config.height;
      this.fixed_plate_img.y = this.game.config.height;
      this.airplane_sprite.y = this.game.config.height + 200;
    }
    // For copying parts of texture look into: https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Blitter.html
    // https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.GameObjectFactory.html#blitter__anchor
    // if (this.cameras.main.scrollY == this.game.config.height) {
    //   this.screenTilesArrays[2] = this.screenTilesArrays[0]
    //   this.drawArrayToTexture(this.screenTilesArrays[0], this.game.config.height*2)
    // }
    // if (this.cameras.main.scrollY <= 0) {
    //   this.cameras.main.scrollY = this.game.config.height * 2;
    //   var scr1 = fillArray(56);
    //   this.putRandomTanks(scr1)
    //   this.screenTilesArrays[0] = scr1;
    //   this.drawArrayToTexture(this.screenTilesArrays[0], 0)
    // }
    // console.log('this.game.camera :>> ', this.game.camera);
    // this.rt.camera.rotation -= 0.01;
    // this.rt.clear();
    // this.cameras.main.scrollY += 1;
    // console.log('this.cameras.main.scrollY :>> ', this.cameras.main.scrollY);
    // this.img1.y += 2;
    // this.game.debug.cameraInfo(game.camera, 32, 32);
  }
}
