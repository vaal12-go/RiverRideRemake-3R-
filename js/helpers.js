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
  return scrArr;
}

function getTileArrayFromTileset(set_texture, tileWidth) {
  var row_len = set_texture.getSourceImage().width / tileWidth;
  var no_rows = set_texture.getSourceImage().height / tileWidth;

  //Populate tiles array
  var tileArr = [];

  var i = 0;
  for (var y = 0; y < no_rows; y++) {
    for (var x = 0; x < row_len; x++) {
      var x_coord = x * tileWidth;
      var y_coord = y * tileWidth;
      tileArr.push(
        set_texture.add(
          "frm_" + i,
          0,
          x * tileWidth,
          y * tileWidth,
          tileWidth,
          tileWidth
        )
      );
      i++;
    } //for (var x = 0; x < row_len; x++) {
  } //for (var y = 0; y < no_rows; y++) {
  return tileArr;
} //getTileArrayFromTileset(set_texture) {

function replaceValuesInArray(oldArray, startPos, ...replacingValues) {
  var newArr = oldArray.slice();

  for (let newVal of replacingValues) {
    newArr[startPos] = newVal;
    startPos++;
  }
  return newArr;
}

function zeroFill(num, len) {
  return (Array(len).join("0") + num).slice(-len);
}
