

class BGUpdater {
    // mapHeightInTiles = 0;
    // mapWidthInTiles = 0;

    backgroundDynamicTexture = null;
    bgTileSetName = "";
    bgTileSetTexture = null;
    bgTilesArray = null;

    shadowScreenArray = [];//This will hold tile numbers (2 screens)

    scene = null;
    

    constructor(scene, backgroundTilesetName) {
        this.scene = scene
        // this.mapHeightInTiles = this.game.config.height/TILE_WIDTH_HEIGHT;
        // this.mapWidthInTiles = this.game.config.widt/TILE_WIDTH_HEIGHT;

        this.backgroundDynamicTexture = this.scene.textures.addDynamicTexture(
            "BGUpdater_backgroundDynamicTexture",
            this.scene.game.config.width,
            this.scene.game.config.height * 2
          );

        this.bgTileSetName = backgroundTilesetName;
        this.bgTileSetTexture = scene.textures.get(this.bgTileSetName);
        this.bgTilesArray = getTileArrayFromTileset(this.bgTileSetTexture, TILE_WIDTH_HEIGHT);

        //Filling the shadow array
        // TODO: expand to two screens
        for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {//Filling 1st screen
            var newRowArr = [];
            for (var colNo=0; colNo<SCENE_TILES_ROW_LEN; colNo++) {
                newRowArr.push(50);
            } 
            this.shadowScreenArray.push(newRowArr);
        }//for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {

        for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {//Filling 1st screen
            var newRowArr2 = [];
            for (var colNo=0; colNo<SCENE_TILES_ROW_LEN; colNo++) {
                newRowArr2.push(42);
            } 
            this.shadowScreenArray.push(newRowArr2);
        }//for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {
        

        console.log("len of rows:", this.shadowScreenArray.length);
        console.log("ROWS:", this.shadowScreenArray);

        

        //Drawing shadow array on texture
        //TODO: expand to two screens 
        for(var rowNo=0; rowNo<SCENE_ROW_NO*2; rowNo++) {
            // console.log("ROW:", rowNo)
            for (var colNo=0; colNo<SCENE_TILES_ROW_LEN; colNo++) {
                console.log("ROW:", rowNo)
                console.log("COL:", colNo)
                console.log(this.shadowScreenArray[rowNo][colNo]);
                this.backgroundDynamicTexture.draw(
                    this.bgTilesArray[this.shadowScreenArray[rowNo][colNo]],
                    colNo*TILE_WIDTH_HEIGHT,
                    rowNo*TILE_WIDTH_HEIGHT
                )
            } 
        }//for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {

        this.backgroundDynamicTexture.draw(
            this.bgTilesArray[50],
            20,
            20
        );

        this.backgroundDynamicTexture.draw(
            this.bgTilesArray[42], 
            100,
            100
        );


        scene.add.image(
            0, 0,
            this.backgroundDynamicTexture
        ).setOrigin(0);

    }//constructor(scene, backgroundTilesetName) {
}//class BGUpdater {