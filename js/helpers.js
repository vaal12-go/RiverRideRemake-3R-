function getRandomInt(max) {
  //Generates random integer number from zero to (max-1)
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

function addTextToScene(scene, str, x, y, color = "#aaaaaa") {
  return scene.add
    .text(x, y, str, {
      font: "14px Arial Narrow",
      fill: color,
    })
    .setOrigin(0);
  dbgText.setText([`#${i}`]);
}

//This to be reworked with bobs (maybe?). Now usual text rendering will be used.
function drawNumber(number) {
  var num = number;
  var currDivider = 10;
  var digitArr = [];

  while (num > 0.01) {
    digitArr.push(num % currDivider);
    num = Math.floor(num / 10);
  }

  while (digitArr.length < 5) {
    digitArr.push(0);
  }

  digitArr.reverse();

  var i = 0;
  for (var digit in digitArr) {
    this.fixed_plate.draw(
      this.towerDefenceTileArray[276 + digitArr[digit]],
      this.game.config.width - 200 + i * 32,
      this.game.config.height - 100
    );
    i++;
  }
  this.fixed_plate.draw(this.towerDefenceTileArray[278], 250, 250);

  // console.log('digitArr :>> ', digitArr);
} //END drawNumber(number) {
