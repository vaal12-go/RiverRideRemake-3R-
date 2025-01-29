

class BGUpdater {
    backgroundDynamicTexture = null;
    bgTileSetName = "";
    bgTileSetTexture = null;
    bgTilesArray = null;

    shadowScreenArray = [];//This will hold tile numbers (2 screens)

    scene = null;
    

    constructor(scene, backgroundTilesetName) {
        this.scene = scene

        this.backgroundDynamicTexture = this.scene.textures.addDynamicTexture(
            "BGUpdater_backgroundDynamicTexture",
            this.scene.game.config.width,
            this.scene.game.config.height * 2
          );

        this.bgTileSetName = backgroundTilesetName;
        this.bgTileSetTexture = this.scene.textures.get(this.bgTileSetName);
        this.bgTilesArray = getTileArrayFromTileset(this.bgTileSetTexture, TILE_WIDTH_HEIGHT);

        const startingMap = this.scene.make.tilemap({ key: "startingMap", tileWidth: 32, tileHeight: 32 });

        for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {//Filling 1st screen
            var newRowArr2 = [];
            for (var colNo=0; colNo<SCENE_TILES_ROW_LEN; colNo++) {
                newRowArr2.push(42);
            } 
            this.shadowScreenArray.push(newRowArr2);
        }//for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {

        // console.log('startingMap :>> ', startingMap);
        // console.log('startingMap2.layer.data[0][0] :>> ', startingMap.layer.data[0][0].index);
        //Filling the shadow array from start tilemap
        // TODO: expand to two screens
        // console.log('SCENE_ROW_NO :>> ', SCENE_ROW_NO);
        for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {//Filling 1st screen
            var newRowArr = [];
            for (var colNo=0; colNo<SCENE_TILES_ROW_LEN; colNo++) {
                // console.log('rowNo :>> ', rowNo);
                // console.log('colNo :>> ', colNo);
                // console.log('object :>> ', startingMap.layer.data[rowNo][colNo].index);
                newRowArr.push(
                    startingMap.layer.data[rowNo][colNo].index
                );
            } 
            this.shadowScreenArray.push(newRowArr);
        }//for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {

        
        

        //Drawing shadow array on texture
        //TODO: expand to two screens 
        for(var rowNo=0; rowNo<SCENE_ROW_NO*2; rowNo++) {
            // console.log("ROW:", rowNo)
            for (var colNo=0; colNo<SCENE_TILES_ROW_LEN; colNo++) {
                // console.log("ROW:", rowNo)
                // console.log("COL:", colNo)
                console.log(this.shadowScreenArray[rowNo][colNo]);
                this.backgroundDynamicTexture.draw(
                    this.bgTilesArray[this.shadowScreenArray[rowNo][colNo]],
                    colNo*TILE_WIDTH_HEIGHT,
                    rowNo*TILE_WIDTH_HEIGHT
                )
            } 
        }//for(var rowNo=0; rowNo<SCENE_ROW_NO; rowNo++) {

        // this.backgroundDynamicTexture.draw(
        //     this.bgTilesArray[50],
        //     20,
        //     20
        // );

        // this.backgroundDynamicTexture.draw(
        //     this.bgTilesArray[42], 
        //     100,
        //     100
        // );


        scene.add.image(
            0, 0,
            this.backgroundDynamicTexture
        ).setOrigin(0);

    }//constructor(scene, backgroundTilesetName) {
}//class BGUpdater {