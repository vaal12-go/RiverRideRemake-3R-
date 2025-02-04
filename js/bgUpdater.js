class BGUpdater {
  backgroundDynamicTexture = null;
  bgTileSetName = "";
  bgTileSetTexture = null;
  bgTilesArray = null;

  shadowScreenArray = []; //This will hold tile numbers (2 screens)

  scene = null;
  currentCameraPosition = -1;
  currentShadowArrayRowDrawn = -1;

  lastGeneratedShadowRow = null;

  tempTexture = null;

  shMapHolder = null;
  terrainBlitter = null;
  bobsArray = [];
  framesArray = [null]; //sprite atlas starts from #1

  shadowArrayRowDrawn = -1;

  debugTextsArray = [];

  constructor(scene, backgroundTilesetName) {
    this.scene = scene;
    this.currentCameraPosition = this.scene.game.config.height;
    this.currentShadowArrayRowDrawn = 0;

    this.backgroundDynamicTexture = this.scene.textures.addDynamicTexture(
      "BGUpdater_backgroundDynamicTexture",
      this.scene.game.config.width,
      this.scene.game.config.height * 2
    );

    this.tempTexture = this.scene.textures
      .addDynamicTexture(
        "BGUpdater_backgroundDynamicTexture_temp",
        this.scene.game.config.width,
        this.scene.game.config.height
      )
      .setIsSpriteTexture(false);

    this.bgTileSetName = backgroundTilesetName;
    this.bgTileSetTexture = this.scene.textures.get(this.bgTileSetName);
    this.bgTilesArray = getTileArrayFromTileset(
      this.bgTileSetTexture,
      TILE_WIDTH_HEIGHT
    );

    this.terrainBlitter = this.scene.add.blitter(0, 0, "terrain_atlas");
    //Creating bobs/frames:

    for (let spriteNo = 1; spriteNo <= 120; spriteNo++) {
      var newFrame = this.scene.textures.getFrame(
        "terrain_atlas",
        `sprite${spriteNo}`
      );
      this.framesArray.push(newFrame);
    }

    this.shMapHolder = new ShadowMapHolder(this.scene, "startingMap");
    console.log("Initial shadowmap :>> ");
    this.shMapHolder.debugPrintToConsole();
    this.shMapHolder.generateNextRiverSections();
    console.log("Updated1 shadowmap :>> ");
    this.shMapHolder.debugPrintToConsole();

    // const startingMap = this.scene.make.tilemap({
    //   key: "startingMap",
    //   tileWidth: 32,
    //   tileHeight: 32,
    // });

    // //Filling the shadow array from start tilemap
    // for (var rowNo = SCENE_ROW_NO - 1; rowNo >= 0; rowNo--) {
    //   var newRowArr = [];
    //   for (var colNo = 0; colNo < SCENE_TILES_ROW_LEN; colNo++) {
    //     newRowArr.push(startingMap.layer.data[rowNo][colNo].index);
    //   }
    //   this.shadowScreenArray.push(newRowArr);
    // } //for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {
    // this.lastGeneratedShadowRow =
    //   this.shadowScreenArray[this.shadowScreenArray.length - 1];

    //Drawing shadow array on texture
    this.drawShadowArray();

    console.log("this.shadowScreenArray :>> ", this.shadowScreenArray);
    this.generateNextRiverSections();
    console.log("this.shadowScreenArray AFTER :>> ", this.shadowScreenArray);
    this.drawShadowArray();
    console.log("this.shadowScreenArray AFTER2 :>> ", this.shadowScreenArray);
    this.generateNextRiverSections();
    this.drawShadowArray();

    scene.add.image(0, 0, this.backgroundDynamicTexture).setOrigin(0);
  } //constructor(scene, backgroundTilesetName) {

  drawShadowArray() {
    console.log(
      "drawShadowArray() START this.shadowArrayRowDrawn :>> ",
      this.shadowArrayRowDrawn
    );
    var shadowArrRows = this.shMapHolder.shadowMapArray.length;

    //If below is enabled it will clear all texts even if nothing is drawn
    // for (var i = 0; i < this.debugTextsArray.length; i++) {
    //   this.debugTextsArray[i].destroy();
    // }
    // this.debugTextsArray.splice(0);

    for (
      var rowNo = this.shadowArrayRowDrawn + 1;
      rowNo < shadowArrRows;
      rowNo++
    ) {
      for (var colNo = 0; colNo < SCENE_TILES_ROW_LEN; colNo++) {
        var displayRowY =
          this.scene.game.config.height * 2 - (rowNo + 1) * TILE_WIDTH_HEIGHT;
        console.log("displayRowY :>> ", displayRowY);
        this.terrainBlitter.create(
          colNo * TILE_WIDTH_HEIGHT,
          displayRowY,
          this.framesArray[this.shMapHolder.shadowMapArray[rowNo][colNo] + 1]
        );
        this.debugTextsArray.push(
          addTextToScene(
            this.scene,
            `ShadowRow:${rowNo}`,
            30,
            displayRowY,
            "#ff0000"
          )
        );
      }
      this.shadowArrayRowDrawn++;
    } //for (var rowNo = this.shadowArrayRowDrawn + 1;

    this.terrainBlitter.create(
      0,
      this.scene.game.config.height * 2,
      this.framesArray[2]
    );
    console.log(
      "this.scene.game.config.height * 2 - TILE_WIDTH_HEIGHT, :>> ",
      this.scene.game.config.height * 2 - TILE_WIDTH_HEIGHT
    );
    this.terrainBlitter.create(
      0,
      this.scene.game.config.height * 2 - TILE_WIDTH_HEIGHT,
      this.framesArray[2]
    );
    this.terrainBlitter.create(
      0,
      this.scene.game.config.height,
      this.framesArray[2]
    );
    this.terrainBlitter.create(0, 0, this.framesArray[2]);

    console.log(
      "this.shadowArrayRowDrawn AFTER :>> ",
      this.shadowArrayRowDrawn
    );
  } //drawShadowArray() {

  update(cameraPosition) {
    // console.log('cameraPosition :>> ', cameraPosition);
    if (cameraPosition == 0) {
      console.log("Have restart of camera :>> ");
      this.currentShadowArrayRowDrawn = SCENE_ROW_NO;

      this.tempTexture.draw("BGUpdater_backgroundDynamicTexture", 0, 0);
      this.backgroundDynamicTexture.draw(
        "BGUpdater_backgroundDynamicTexture_temp",
        0,
        this.scene.game.config.height
      );
    }
    if (cameraPosition % TILE_WIDTH_HEIGHT == 0) {
      // console.log("cameraPosition reaches tiles boundary :>> ", cameraPosition);
      this.generateNextRiverSections();
      this.drawShadowArray();
    }
  } //update(cameraPosition) {

  generateNextRiverSections() {
    //Copied to shadowMapHolder
  } //generateNextRiverSections() {
} //class BGUpdater {
