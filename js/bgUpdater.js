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

    const startingMap = this.scene.make.tilemap({
      key: "startingMap",
      tileWidth: 32,
      tileHeight: 32,
    });

    //Filling the shadow array from start tilemap
    // TODO: expand to two screens
    for (var rowNo = SCENE_ROW_NO - 1; rowNo >= 0; rowNo--) {
      var newRowArr = [];
      for (var colNo = 0; colNo < SCENE_TILES_ROW_LEN; colNo++) {
        newRowArr.push(startingMap.layer.data[rowNo][colNo].index);
      }
      this.shadowScreenArray.push(newRowArr);
    } //for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {
    this.lastGeneratedShadowRow =
      this.shadowScreenArray[this.shadowScreenArray.length - 1];

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
    var shadowArrRows = this.shadowScreenArray.length;
    console.log("shadowArrRows :>> ", shadowArrRows);
    for (var rowNo = 0; rowNo < shadowArrRows - 1; rowNo++) {
      for (var colNo = 0; colNo < SCENE_TILES_ROW_LEN; colNo++) {
        this.backgroundDynamicTexture.draw(
          this.bgTilesArray[this.shadowScreenArray[0][colNo]],
          colNo * TILE_WIDTH_HEIGHT,
          this.scene.game.config.height * 2 -
            this.currentShadowArrayRowDrawn * TILE_WIDTH_HEIGHT
        );
      }
      //   this.shadowScreenArray.splice(this.shadowScreenArray.length - 1, 1);
      this.shadowScreenArray.splice(0, 1);

      this.currentShadowArrayRowDrawn++;
    } //for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {
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
      console.log("cameraPosition reaches tiles boundary :>> ", cameraPosition);
      this.generateNextRiverSections();
      this.drawShadowArray();
    }
  } //update(cameraPosition) {

  generateNextRiverSections() {
    var leftRiverBank = -1;
    var rightRiverBank = -1;

    for (var i = 0; i < SCENE_TILES_ROW_LEN; i++) {
      if (this.lastGeneratedShadowRow[i] == 51) {
        leftRiverBank = i;
      }
      if(this.lastGeneratedShadowRow[i] == 49) {
        rightRiverBank = i;
        break;
      }
    }
    // console.log('leftRiverBank :>> ', leftRiverBank);
    var leftBankDecision = Math.floor(Math.random() * 4);
    console.log("leftBankDecision :>> ", leftBankDecision);
    var newRow = [];
    //leave the bank as is case
    newRow = this.lastGeneratedShadowRow.slice(
      0,
      this.lastGeneratedShadowRow.length
    );

    switch (leftBankDecision) {
      case 0: //Widen left bank
        if(leftRiverBank<=1) {
          break; 
        }//if(leftRiverBank>1) {
        // console.log("Testing  replaceValuesInArray:>> ");
        // console.log(
        //   "this.lastGeneratedShadowRow :>> ",
        //   this.lastGeneratedShadowRow
        // );
        var newRow = replaceValuesInArray(
          this.lastGeneratedShadowRow,
          leftRiverBank - 1,
          52,
          39
        );
        // console.log("newRow :>> ", newRow);
        this.shadowScreenArray.push(newRow);

        newRow = replaceValuesInArray(
          this.lastGeneratedShadowRow,
          leftRiverBank - 1,
          51,
          42
        );
        // console.log("newRow :>> ", newRow);

        break;
        //END case 0: //Widen left bank
      case 1: //Leave the bank as is
        console.log("Should leave as is :>> ");
        newRow = this.lastGeneratedShadowRow.slice(
          0,
          this.lastGeneratedShadowRow.length
        );
        break;
      case 2: //Narrow the left bank
        if(leftRiverBank>=(rightRiverBank-2)) {
          break;
        }
        var newRow = replaceValuesInArray(
          this.lastGeneratedShadowRow,
          leftRiverBank,
          40,
          63
        );
        // console.log("newRow :>> ", newRow);
        this.shadowScreenArray.push(newRow);

        newRow = replaceValuesInArray(
          this.lastGeneratedShadowRow,
          leftRiverBank,
          50,
          51
        );

        break;
    } //switch(leftBankDecision) {

    this.shadowScreenArray.push(newRow);
    this.lastGeneratedShadowRow = newRow;
  } //generateNextRiverSections() {
} //class BGUpdater {
