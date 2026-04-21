import * as constants from "../../constants.js"
import { ShadowMapHolder } from "./shadowMapHolder.js";


// HIGH: clean this file
export class TerrainPainter {
  scene = null;
  shadowMap = null;
  framesArray = [null]; //sprite atlas starts from #1

  terrainBobsCreated = [];
  objectBobsCreated = [];
  terrainBlitter = null;
  objectBlitter = null;

  constructor(scene) {
    this.scene = scene;
    this.shadowMap = new ShadowMapHolder(this.scene);

    // this.shadowMap.debugPrintToConsole();
    var shadmap = this.shadowMap.getShadowMap();
    // console.log("shadmap :>> ", shadmap);
    // this.shadowMap.debugPrintToConsole();

    this.terrainBlitter = this.scene.add.blitter(0, 0, "terrain_atlas");
    //Creating bobs/frames:
    for (let spriteNo = 1; spriteNo <= 120; spriteNo++) {
      var newFrame = this.scene.textures.getFrame(
        "terrain_atlas",
        `sprite${spriteNo}`
      );
      this.framesArray.push(newFrame);
    } //for (let spriteNo = 1; spriteNo <= 120; spriteNo++) {

    this.objectBlitter = this.scene.add.blitter(0, 0, "fuel_tank");
    // this.objectBlitter.create(100, 100, 0);

    this.redrawBobs();
  } //constructor(scene, backgroundTilesetName) {

  createBobsRow(tileCodeArray, startingYPos) {
    var bobRow = [];
    for (var colNo = 0; colNo < constants.SCENE_TILES_ROW_LEN; colNo++) {
      var bob = this.terrainBlitter.create(
        colNo * constants.TILE_WIDTH_HEIGHT,
        startingYPos,
        this.framesArray[tileCodeArray[colNo] + 1]
      );
      bobRow.push(bob);
    }
    return bobRow;
  } //  createBobsRow(tileCodeArray, startingYPos) {

  clearBobsArray(bobArray) {
    bobArray.forEach((bob) => {
      bob.destroy();
    });
    bobArray.splice(0);
  }

  createTerrainBobs() {
    const shMap = this.shadowMap.getShadowMap();
    const displayRowY = this.scene.game.config.height;
    for (var rowNo = 0; rowNo < shMap.length; rowNo++) {
      const bobRow = this.createBobsRow(
        shMap[rowNo],
        displayRowY - rowNo * constants.TILE_WIDTH_HEIGHT
      );
      this.terrainBobsCreated.push(...bobRow);
    }
  }

  createObjectBobs() {
    let objMap = this.shadowMap.fixedObjHolder.objectMapArray;
    for (var rowNo = 0; rowNo < objMap.length; rowNo++) {
      let tileRow = objMap[rowNo];
      // console.log(" tileRow :>> ", tileRow);
      for (let tileNo = 0; tileNo < tileRow.length; tileNo++) {
        let tile = tileRow[tileNo];
        // console.log("tile :>> ", tile);

        // console.log("displayRowY :>> ", displayRowY);
        let bobCreated = null;
        let bobXPos = tileNo * constants.TILE_WIDTH_HEIGHT;
        var bobYPos = this.scene.game.config.height - rowNo * 
            constants.TILE_WIDTH_HEIGHT;
        if (tile > -1) {
          if (tile < 1000) {
            // Inserting tile from initial tileset
            bobCreated = this.terrainBlitter.create(
              bobXPos,
              bobYPos,
              this.framesArray[tile + 1]
            );
          } else {
            switch (tile) {
              case 1001: //Fuel
                bobCreated = this.objectBlitter.create(bobXPos, bobYPos, 0);
                break;
            } //switch (tile) {
          }

          if (!(bobCreated === null)) {
            this.objectBobsCreated.push(bobCreated);
          }
        } //if (tile > -1) {
      }
    } //for (var rowNo = 0; rowNo < objMap.length; rowNo++) {
  } //createObjectBobs() {

  redrawBobs() {
    this.clearBobsArray(this.terrainBobsCreated);
    this.clearBobsArray(this.objectBobsCreated);
    this.createTerrainBobs();
    this.createObjectBobs();
  } //redrawBobs() {

  update(cameraPosition) {
    if (cameraPosition == 0) {
      //This is before reset of camera
      this.shadowMap.removeBottomRow();
      this.redrawBobs();
    }
  } //update(cameraPosition) {

  // getShadowMap() {
  //   return this.shadowMap;
  // }
  getTileTypeUnderScreenCoords(x, y, cameraOffset) {
    const x_idx = Math.floor(x/constants.TILE_WIDTH_HEIGHT);
    console.log("terrain_painter:129 x_idx::", x_idx);
    const y_idx = Math.floor(y/constants.TILE_WIDTH_HEIGHT);
    console.log("terrain_painter:131 y_idx::", y_idx);
    const shMap = this.shadowMap.getShadowMap();
    const tileType = shMap[y_idx][x_idx];
    console.log("terrain_painter:134 tileType::", tileType);
    return -100;
  }
} //class TerrainPainter {
