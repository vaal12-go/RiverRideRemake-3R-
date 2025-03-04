class Jet {
  bob = null;
  startY = 0;
  constructor(bob) {
    this.bob = bob;
    this.startY = bob.y;
  }

  update(yDelta) {
    // console.log("Jet updater :>> ", yDelta);
    this.bob.y += yDelta;
    this.bob.x += 1;
  }
} //class Jet {
