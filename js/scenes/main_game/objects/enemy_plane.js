import {
  DIRECTION_LEFT,
  DIRECTION_RIGHT,
  DIRECTION_UNDEFINED,
} from "../../../constants.js";
import { getRandomInt } from "../../../helpers.js";
export class EnemyPlane {
  initial_x = -100;
  initial_y = -100;
  direction = DIRECTION_UNDEFINED;
  sprite = null;
  scene = null;
  constructor(scene) {
    this.scene = scene;
    const rndInt = getRandomInt(2);
    console.log("enemy_plane:16 rndInt::", rndInt);
    switch(rndInt) {
        case 0:
            this.direction = DIRECTION_LEFT;
            break;
        case 1:
            this.direction = DIRECTION_RIGHT;
            break;
    }
    if(this.direction == DIRECTION_LEFT) {
        this.initial_x = this.scene.game.config.width;
    } else {
        this.initial_x = 0;
    }
    console.log("enemy_plane:28 this.direction::", this.direction);
    this.initial_y = 8;
    this.sprite = this.scene.add.sprite(this.initial_x, this.initial_y, "jet").setOrigin(0.5, 0.5);
  }
}
