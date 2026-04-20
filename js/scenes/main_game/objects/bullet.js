
export class Bullet {
    scene = null;
    x = -10;
    y = -10;
    initial_y = -10;
    sprite = null;
    IMG_RESOURCE = 'bullet';
    constructor(scene, x, y) {
        this.scene = scene;
        this.initial_y = y;
        this.sprite = this.scene.add.sprite(
            x, y, this.IMG_RESOURCE
        );
    }

    update(cameraYPos) {
        // console.log("bullet:18 this.initial_y-(32-cameraYPos)::", this.initial_y - (32-cameraYPos));
        if(cameraYPos == 0)
            this.sprite.y = this.initial_y
        else
            this.sprite.y = this.initial_y - (32-cameraYPos);

    }
}