
export class Bullet {
    scene = null;
    x = -10;
    y = -10;
    initial_y = -10;
    sprite = null;
    IMG_RESOURCE = 'bullet';

    current_bullet_y_offset = 0;
    constructor(scene, x, y) {
        this.scene = scene;
        this.initial_y = y;
        this.sprite = this.scene.add.sprite(
            x, y, this.IMG_RESOURCE
        );
    }

    update(cameraYPos) {
        // console.log("bullet:18 this.initial_y-(32-cameraYPos)::", this.initial_y - (32-cameraYPos));
        this.current_bullet_y_offset += 4;
        if(cameraYPos == 0)
            this.sprite.y = this.initial_y-this.current_bullet_y_offset
        else
            this.sprite.y = this.initial_y - (32-cameraYPos)-this.current_bullet_y_offset;
        // console.log("bullet:26 this.sprite.y::", this.sprite.y);
        if(this.sprite.y < -32) {
            // console.log('Bullet to be removed :>> ');
            this.sprite.destroy();
            return true;
        }
    }

    // destroy() {
    //     this.sprite.destroy();
    // }
}