class TerrainPainter {
  scene = null;
  shadowMap = null;
  framesArray = [null]; //sprite atlas starts from #1

  constructor(scene) {
    this.scene = scene;

    this.terrainBlitter = this.scene.add.blitter(0, 0, "terrain_atlas");
    //Creating bobs/frames:
    for (let spriteNo = 1; spriteNo <= 120; spriteNo++) {
      var newFrame = this.scene.textures.getFrame(
        "terrain_atlas",
        `sprite${spriteNo}`
      );
      this.framesArray.push(newFrame);
    } //for (let spriteNo = 1; spriteNo <= 120; spriteNo++) {
  } //constructor(scene, backgroundTilesetName) {

  createBobsRow(tileCodeArray, startingYPos) {
    var bobRow = [];

    for (var colNo = 0; colNo < SCENE_TILES_ROW_LEN; colNo++) {
      var bob = this.terrainBlitter.create(
        colNo * TILE_WIDTH_HEIGHT,
        startingYPos,
        this.framesArray[tileCodeArray[colNo]]
      );
      bobRow.push(bob);
    }
    return bobRow;
  } //  createBobsRow(tileCodeArray, startingYPos) {

  bobsCreated = [];

  update(cameraPosition) {
    console.log("TerrainPainter update method called :>> ");

    this.bobsCreated.forEach((bob) => {
      bob.destroy();
    });
    this.bobsCreated.splice(0);

    //Generate random display
    var randomTilesArray = [];
    for (var rowNo = 0; rowNo < SCENE_ROW_NO; rowNo++) {
      var rowArray = [];
      for (var colNo = 0; colNo < SCENE_TILES_ROW_LEN; colNo++) {
        rowArray.push(getRandomInt(100));
      } //for(var colNo=0; colNo<SCENE_TILES_ROW_LEN; colNo++) {
      randomTilesArray.push(rowArray);
    } //for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {

    var displayRowY = this.scene.game.config.height * 2 - TILE_WIDTH_HEIGHT;
    for (var rowNo = 0; rowNo < randomTilesArray.length; rowNo++) {
      var bobRow = this.createBobsRow(
        randomTilesArray[rowNo],
        displayRowY - rowNo * TILE_WIDTH_HEIGHT
      );
      this.bobsCreated.push(...bobRow);
    }
    //For upper display as well
    displayRowY = this.scene.game.config.height - TILE_WIDTH_HEIGHT;
    for (var rowNo = 0; rowNo < randomTilesArray.length; rowNo++) {
      var bobRow = this.createBobsRow(
        randomTilesArray[rowNo],
        displayRowY - rowNo * TILE_WIDTH_HEIGHT
      );
      this.bobsCreated.push(...bobRow);
    }
  } //update(cameraPosition) {
} //class TerrainPainter {
