function getRandomInt(max) {
    //Replace with 
    return Math.floor(Math.random() * max);
}

function fillArray(tileID) {
    var scrArr = [];
    for (var y = 0; y < SCENE_ROW_NO; y++) {
      scrArr.push([]);
      for (var x = 0; x < SCENE_ROW_LEN; x++) {
        //this.main_tile_plate.draw(this.tileArr[tileID], x*32, y*32)
        scrArr[y].push(tileID);
      }
    }
    // console.log("scrArr.length :>> ", scrArr.length);
    // console.log("scrArr :>> ", scrArr);
    return scrArr;
  }

  function getTileArrayFromTileset(set_texture, tileWidth) {
    // this.tls_txture.getSourceImage().width
    console.log('set_texture.getSourceImage().width :>> ', set_texture.getSourceImage().width);
    var row_len = set_texture.getSourceImage().width / tileWidth;
    console.log(" row_len :>> ", row_len);
    var no_rows = set_texture.getSourceImage().height / tileWidth;
    console.log("no_rows :>> ", no_rows);

    //Populate tiles array
    var tileArr = [];

    var i = 0;
    for (var y = 0; y < no_rows; y++) {
      console.log('New line :>> ');
      for (var x = 0; x < row_len; x++) {
        // console.log('i :>> ', i);
        var x_coord = x * tileWidth;
        // console.log('x_coord :>> ', x_coord);
        var y_coord = y * tileWidth;
        // console.log('y_coord :>> ', y_coord);
        tileArr.push(
          set_texture.add("frm_" + i, 0, 
          x * tileWidth, y * tileWidth, tileWidth, tileWidth)
        );
        i++;
      }
    }
    // console.log('tileArr :>> ', tileArr);
    return tileArr

    }//getTileArrayFromTileset(set_texture) {