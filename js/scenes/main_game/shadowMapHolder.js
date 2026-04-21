import * as constants from "../../constants.js"
import {FixedObjectMapHolder} from './fixedObjectMapHolder.js'
import {getRandomInt, replaceValuesInArray} from '../../helpers.js'

export class ShadowMapHolder {
  shadowMapArray = [];
  fixedObjHolder = null;
  scene = null;
  currentAbsRow = 0;
  lastBridgeGeneratedRow = -1000;
  MIN_ROWS_BETWEEN_BRIDGES = 30;

  constructor(scene) {
    this.scene = scene;
    const startingMap = this.scene.make.tilemap({
      key: constants.STARTING_TILEMAP,
      tileWidth: constants.TILE_WIDTH_HEIGHT,
      tileHeight: constants.TILE_WIDTH_HEIGHT,
    });

    //Filling the shadow array from start tilemap
    for (var rowNo = constants.SCENE_ROW_NO - 1; rowNo >= 0; rowNo--) {
      var newRowArr = [];
      for (var colNo = 0; colNo < constants.SCENE_TILES_ROW_LEN; colNo++) {
        newRowArr.push(startingMap.layer.data[rowNo][colNo].index);
      }
      this.shadowMapArray.push(newRowArr);
    } //for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {

    this.fixedObjHolder = new FixedObjectMapHolder(scene, this);
  } //END constructor(startingTileSetName)

  getShadowMap() {
    while (this.shadowMapArray.length < constants.SCENE_ROW_NO + 1) {
      this.generateNextRiverSections();
    }
    return this.shadowMapArray.slice(0, constants.SCENE_ROW_NO + 1);
  }

  removeBottomRow() {
    this.shadowMapArray.splice(0, 1);
    this.fixedObjHolder.removeBottomRow();
  }

  debugChar(tileCode) {
    switch (tileCode) {
      case 37:
        return "(";
      case 39:
        return ")";
      case 40:
        return "t";
      case 41:
        return "T";
      case 42:
        return "~";
      case 49:
        return "}";
      case 50:
        return "*";
      case 51:
        return "{";
      case 52:
        return "L";
      case 53:
        return "J";

      case 63:
        return "\\";
      case 61:
        return "/";
      case 74:
        return "=";
      case 109:
        return "^";
      default:
        return `_${tileCode}_`;
    }
  } //debugChar(tileCode) {

  debugPrintMapLine(mapLine) {
    let outStr = "";
    for (let charIdx in mapLine) {
      outStr += this.debugChar(mapLine[charIdx]);
    }
    console.log("debugPrintMapLine :>> ", outStr);
    return outStr;
  }

  debugPrintToConsole() {
    console.log("debugPrintToConsole() :>> ", this.shadowMapArray);
    for (let rowNo = this.shadowMapArray.length - 1; rowNo >= 0; rowNo--) {
      var line2Print = zeroFill(rowNo, 2) + ": ";
      for (let colNo = 0; colNo < constants.SCENE_TILES_ROW_LEN; colNo++) {
        var mapTile = this.shadowMapArray[rowNo][colNo];
        var outStr = this.debugChar(mapTile);
        line2Print += outStr;
      }
      // console.log("line2Print :>> ", line2Print);
      let banks = this.getRiverBanks(rowNo);
      // console.log("banks :>> ", banks);
    }
    // console.log("shadowMapArray.length :>> ", this.shadowMapArray.length);
  } //END debugPrintToConsole() {

  

  // TODO: move generation of bridges and banks to separate file

  rightBankDecision(leftRiverBank, rightRiverBank) {
    var lastRow = this.shadowMapArray[this.shadowMapArray.length - 1];
    var newRow = lastRow.slice(0, lastRow.length);

    var rightBankDecision = getRandomInt(3);
    switch (rightBankDecision) {
      case 0: //Leave as is - do nothing.
        break;

      case 1: //Widen right bank
        if (rightRiverBank > constants.SCENE_TILES_ROW_LEN - 3) {
          break;
        } 
        var interimRow = replaceValuesInArray(lastRow, rightRiverBank, 37, 53);
        this.shadowMapArray.push(interimRow);
        newRow = replaceValuesInArray(lastRow, rightRiverBank, 42, 49);
        break;
      //END of case 1: //Widen right bank

      case 2: //Narrow right bank
        if (rightRiverBank <= leftRiverBank + 4) {
          break;
        }
        var interimRow = replaceValuesInArray(
          lastRow,
          rightRiverBank - 1,
          61,
          41
        );
        this.shadowMapArray.push(interimRow);
        newRow = replaceValuesInArray(lastRow, rightRiverBank - 1, 49, 50);
        break;
      //END of case 2: //Narrow right bank
    } //switch (rightBankDecision) {
    return newRow;
  } //rightBankDecision(leftRiverBank, rightRiverBank) {

