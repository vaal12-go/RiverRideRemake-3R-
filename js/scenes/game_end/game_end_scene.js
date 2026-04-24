export class GameEndScene extends Phaser.Scene {
  gameEndText = null;
  startNewGameText = null;
  preload() {
    this.load.image("bg1", "img/red.png");
    this.load.image("fuel_tank", "img/fuel/Fuel_29Feb2025.png");
    this.load.script(
      "webfont",
      "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js",
    );
  }
  create() {

    const scene = this;


    console.log("Game end create called :>> ");
    this.gameEndText = this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2-70,
        "Game end ",
        {
          font: "84px",
          fontFamily: "Vipnagorgialla",
          fill: "#ff0000",
          color: "#ff0000",
          align: "center",
          fixedWidth: 450,
        },
      )
      .setPadding(12)
      .setOrigin(0.5);

    const button = this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2+50, "New Game", {
        fontFamily: "Vipnagorgialla",
        fontSize: "32px",
        color: "#ffffff",
        align: "center",
        fixedWidth: 300,
        backgroundColor: "#2d2d2d",
      })
      .setPadding(32)
      .setOrigin(0.5);

    button.setInteractive({ useHandCursor: true });

    button.on("pointerover", () => {
      button.setBackgroundColor("#8d8d8d");
    });

    button.on("pointerout", () => {
      button.setBackgroundColor("#2d2d2d");
    });

    button.on("pointerdown", function (pointer) {
      console.log("New game clicked :>> ");
    //   this.scene.stop("game_end");
    //   this.scene.stop("river_raid_game");
      scene.scene.start("river_raid_game");
    });

    // const boundsObj = this.gameEndText.getBounds();
    // this.gameEndText.x = this.game.config.width / 2;
    // this.gameEndText.y = this.game.config.height / 2;
    // this.gameEndText.setInteractive();
    // console.log(
    //   "this.dbgText.eventNames() :>> ",
    //   this.gameEndText.eventNames(),
    // );
    // this.gameEndText.on("pointerdown", function (pointer) {
    //   console.log("object clicked :>> ");
    // });
    // const text = this.make.text(this.gameEndText);

    //  You can get the metrics from a Text object by doing this:

    // console.log(this.gameEndText.getBounds());

    

    // WebFont.load({
    //   google: {
    //     families: ["Audiowide", "Freckle Face", "Finger Paint", "Nosifer"],
    //   },
    //   active: function () {
    //     scene.add
    //       .text(scene.game.config.width / 2, scene.game.config.height / 2, "Game end", {
    //         fontFamily: "Audiowide",
    //         fontSize: 80,
    //         color: "#ff0000",
    //       })
    //       .setShadow(2, 2, "#333333", 2, false, true)
    //       .setOrigin(0.5);

    //     // scene.add.text(
    //     //   250,
    //     //   450,
    //     //   "Waves flung themselves\nat the blue evening.",
    //     //   { fontFamily: "Finger Paint", fontSize: 40, color: "#5656ee" },
    //     // );

    //     // const t = add.text(330, 200, 'R.I.P', { fontFamily: 'Nosifer', fontSize: 150, color: '#ff3434' });

    //     // input.once('pointerdown', () =>
    //     // {
    //     //     t.setFontSize(64);
    //     // });
    //   },
    // });
  }
} //export class RiverRaidScene extends Phaser.Scene {
