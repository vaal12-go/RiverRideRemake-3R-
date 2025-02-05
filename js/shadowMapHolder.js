class ShadowMapHolder {
  shadowMapArray = [];
  scene = null;

  constructor(scene) {
    this.scene = scene;
    const startingMap = this.scene.make.tilemap({
      key: STARTING_TILEMAP,
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

  getShadowMap() {
    while (this.shadowMapArray.length < SCENE_ROW_NO + 1) {
      this.generateNextRiverSections();
    }
    return this.shadowMapArray.slice(0, SCENE_ROW_NO + 1);
  }

  removeBottomRow() {
    this.shadowMapArray.splice(0, 1);
  }

  debugPrintToConsole() {
    // var lineNo = this.shadowMapArray.length-1;
    for (let rowNo = this.shadowMapArray.length - 1; rowNo >= 0; rowNo--) {
      var line2Print = zeroFill(rowNo, 2) + ": ";
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
      // lineNo++;
    }
    console.log("shadowMapArray.length :>> ", this.shadowMapArray.length);
  } //END debugPrintToConsole() {

  rightBankDecision(leftRiverBank, rightRiverBank) {
    var lastRow = this.shadowMapArray[this.shadowMapArray.length - 1];
    var newRow = lastRow.slice(0, lastRow.length);

    var rightBankDecision = getRandomInt(3);
    console.log("rightRiverBank :>> ", rightRiverBank);
    console.log("rightBankDecision :>> ", rightBankDecision);
    switch (rightBankDecision) {
      case 0: //Leave as is - do nothing.
        break;

      case 1: //Widen right bank
        if (rightRiverBank > SCENE_TILES_ROW_LEN - 3) {
          break;
        } //if (rightRiverBank > (SCENE_ROW_NO - 1)) {
        var interimRow = replaceValuesInArray(lastRow, rightRiverBank, 37, 53);
        console.log("interimRow :>> ", interimRow);
        this.shadowMapArray.push(interimRow);
        newRow = replaceValuesInArray(lastRow, rightRiverBank, 42, 49);
        break;
      //END of case 1: //Widen right bank

      case 2: //Narrow right bank
        if (rightRiverBank <= leftRiverBank - 4) {
          break;
        }
        var interimRow = replaceValuesInArray(
          lastRow,
          rightRiverBank - 1,
          61,
          41
        );
        // console.log("newRow :>> ", newRow);
        this.shadowMapArray.push(interimRow);
        newRow = replaceValuesInArray(lastRow, rightRiverBank - 1, 49, 50);
        break;
      //END of case 2: //Narrow right bank
    } //switch (rightBankDecision) {
    console.log("Returning newRow :>> ", newRow);
    return newRow;
  } //rightBankDecision(leftRiverBank, rightRiverBank) {

  generateNextRiverSections() {
    var lastRow = this.shadowMapArray[this.shadowMapArray.length - 1];

    // var lastRow = this.shadowMapArray[this.shadowMapArray.length - 1];
    var leftRiverBank = -1;
    var rightRiverBank = -1;
    for (var i = 0; i < SCENE_TILES_ROW_LEN; i++) {
      if (lastRow[i] == 51) {
        leftRiverBank = i;
      }
      if (lastRow[i] == 49) {
        rightRiverBank = i;
        break;
      }
    }
    console.log("leftRiverBank :>> ", leftRiverBank);
    console.log("rightRiverBank :>> ", rightRiverBank);

    var leftBankDecision = getRandomInt(3);
    console.log("leftBankDecision :>> ", leftBankDecision);

    var newRow = lastRow.slice(0, lastRow.length);
    switch (leftBankDecision) {
      case 0: //Leave as is. Do nothing - repeated row is already in newRow
        newRow = this.rightBankDecision(leftRiverBank, rightRiverBank);
        break;

      case 1: //Widen left bank
        if (leftRiverBank <= 1) {
          break;
        } //if(leftRiverBank>1) {
        var interimRow = replaceValuesInArray(
          lastRow,
          leftRiverBank - 1,
          52,
          39
        );
        console.log("interimRow :>> ", interimRow);
        this.shadowMapArray.push(interimRow);
        newRow = replaceValuesInArray(lastRow, leftRiverBank - 1, 51, 42);
        break;
      //END of case 1: //Widen left bank

      case 2: //Narrow left bank
        if (leftRiverBank >= rightRiverBank - 4) {
          break;
        }
        var interimRow = replaceValuesInArray(lastRow, leftRiverBank, 40, 63);
        // console.log("newRow :>> ", newRow);
        this.shadowMapArray.push(interimRow);
        newRow = replaceValuesInArray(lastRow, leftRiverBank, 50, 51);
        break;
      //END of case 2: //Narrow left bank
    } //switch (leftBankDecision) {

    this.shadowMapArray.push(newRow);

    //leave the bank as is case
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