  generateBridgeSection(leftRiverBank, rightRiverBank) {
    var lastRow = this.shadowMapArray[this.shadowMapArray.length - 1];
    // TODO: rewrite this to use mapFragment - array of arrays with bridge tilemaps
    var interimRow = replaceValuesInArray(
      lastRow,
      leftRiverBank,
      40,
      63,
      42,
      42,
      61,
      41
    );
    // interimRow = replaceValuesInArray(interimRow, leftRiverBank, 40, 63);
    // console.log("interimRow1:>> ");
    // this.debugPrintMapLine(interimRow);

    // let interimRow2 = replaceValuesInArray(
    //   interimRow,
    //   leftRiverBank,
    //   74,
    //   74,
    //   42,
    //   42,
    //   74,
    //   74
    // );
    // console.log("interimRow2 :>> ");
    // this.debugPrintMapLine(interimRow2);
    let roadRow = new Array(constants.SCENE_ROW_LEN);
    roadRow.fill(74, 0, constants.SCENE_ROW_LEN);
    // console.log("roadRow :>> ", roadRow);
    let interimRow3 = replaceValuesInArray(
      roadRow,
      leftRiverBank + 2,
      109,
      109
    );

    let interimRow4 = replaceValuesInArray(
      interimRow,
      leftRiverBank,
      52,
      39,
      42,
      42,
      37,
      53
    );

    this.shadowMapArray.push(interimRow);
    // this.shadowMapArray.push(interimRow2);
    this.shadowMapArray.push(interimRow3);
    this.shadowMapArray.push(interimRow4);
    this.shadowMapArray.push(lastRow);
    // this.debugPrintToConsole();
  } //generateBridgeSection(leftRiverBank, rightRiverBank) {

  getRiverBanks(rowNo = -1) {
    // console.log("getRiverBanks :>> ");

    if (rowNo == -1) {
      rowNo = this.shadowMapArray.length - 1;
    }
    let lastRow = this.shadowMapArray[rowNo];
    // this.debugPrintMapLine(lastRow);
    let leftRiverBank = -1;
    let rightRiverBank = -1;
    let i = 0;
    for (; i < constants.SCENE_TILES_ROW_LEN; i++) {
      // console.log("lastRow[i] :>> ", lastRow[i]);
      if (lastRow[i] == 42) {
        leftRiverBank = i - 1;
        break;
      }
    }
    for (; i < constants.SCENE_TILES_ROW_LEN; i++) {
      if (lastRow[i] != 42) {
        rightRiverBank = i;
        break;
      }
    }
    let retObj = {
      leftRiverBank: leftRiverBank,
      rightRiverBank: rightRiverBank,
      riverWidth: rightRiverBank - leftRiverBank,
    };
    // console.log("retObj :>> ", retObj);
    return retObj;
  } //getRiverBanks() {

  getRiverBanksCorrected(rowNo = -1) {
    let banks = this.getRiverBanks(rowNo);
    return {
      leftRiverBank: banks.leftRiverBank + 1,
      rightRiverBank: banks.rightRiverBank - 1,
      riverWidth: banks.rightRiverBank - banks.leftRiverBank - 1,
    };
  } //getRiverBanksCorrected(rowNo = -1) {

  generateNextRiverSections() {
    let banksObj = this.getRiverBanks();
    let leftRiverBank = banksObj.leftRiverBank;
    let rightRiverBank = banksObj.rightRiverBank;
    var riverWidth = rightRiverBank - leftRiverBank;

    let mapArrLenBefore = this.shadowMapArray.length;
    let lastRow = this.shadowMapArray[mapArrLenBefore - 1];

    if (riverWidth == 5) {
      if (
        this.currentAbsRow >
        this.lastBridgeGeneratedRow + this.MIN_ROWS_BETWEEN_BRIDGES
      ) {
        this.generateBridgeSection(leftRiverBank, rightRiverBank);
        this.currentAbsRow += 5;
        this.lastBridgeGeneratedRow = this.currentAbsRow;
        return;
      }
    }

    var leftBankDecision = getRandomInt(7);
    //Probabilities:
    // 0 - both banks stay the same
    // 1 -  widen left bank
    // 2 - narrow left bank
    // 3 to 6 - some decision with right bank.
    // console.log("leftBankDecision :>> ", leftBankDecision);
    // TEST
    // leftBankDecision = 2;

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
        this.shadowMapArray.push(interimRow);
        newRow = replaceValuesInArray(lastRow, leftRiverBank - 1, 51, 42);
        break;
      //END of case 1: //Widen left bank

      case 2: //Narrow left bank
        if (leftRiverBank >= rightRiverBank - 4) {
          break;
        }
        var interimRow = replaceValuesInArray(lastRow, leftRiverBank, 40, 63);
        this.shadowMapArray.push(interimRow);
        newRow = replaceValuesInArray(lastRow, leftRiverBank, 50, 51);
        break;
      //END of case 2: //Narrow left bank

      default: //Left bank stays - decision is with right bank
        newRow = this.rightBankDecision(leftRiverBank, rightRiverBank);
        break;
    } //switch (leftBankDecision) {

    this.shadowMapArray.push(newRow);
    let mapArrLenAfter = this.shadowMapArray.length;
    this.currentAbsRow += mapArrLenAfter - mapArrLenBefore;
    // console.log("this.currentAbsRow :>> ", this.currentAbsRow);

    this.fixedObjHolder.generateObjects();
  } //END generateNextRiverSections() {
} //END class ShadowMapHolder {
