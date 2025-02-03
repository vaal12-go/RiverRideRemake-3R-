class ShadowMapHolder {
  shadowMapArray = [];
  scene = null;

  constructor(scene, startingTileMapName) {
    this.scene = scene;
    const startingMap = this.scene.make.tilemap({
      key: startingTileMapName,
      tileWidth: TILE_WIDTH_HEIGHT,
      tileHeight: TILE_WIDTH_HEIGHT,
    });

    //Filling the shadow array from start tilemap
    for (var rowNo = SCENE_ROW_NO - 1; rowNo >= 0; rowNo--) {
      var newRowArr = [];
      for (var colNo = 0; colNo < SCENE_TILES_ROW_LEN; colNo++) {
        newRowArr.push(startingMap.layer.data[rowNo][colNo].index);
      }
      this.shadowMapArray.push(newRowArr);
    } //for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {
  } //END constructor(startingTileSetName)

  debugPrintToConsole() {
    var lineNo = 0;
    for (let rowNo = 0; rowNo < this.shadowMapArray.length; rowNo++) {
      var line2Print = zeroFill(lineNo, 2) + ": ";
      for (let colNo = 0; colNo < SCENE_TILES_ROW_LEN; colNo++) {
        line2Print += "," + zeroFill(this.shadowMapArray[rowNo][colNo], 2);
      }

      console.log("line2Print :>> ", line2Print);
      lineNo++;
    }
  } //END debugPrintToConsole() {
} //END class ShadowMapHolder {
