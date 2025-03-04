class ObjectPainter {
  scene = null;
  terrainShadowMap = null;
  jetBlitter = null;
  //   bob = null;
  jet = null;
  absObjYDelta = 0;
  constructor(scene, terrainShadowMap) {
    this.scene = scene;
    this.terrainShadowMap = terrainShadowMap;

    this.jetBlitter = this.scene.add.blitter(0, 0, "jet");
    let bob = this.jetBlitter.create(100, 100, 0);
    this.jet = new Jet(bob);
  }

  update(cameraPosition) {
    // console.log("ObjectPainter. Update.cameraPosition :>> ", cameraPosition);
    // this.bob.y = 100 - cameraPosition;
    // this.bob.x += 1;
    this.absObjYDelta = 0;
    if (cameraPosition == 0) {
      this.absObjYDelta = 32;
    }
    this.jet.update(this.absObjYDelta);
  } //update(cameraPosition) {
} //class ObjectPainter {
