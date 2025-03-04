class FixedObjectMapHolder {
  objectMapArray = [];
  scene = null;
  shadowTerrainMapHolder = null;

  specialObjectsMap = {
    1001: "fuel_tank",
  };

  lastFuelGeneratedRow = -1000;
  MIN_ROWS_BETWEEN_FUEL = 20;

  constructor(scene, terrainMapHolder) {
    this.scene = scene;
    this.shadowTerrainMapHolder = terrainMapHolder;
    this.generateObjects();
    // this.debugPrint();
  }

  removeBottomRow() {
    this.objectMapArray.splice(0, 1);
  }

  generateFuel(newRow) {
    if (
      this.shadowTerrainMapHolder.currentAbsRow >
      this.lastFuelGeneratedRow + this.MIN_ROWS_BETWEEN_FUEL
    ) {
      // console.log("Will generate fuel :>> ");
      this.lastFuelGeneratedRow = this.shadowTerrainMapHolder.currentAbsRow;

      let lastRowBanks = this.shadowTerrainMapHolder.getRiverBanksCorrected();
      // console.log("lastRowBanks :>> ", lastRowBanks);
      let penultimateRowBanks =
        this.shadowTerrainMapHolder.getRiverBanksCorrected(
          this.shadowTerrainMapHolder.shadowMapArray.length - 2
        );
      // console.log("penultimateRowBanks :>> ", penultimateRowBanks);
      let proposedXPos = getRandomInt(penultimateRowBanks.riverWidth);
      // console.log("proposedXPos :>> ", proposedXPos);
      // console.log(
      //   "this.shadowTerrainMapHolder.shadowMapArray :>> ",
      //   this.shadowTerrainMapHolder.shadowMapArray
      // );
      // console.log(
      //   "(this.objectMapArray.length - 1) :>> ",
      //   this.objectMapArray.length - 1
      // );
      if (this.objectMapArray.length - 1 > 3) {
        // So fuel is not generated at the bottom of the map
        let penultimateTerrainRow =
          this.shadowTerrainMapHolder.shadowMapArray[
            this.objectMapArray.length - 1
          ];
        // console.log("penultimate row :>> ", penultimateTerrainRow);
        // this.shadowTerrainMapHolder.debugPrintMapLine(penultimateTerrainRow);
        let proposedTerrainTile =
          penultimateTerrainRow[
            penultimateRowBanks.leftRiverBank + proposedXPos
          ];
        // console.log("proposedTerrainTile :>> ", proposedTerrainTile);
        if (proposedTerrainTile == 42) {
          newRow[penultimateRowBanks.leftRiverBank + proposedXPos] = 1001;
        }
      }
    }
  } //generateFuel() {

  generateEarthObjects(newRow) {
    //TODO: check undelying map tile if it is earth (#50) and not other tile
    // console.log("generateEarthObjects :>> ");
    if (getRandomInt(3) != 1) {
      return;
    }

    let terrRowIdx = this.objectMapArray.length;
    // console.log(
    //   "this.shadowTerrainMapHolder.shadowMapArray.length :>> ",
    //   this.shadowTerrainMapHolder.shadowMapArray.length
    // );
    // console.log(" terrRowIdx :>> ", terrRowIdx);
    let terrainRow = this.shadowTerrainMapHolder.shadowMapArray[terrRowIdx];
    // console.log("terrainRow :>> ", terrainRow);
    // this.shadowTerrainMapHolder.debugPrintMapLine(terrainRow);
    let lastRowBanks = this.shadowTerrainMapHolder.getRiverBanks(
      this.objectMapArray.length
    );
    // console.log("lastRowBanks :>> ", lastRowBanks);
    let proposedXPos = getRandomInt(
      SCENE_TILES_ROW_LEN - lastRowBanks.riverWidth - 2
    );
    // console.log("proposedXPos :>> ", proposedXPos);

    let object2Insert = 60;
    switch (getRandomInt(6)) {
      case 1: //Double trees
        object2Insert = 60;
        break;
      case 2: //single tree
        object2Insert = 48;
        break;
      case 3: //bush
        object2Insert = 36;
        break;
      case 4: //low house
        object2Insert = 84;
        break;
      case 5: //bigger house
        object2Insert = 72;
        break;
      default:
        return;
    }
    // console.log("object2Insert :>> ", object2Insert);

    if (proposedXPos < lastRowBanks.leftRiverBank) {
      newRow[proposedXPos] = object2Insert;
    } else {
      let idx =
        lastRowBanks.rightRiverBank +
        proposedXPos -
        lastRowBanks.leftRiverBank +
        2;
      // console.log("idx :>> ", idx);
      newRow[idx] = object2Insert;
    }
  }

  generateObjects() {
    // console.log(
    //   "this.shadowTerrainMapHolder :>> ",
    //   this.shadowTerrainMapHolder
    // );
    // console.log("this.objectMapArray.length :>> ", this.objectMapArray.length);
    // console.log(
    //   "this.shadowTerrainMapHolder.shadowMapArray.length :>> ",
    //   this.shadowTerrainMapHolder.shadowMapArray.length
    // );
    for (
      ;
      this.objectMapArray.length <
      this.shadowTerrainMapHolder.shadowMapArray.length;

    ) {
      let newRow = new Array(SCENE_TILES_ROW_LEN);
      newRow.fill(-1, 0, SCENE_TILES_ROW_LEN);
      this.generateFuel(newRow);
      this.generateEarthObjects(newRow);

      this.objectMapArray.push(newRow);
    }
  } //generateObjects() {

  debugPrint() {
    console.log(
      `FixedObjectMapHolder. debugPrint :>> arrayHeight:${this.objectMapArray.length}`
    );
    for (let y = 0; y < this.objectMapArray.length; y++) {
      let rowStr = "";
      let row = this.objectMapArray[y];
      // console.log("row :>> ", row);
      for (let x = 0; x < row.length; x++) {
        rowStr += `_${row[x]}`;
      }
      console.log(`[${y}]:${rowStr}`);
    }
  } //debugPrint() {
} //class ObjectMapHolder {
