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
    //.setIsSpriteTexture(false)

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

    // for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {//Filling 1st screen
    //     var newRowArr2 = [];
    //     for (var colNo=0; colNo<SCENE_TILES_ROW_LEN; colNo++) {
    //         newRowArr2.push(42);
    //     }
    //     this.shadowScreenArray.push(newRowArr2);
    // }//for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {

    // console.log('startingMap :>> ', startingMap);
    // console.log('startingMap2.layer.data[0][0] :>> ', startingMap.layer.data[0][0].index);
    //Filling the shadow array from start tilemap
    // TODO: expand to two screens
    // console.log('SCENE_ROW_NO :>> ', SCENE_ROW_NO);
    for (var rowNo = 0; rowNo < SCENE_ROW_NO; rowNo++) {
      //Filling 1st screen
      var newRowArr = [];
      for (var colNo = 0; colNo < SCENE_TILES_ROW_LEN; colNo++) {
        // console.log('rowNo :>> ', rowNo);
        // console.log('colNo :>> ', colNo);
        // console.log('object :>> ', startingMap.layer.data[rowNo][colNo].index);
        newRowArr.push(startingMap.layer.data[rowNo][colNo].index);
      }
      this.shadowScreenArray.push(newRowArr);
    } //for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {
    this.lastGeneratedShadowRow = this.shadowScreenArray[0];

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
    for (var rowNo = shadowArrRows - 1; rowNo >= 0; rowNo--) {
      for (var colNo = 0; colNo < SCENE_TILES_ROW_LEN; colNo++) {
        this.backgroundDynamicTexture.draw(
          this.bgTilesArray[this.shadowScreenArray[rowNo][colNo]],
          colNo * TILE_WIDTH_HEIGHT,
          this.scene.game.config.height * 2 -
            this.currentShadowArrayRowDrawn * TILE_WIDTH_HEIGHT
        );
      }
      this.shadowScreenArray.splice(this.shadowScreenArray.length - 1, 1);
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
    // console.log('generateNextRiverSections :>> ');
    // console.log('this.shadowScreenArray :>> ', this.shadowScreenArray);
    var leftRiverBank = -1;
    // var lastShadowRowArr = this.shadowScreenArray[this.shadowScreenArray.length-1];
    // console.log('this.lastGeneratedShadowRow :>> ', this.lastGeneratedShadowRow);

    for (var i = 0; i < SCENE_TILES_ROW_LEN; i++) {
      if (this.lastGeneratedShadowRow[i] == 51) {
        leftRiverBank = i;
        break;
      }
    }
    // console.log('leftRiverBank :>> ', leftRiverBank);
    var leftBankDecision = Math.floor(Math.random() * 4);
    // console.log('leftBankDecision :>> ', leftBankDecision);
    var newRow = [];
    //leave the bank as is case
    newRow = this.lastGeneratedShadowRow.slice(
      0,
      this.lastGeneratedShadowRow.length
    );

    switch (leftBankDecision) {
      case 0: //Widen left bank
        break;
      case 1: //Leave the bank as is
        break;
      case 2: //Narrow the left bank
        break;
    } //switch(leftBankDecision) {

    this.shadowScreenArray.push(newRow);
    this.lastGeneratedShadowRow = newRow;
  } //generateNextRiverSections() {
} //class BGUpdater {
