class BGUpdater {
  bgTileSetName = "";
  bgTileSetTexture = null;
  bgTilesArray = null;

  // shadowScreenArray = []; //This will hold tile numbers (2 screens)

  scene = null;
  currentCameraPosition = -1;
  currentShadowArrayRowDrawn = -1;

  // lastGeneratedShadowRow = null;

  // tempTexture = null;

  shMapHolder = null;
  shadowMapFirstTilePositionOnScreen = -1;

  terrainBlitter = null;
  bobsArray = [];
  framesArray = [null]; //sprite atlas starts from #1

  shadowArrayRowDrawn = -1;

  debugTextsArray = [];
  terrainBobsArray = [];
  lowerScreenTerrainBobsArray = [];

  constructor(scene, backgroundTilesetName) {
    this.scene = scene;
    this.currentCameraPosition = this.scene.game.config.height;
    this.currentShadowArrayRowDrawn = 0;
    this.shadowMapFirstTilePositionOnScreen = SCENE_ROW_NO * 2 - 1;

    // this.backgroundDynamicTexture = this.scene.textures.addDynamicTexture(
    //   "BGUpdater_backgroundDynamicTexture",
    //   this.scene.game.config.width,
    //   this.scene.game.config.height * 2
    // );

    // this.tempTexture = this.scene.textures
    //   .addDynamicTexture(
    //     "BGUpdater_backgroundDynamicTexture_temp",
    //     this.scene.game.config.width,
    //     this.scene.game.config.height
    //   )
    //   .setIsSpriteTexture(false);

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

    //Drawing shadow array on texture
    this.drawShadowArray();
  } //constructor(scene, backgroundTilesetName) {

  drawShadowArrayRow(shadowArrRowNo) {}

