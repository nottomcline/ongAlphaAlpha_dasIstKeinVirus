import { Scene } from "phaser";

export class GameOver extends Scene {
	camera: Phaser.Cameras.Scene2D.Camera;
	background: Phaser.GameObjects.Image;
	gameover_text: Phaser.GameObjects.Text;

	private selectedOption: string = "Ja"; // Track selected option
	private points: number | undefined;
	private keyboardInput: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
	private yesText: Phaser.GameObjects.Text | undefined;
	private noText: Phaser.GameObjects.Text | undefined;

	constructor() {
		super("GameOver");
	}

	// Receives the data from the previous scene
	init(data: { points: number }) {
		this.points = data.points;
		this.selectedOption = "Ja"; // reset selected option
	}

	create() {
		this.camera = this.cameras.main;
		this.camera.setBackgroundColor(0xff0000);

		this.background = this.add.image(512, 384, "background");
		this.background.setAlpha(0.5);

		// Listen for the spacebar key
		if (this.input.keyboard) {
			this.keyboardInput = this.input.keyboard.createCursorKeys();
		}

		this.add
			.text(512, 200, "Game Over :c", {
				fontFamily: "Arial Black",
				fontSize: 38,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5);

		this.add
			.text(512, 260, `Punkte: ${this.points}`, {
				fontFamily: "Arial Black",
				fontSize: 38,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5);

		this.add
			.text(512, 420, "Nochmal spielen?", {
				fontFamily: "Arial Black",
				fontSize: 38,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5);

		this.yesText = this.add
			.text(450, 480, "Ja", {
				fontFamily: "Arial Black",
				fontSize: 38,
				color: "#ffff00", // Start with "Yes" highlighted
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5);

		this.noText = this.add
			.text(550, 480, "Nein", {
				fontFamily: "Arial Black",
				fontSize: 38,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5);
	}

	update() {
		// Toggle between "Yes" and "No" options
		if (this.keyboardInput?.left.isDown) {
			this.selectedOption = "Ja";
			this.updateSelection();
		} else if (this.keyboardInput?.right.isDown) {
			this.selectedOption = "Nein";
			this.updateSelection();
		}

		if (this.keyboardInput?.space.isDown) {
			if (this.selectedOption === "Ja") {
				this.scene.start("Game"); // Restart the game
			} else {
				this.scene.start("MainMenu"); // Go to main menu
			}
		}
	}

	// Update the color to indicate the selected option
	private updateSelection() {
		if (this.selectedOption === "Ja") {
			this.yesText?.setColor("#ffff00");
			this.noText?.setColor("#ffffff");
		} else {
			this.yesText?.setColor("#ffffff");
			this.noText?.setColor("#ffff00");
		}
	}
}
