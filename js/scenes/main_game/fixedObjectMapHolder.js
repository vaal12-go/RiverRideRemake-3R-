import * as constants from "../../constants.js"
import {getRandomInt} from '../../helpers.js'

export class FixedObjectMapHolder {
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
  }

  removeBottomRow() {
    this.objectMapArray.splice(0, 1);
  }

  generateFuel(newRow) {
    if (
      this.shadowTerrainMapHolder.currentAbsRow >
      this.lastFuelGeneratedRow + this.MIN_ROWS_BETWEEN_FUEL
    ) {
      this.lastFuelGeneratedRow = this.shadowTerrainMapHolder.currentAbsRow;

      let lastRowBanks = this.shadowTerrainMapHolder.getRiverBanksCorrected();
      let penultimateRowBanks =
        this.shadowTerrainMapHolder.getRiverBanksCorrected(
          this.shadowTerrainMapHolder.shadowMapArray.length - 2
        );
      let proposedXPos = getRandomInt(penultimateRowBanks.riverWidth);
      if (this.objectMapArray.length - 1 > 3) {
        // So fuel is not generated at the bottom of the map
        let penultimateTerrainRow =
          this.shadowTerrainMapHolder.shadowMapArray[
            this.objectMapArray.length - 1
          ];
        let proposedTerrainTile =
          penultimateTerrainRow[
            penultimateRowBanks.leftRiverBank + proposedXPos
          ];
        if (proposedTerrainTile == 42) {
          newRow[penultimateRowBanks.leftRiverBank + proposedXPos] = 1001;
        }
      }
    }
  } //generateFuel() {

  generateEarthObjects(newRow) {
    //TODO: check undelying map tile if it is earth (#50) and not other tile
    if (getRandomInt(3) != 1) {
      return;
    }

    let terrRowIdx = this.objectMapArray.length;
    
    let terrainRow = this.shadowTerrainMapHolder.shadowMapArray[terrRowIdx];
    let lastRowBanks = this.shadowTerrainMapHolder.getRiverBanks(
      this.objectMapArray.length
    );
    let proposedXPos = getRandomInt(
      constants.SCENE_TILES_ROW_LEN - lastRowBanks.riverWidth - 2
    );

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

    if (proposedXPos < lastRowBanks.leftRiverBank) {
      newRow[proposedXPos] = object2Insert;
    } else {
      let idx =
        lastRowBanks.rightRiverBank +
        proposedXPos -
        lastRowBanks.leftRiverBank +
        2;
      newRow[idx] = object2Insert;
    }
  }

  generateObjects() {
    for (
      ;
      this.objectMapArray.length <
      this.shadowTerrainMapHolder.shadowMapArray.length;

    ) {
      let newRow = new Array(constants.SCENE_TILES_ROW_LEN);
      newRow.fill(-1, 0, constants.SCENE_TILES_ROW_LEN);
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
  } 
} //class ObjectMapHolder {
