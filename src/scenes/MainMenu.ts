import { Scene, GameObjects } from "phaser";

export class MainMenu extends Scene {
	background: GameObjects.Image;
	logo: GameObjects.Image;
	title: GameObjects.Text;

	private keyboardInput: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

	constructor() {
		super("MainMenu");
	}

	create() {
		this.background = this.add.image(512, 384, "background");

		this.logo = this.add.image(512, 300, "logo");

		this.title = this.add
			.text(
				512,
				460,
				["Drücke die Leer-Taste", "um das Spiel zu starten"],
				{
					fontFamily: "Arial Black",
					fontSize: 38,
					color: "#ffffff",
					stroke: "#000000",
					strokeThickness: 8,
					align: "center",
				}
			)
			.setOrigin(0.5);

		// Listen for the spacebar key
		if (this.input.keyboard) {
			this.keyboardInput = this.input.keyboard.createCursorKeys();
		}
		// Check if it's a touch-enabled device and add touch/mouse listeners
		this.input.on("pointerdown", () => {
			this.scene.start("Game");
		});
	}

	update() {
		if (this.keyboardInput?.space.isDown) {
			this.scene.start("Game");
		}
	}
}
