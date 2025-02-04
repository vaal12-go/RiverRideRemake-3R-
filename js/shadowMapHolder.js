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
        var mapTile = this.shadowMapArray[rowNo][colNo];
        var outStr = zeroFill(mapTile, 2);
        switch (mapTile) {
          case 50:
            outStr = "*";
            break;
          case 51:
            outStr = "{";
            break;

          case 42:
            outStr = "~";
            break;
          case 49:
            outStr = "}";
            break;
          case 40:
            outStr = "L";
            break;
          case 63:
            outStr = "\\";
            break;
          case 61:
            outStr = "/";
            break;
          case 41:
            outStr = "T";
            break;
        }
        // line2Print += "," + outStr;
        line2Print += outStr;
      }

      console.log("line2Print :>> ", line2Print);
      lineNo++;
    }
  } //END debugPrintToConsole() {

  generateNextRiverSections() {
    console.log("Should leave as is :>> ");
    var lastRow = this.shadowMapArray[this.shadowMapArray.length - 1];
    var newRow = lastRow.slice(0, lastRow.length);

    this.shadowMapArray.push(newRow);
    //     var leftRiverBank = -1;
    //     var rightRiverBank = -1;
    //     for (var i = 0; i < SCENE_TILES_ROW_LEN; i++) {
    //       if (this.lastGeneratedShadowRow[i] == 51) {
    //         leftRiverBank = i;
    //       }
    //       if (this.lastGeneratedShadowRow[i] == 49) {
    //         rightRiverBank = i;
    //         break;
    //       }
    //     }
    //     // console.log('leftRiverBank :>> ', leftRiverBank);
    //     var leftBankDecision = Math.floor(Math.random() * 4);
    //     // console.log("leftBankDecision :>> ", leftBankDecision);
    //     var newRow = [];
    //     //leave the bank as is case
    //     newRow = this.lastGeneratedShadowRow.slice(
    //       0,
    //       this.lastGeneratedShadowRow.length
    //     );
    //     switch (leftBankDecision) {
    //       case 0: //Widen left bank
    //         if (leftRiverBank <= 1) {
    //           break;
    //         } //if(leftRiverBank>1) {
    //         // console.log("Testing  replaceValuesInArray:>> ");
    //         // console.log(
    //         //   "this.lastGeneratedShadowRow :>> ",
    //         //   this.lastGeneratedShadowRow
    //         // );
    //         var newRow = replaceValuesInArray(
    //           this.lastGeneratedShadowRow,
    //           leftRiverBank - 1,
    //           52,
    //           39
    //         );
    //         // console.log("newRow :>> ", newRow);
    //         this.shadowScreenArray.push(newRow);
    //         newRow = replaceValuesInArray(
    //           this.lastGeneratedShadowRow,
    //           leftRiverBank - 1,
    //           51,
    //           42
    //         );
    //         // console.log("newRow :>> ", newRow);
    //         break;
    //       //END case 0: //Widen left bank
    //       case 1: //Leave the bank as is
    //         console.log("Should leave as is :>> ");
    //         newRow = this.lastGeneratedShadowRow.slice(
    //           0,
    //           this.lastGeneratedShadowRow.length
    //         );
    //         break;
    //       case 2: //Narrow the left bank
    //         if (leftRiverBank >= rightRiverBank - 2) {
    //           break;
    //         }
    //         var newRow = replaceValuesInArray(
    //           this.lastGeneratedShadowRow,
    //           leftRiverBank,
    //           40,
    //           63
    //         );
    //         // console.log("newRow :>> ", newRow);
    //         this.shadowScreenArray.push(newRow);
    //         newRow = replaceValuesInArray(
    //           this.lastGeneratedShadowRow,
    //           leftRiverBank,
    //           50,
    //           51
    //         );
    //         break;
    //     } //switch(leftBankDecision) {
    //     this.shadowScreenArray.push(newRow);
    //     this.lastGeneratedShadowRow = newRow;
    //   } //generateNextRiverSections() {
  } //END generateNextRiverSections() {
} //END class ShadowMapHolder {
