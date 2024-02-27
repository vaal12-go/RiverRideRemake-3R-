class Example extends Phaser.Scene {
  //Example from: https://phaser.io/examples/v3/view/game-objects/render-texture/graphics-to-render-texture
  graphics;
  rt;
  tls_txture;
  frm1;
  img1;
  i = 0;

  preload() {
    this.load.image("bg1", "img/red.png");
    this.load.image("ybg", "img/yellow_bg.png");
    this.load.image("tls", "img/tiles_packed_32.png");
  }

  create() {

    // Tileset example: https://phaser.io/examples/v3/view/tilemap/base-tile-size
    // this.tls_txture  = this.add
    // .renderTexture(0, 0, 300, 300)
    // .setOrigin(0);

    // this.tls_txture.draw("tls", 0, 0)

    this.tls_txture = this.textures.get("tls")
    // this.tls_txture.getSourceImage().width
    var row_len = this.tls_txture.getSourceImage().width / 32
    console.log(' row_len :>> ',  row_len);
    var no_rows = this.tls_txture.getSourceImage().height / 32
    console.log('no_rows :>> ', no_rows);

    var tileArr = []

    var i=0
    for (var y=0; y<no_rows;y++) {
      console.log('New line :>> ');
      for(var x=0;x<row_len;x++) {
        console.log('i :>> ', i);
        var x_coord = x*32
        console.log('x_coord :>> ', x_coord);

        var y_coord = y*32
        console.log('y_coord :>> ', y_coord);
        tileArr.push(
          this.tls_txture.add("frm_"+i, 0, x*32, y*32, 32, 32)
        )
        i++
      }
      // if (y>2) break;
    }

    console.log('this.tls_txture.getSourceImage().width :>> ', this.tls_txture.getSourceImage().width);

    // Frame: https://photonstorm.github.io/phaser3-docs/Phaser.Textures.Frame.html
    // this.frm1 = this.tls_txture.add("frm1", 0, 31, 31, 32, 32)


    console.log("this.game.config.width :>> ", this.game.config.width);
    this.add.image(0, 0, "ybg").setOrigin(0);
    this.img1 = this.add.image(0, 0, "bg1").setOrigin(0);
    this.rt = this.add
      .renderTexture(0, 0, this.game.config.width, this.game.config.height)
      .setOrigin(0);

    const cam = this.cameras.main;
    // this.cameras.main.setOrigin(0)
    this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2);

    this.rt.beginDraw();
    var k = 0;
    for (k = 0; k < 800; k = k + 40) {
      this.rt.draw("bg1", k, this.i + k);
      for(var z=72; z<tileArr.length;z++) {
        this.rt.draw(tileArr[z], (z-72)*40, this.i+400)
      }
      // this.rt.draw(this.frm1, k, this.i + k+10)
    }
    this.i += 10;
    if (this.i > 200) this.i = 0;

    this.rt.endDraw();
    // console.log('cam :>> ', cam);

    // const src = this.textures.get('bg1').getSourceImage();
    // this.swatchData = this.textures.createCanvas('swatch', 200, 200);
    // this.swatchData.draw(10, 10, src);

    // this.add.image(510, 510, "bg1");
  }

  update() {
    // console.log('this.game.camera :>> ', this.game.camera);
    // this.rt.camera.rotation -= 0.01;
    // this.rt.clear();

    // this.cameras.main.scrollY += 1;
    // console.log('this.cameras.main.scrollY :>> ', this.cameras.main.scrollY);
    this.img1.y += 2;

    // this.game.debug.cameraInfo(game.camera, 32, 32);
  }
}
