class TerrainPainter {
  scene = null;
  shadowMap = null;
  framesArray = [null]; //sprite atlas starts from #1

  bobsCreated = [];

  constructor(scene) {
    this.scene = scene;
    this.shadowMap = new ShadowMapHolder(this.scene);

    this.shadowMap.debugPrintToConsole();
    var shadmap = this.shadowMap.getShadowMap();
    console.log("shadmap :>> ", shadmap);

    this.terrainBlitter = this.scene.add.blitter(0, 0, "terrain_atlas");
    //Creating bobs/frames:
    for (let spriteNo = 1; spriteNo <= 120; spriteNo++) {
      var newFrame = this.scene.textures.getFrame(
        "terrain_atlas",
        `sprite${spriteNo}`
      );
      this.framesArray.push(newFrame);
    } //for (let spriteNo = 1; spriteNo <= 120; spriteNo++) {

    this.redrawBobs();
  } //constructor(scene, backgroundTilesetName) {

  createBobsRow(tileCodeArray, startingYPos) {
    var bobRow = [];
    for (var colNo = 0; colNo < SCENE_TILES_ROW_LEN; colNo++) {
      var bob = this.terrainBlitter.create(
        colNo * TILE_WIDTH_HEIGHT,
        startingYPos,
        this.framesArray[tileCodeArray[colNo] + 1]
      );
      bobRow.push(bob);
    }
    return bobRow;
  } //  createBobsRow(tileCodeArray, startingYPos) {

  redrawBobs() {
    this.bobsCreated.forEach((bob) => {
      bob.destroy();
    });
    this.bobsCreated.splice(0);

    var shMap = this.shadowMap.getShadowMap();
    var displayRowY = this.scene.game.config.height;
    for (var rowNo = 0; rowNo < shMap.length; rowNo++) {
      var bobRow = this.createBobsRow(
        shMap[rowNo],
        displayRowY - rowNo * TILE_WIDTH_HEIGHT
      );
      this.bobsCreated.push(...bobRow);
    }
  } //redrawBobs() {

  update(cameraPosition) {
    // console.log("TerrainPainte`r update method called :>> ");
    // console.log("cameraPosition :>> ", cameraPosition);

    if (cameraPosition == 0) {
      //This is before reset of camera
      this.shadowMap.removeBottomRow();
      this.redrawBobs();
    } //if(cameraPosition==0) {//This is before reset of camera
  } //update(cameraPosition) {
} //class TerrainPainter {
