class Example extends Phaser.Scene {
    //Example from: https://phaser.io/examples/v3/view/game-objects/render-texture/graphics-to-render-texture
  graphics;
  rt;
  img1;
  i=0;

  preload() {
     this.load.image('bg1', 'img/red.png');
    this.load.image('ybg', 'img/yellow_bg.png');
  }

  create() {
    
    console.log('this.game.config.width :>> ', this.game.config.width);
    this.add.image(0, 0, "ybg").setOrigin(0)
    this.img1 = this.add.image(0, 0, "bg1").setOrigin(0)
    this.rt = this.add.renderTexture(0, 0, this.game.config.width, this.game.config.height).setOrigin(0);

    const cam = this.cameras.main;
    // this.cameras.main.setOrigin(0)
    this.cameras.main.setBounds(0, 0, 1920 * 2, 1080 * 2);

    this.rt.beginDraw()
    var k=0
    for(k=0; k<800; k=k+40) {
        this.rt.draw("bg1", k, this.i+k);
    }
    this.i+=10
    if (this.i>200) this.i=0
    

    this.rt.endDraw()
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

    this.cameras.main.scrollY += 1
    // console.log('this.cameras.main.scrollY :>> ', this.cameras.main.scrollY);
    this.img1.y += 2
    
    
    



    // this.game.debug.cameraInfo(game.camera, 32, 32);
  }

  
}
