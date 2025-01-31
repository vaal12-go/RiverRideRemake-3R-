const DASHBOARD_HEIGHT = 100;
class Dashboard {
  scene = null;
  bgDynamicTexture = null;
  bgTextureImage = null;
  greyBGGraphics = null;

  constructor(scene) {
    this.scene = scene;

    this.bgDynamicTexture = this.scene.textures.addDynamicTexture(
      "Dashboard_bgDynamicTexture",
      this.scene.game.config.width,
      DASHBOARD_HEIGHT
    );

    this.bgDynamicTexture.draw(
      "fuel_gauge",
      (this.scene.game.config.width - 150) / 2,
      10
    );

    this.greyBGGraphics = this.scene.add.graphics({
      x: 0,
      y: this.scene.game.config.height * 2 - DASHBOARD_HEIGHT,
    });
    // this.greyBGGraphics = new Graphics(null, {
    //       x: 0,
    //       y: this.scene.game.config.height * 2 - DASHBOARD_HEIGHT,
    //     })


    this.greyBGGraphics.fillStyle(0x787878, 0.9);
    this.greyBGGraphics.fillRect(
      0,
      0,
      this.scene.game.config.width,
      DASHBOARD_HEIGHT
    );

    this.greyBGGraphics.fillStyle(0xffffff, 0.98);
    this.greyBGGraphics.fillRect(
        (this.scene.game.config.width - 150) / 2+7, 
        20, 
        8, 
        40);

    this.bgTextureImage = this.scene.add
      .image(
        0,
        this.scene.game.config.height * 2 - DASHBOARD_HEIGHT,
        this.bgDynamicTexture
      )
      .setOrigin(0);
  } //constructor(scene) {

  update(cameraPosition) {
    this.greyBGGraphics.y =
      cameraPosition + this.scene.game.config.height - DASHBOARD_HEIGHT;
    this.bgTextureImage.y =
      cameraPosition + this.scene.game.config.height - DASHBOARD_HEIGHT;
  } //update(cameraPosition) {
} //class Dashboard {