  drawShadowArray() {
    console.log(
      "drawShadowArray() START this.shadowArrayRowDrawn :>> ",
      this.shadowArrayRowDrawn
    );
    var shadowArrRows = this.shMapHolder.shadowMapArray.length;

    for (
      var rowNo = this.shadowArrayRowDrawn + 1;
      rowNo < shadowArrRows;
      rowNo++
    ) {
      var terrainBobsRow = [];
      for (var colNo = 0; colNo < SCENE_TILES_ROW_LEN; colNo++) {
        var displayRowY =
          this.scene.game.config.height * 2 - (rowNo + 1) * TILE_WIDTH_HEIGHT;
        // console.log("displayRowY :>> ", displayRowY);
        var bob = this.terrainBlitter.create(
          colNo * TILE_WIDTH_HEIGHT,
          displayRowY,
          this.framesArray[this.shMapHolder.shadowMapArray[rowNo][colNo] + 1]
        );
        terrainBobsRow.push(bob);
        this.debugTextsArray.push(
          addTextToScene(
            this.scene,
            `ShadowRow:${rowNo}. ScreenRow:${
              this.shadowMapFirstTilePositionOnScreen - rowNo
            }`,
            30,
            displayRowY,
            "#ff000099"
          )
        );
      } //for (var colNo = 0; colNo < SCENE_TILES_ROW_LEN; colNo++) {
      this.terrainBobsArray.push(terrainBobsRow);
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

  processTileBecomesInvisible(cameraPosition) {
    var lastRowVisible = Math.floor(
      (cameraPosition + this.scene.game.config.height - 1) / TILE_WIDTH_HEIGHT
    );

    for (var tileCol = 0; tileCol < SCENE_TILES_ROW_LEN; tileCol++) {
      this.terrainBobsArray[0][tileCol].destroy();
    }
    this.terrainBobsArray.splice(0, 1);
    console.log(
      "this.terrainBobsArray AFTER REMOVAL:>> ",
      this.terrainBobsArray
    );
    this.shadowMapFirstTilePositionOnScreen = lastRowVisible;

    this.shMapHolder.shadowMapArray.splice(0, 1);
    var prevShadowMapLen = this.shMapHolder.shadowMapArray.length;

    this.shMapHolder.generateNextRiverSections();
    console.log("Updated1 shadowmap :>> ");
    this.shMapHolder.debugPrintToConsole();

    console.log("this.shadowArrayRowDrawn :>> ", this.shadowArrayRowDrawn);

    this.shadowArrayRowDrawn =
      this.shadowArrayRowDrawn -
      (this.shMapHolder.shadowMapArray.length - prevShadowMapLen);

    console.log(
      "this.shadowArrayRowDrawn AFTER UPDATE :>> ",
      this.shadowArrayRowDrawn
    );

    this.drawShadowArray();

    this.copyTopMostVisibleRowToBottomScreen(cameraPosition);
  } //processTileBecomesInvisible() {

  update(cameraPosition) {
    console.log("update.cameraPosition :>> ", cameraPosition);
    var lastRowVisible = Math.floor(
      (cameraPosition + this.scene.game.config.height - 1) / TILE_WIDTH_HEIGHT
    );

    console.log("update.lastRowVisible :>> ", lastRowVisible);
    console.log(
      "update.this.shadowMapFirstTilePositionOnScreen :>> ",
      this.shadowMapFirstTilePositionOnScreen
    );

    console.log("this.terrainBobsArray :>> ", this.terrainBobsArray);

    if (lastRowVisible == SCENE_ROW_NO - 1) {
      console.log("This IS RESET of display :>> ");

      console.log("FINAL ROW PROCESSING :>> ");
      for (var tileCol = 0; tileCol < SCENE_TILES_ROW_LEN; tileCol++) {
        this.terrainBobsArray[0][tileCol].destroy();
      }
      this.terrainBobsArray.splice(0, 1);
      this.shadowMapFirstTilePositionOnScreen = lastRowVisible;

      this.copyTopMostVisibleRowToBottomScreen(cameraPosition);
      //END FINAL ROW PROCESSING

      //If below is enabled it will clear all texts even if nothing is drawn
      for (var i = 0; i < this.debugTextsArray.length; i++) {
        this.debugTextsArray[i].destroy();
      }
      this.debugTextsArray.splice(0);
      //Clearing this.terrainBobsArray
      for (var row = 0; row < this.terrainBobsArray.length; row++) {
        for (var col = 0; col < SCENE_TILES_ROW_LEN; col++) {
          this.terrainBobsArray[row][col].destroy();
        }
      }
      this.terrainBobsArray.splice(0);

      this.terrainBobsArray = this.lowerScreenTerrainBobsArray;
      this.lowerScreenTerrainBobsArray = [];
      this.shadowMapFirstTilePositionOnScreen = SCENE_ROW_NO * 2 - 1;

      console.log("ShadowMAP AFTER Screeen RESET :>> ");
      this.shMapHolder.debugPrintToConsole();
    } else {
      if (lastRowVisible < this.shadowMapFirstTilePositionOnScreen) {
        console.log("TILE BECOMES INVISIBLE :>> ");
        this.processTileBecomesInvisible(cameraPosition);
      } //if (lastRowVisible < this.shadowMapFirstTilePositionOnScreen) {
    } //else //if (lastRowVisible == SCENE_ROW_NO - 1) {
  } //update(cameraPosition) {

  copyTopMostVisibleRowToBottomScreen(cameraPosition) {
    console.log("copyTopMost.cameraPositio :>> ", cameraPosition);
    var lastRowVisible = Math.floor(
      (cameraPosition + this.scene.game.config.height - 1) / TILE_WIDTH_HEIGHT
    );
    console.log("copyTopMost.lastRowVisible :>> ", lastRowVisible);
    var screenRowNo2Copy = lastRowVisible - SCENE_ROW_NO + 1;
    console.log("copyTopMost.screenRowNo2Copy :>> ", screenRowNo2Copy);
    console.log(
      "copyTopMost.this.shadowArrayRowDrawn :>> ",
      this.shadowArrayRowDrawn
    );
    var shadowArrayRowNo2Copy = 27;
    var displayRowY = (lastRowVisible + 1) * TILE_WIDTH_HEIGHT;
    console.log("displayRowY :>> ", displayRowY);
    var terrainBobsRow = [];
    for (var colNo = 0; colNo < SCENE_TILES_ROW_LEN; colNo++) {
      var bob = this.terrainBlitter.create(
        colNo * TILE_WIDTH_HEIGHT,
        displayRowY,
        this.framesArray[
          this.shMapHolder.shadowMapArray[shadowArrayRowNo2Copy][colNo] + 1
        ]
      );
      terrainBobsRow.push(bob);

      this.debugTextsArray.push(
        addTextToScene(this.scene, `CopyRow`, 30, displayRowY, "#ffff0099")
      );
      // terrainBobsRow.push(bob);
    } //for (var colNo = 0; colNo < SCENE_TILES_ROW_LEN; colNo++) {
    this.lowerScreenTerrainBobsArray.push(terrainBobsRow);
    // var shadowRowNo2Copy = screenRowNo2Copy
  } //copyTopMostVisibleRowToBottomScreen(cameraPos) {
} //class BGUpdater {
