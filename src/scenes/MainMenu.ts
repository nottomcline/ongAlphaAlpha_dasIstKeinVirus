import { Scene, GameObjects } from "phaser";

export class MainMenu extends Scene {
	background: GameObjects.Image;
	logo: GameObjects.Image;
	title: GameObjects.Text;
	storyText: GameObjects.Text;
	stroyHeadline: GameObjects.Text;

	private keyboardInput: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

	constructor() {
		super("MainMenu");
	}

	create() {
		this.background = this.add.image(512, 384, "background");

		// Story text
		this.stroyHeadline = this.add
			.text(512, 250, "STORy", {
				fontFamily: "Arial Black",
				fontSize: 50,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5);
		this.storyText = this.add
			.text(
				512,
				400,
				"In einer Welt voller hüpfender Bälle sind Sie die letzte Verteidigungslinie. Nur mit deinem treuen Paddel bewaffnet, musst du den unerbittlichen Ball davon abhalten, die letzte Grenze zu überschreiten. Jeder Treffer bringt dich deinem Ruhm näher, aber Vorsicht - verlierst du deine Konzentration, ist das Spiel vorbei. Wirst du dich der Herausforderung stellen oder den Ball vorbeifliegen lassen? Das Schicksal des Spiels liegt in deinen Händen...",
				{
					fontFamily: "Arial",
					fontSize: 24,
					color: "#ffffff",
					align: "center",
					wordWrap: { width: 800 }, // Wrap text for readability
				}
			)
			.setOrigin(0.5);

		// Display story for a few seconds before showing the start prompt
		this.time.delayedCall(1000, () => {
			// After 1 seconds, display the game start prompt
			this.storyText.setText(""); // Clear story text
			this.stroyHeadline.setText(""); // Clear story text
			this.logo = this.add.image(512, 300, "logo");
			this.title = this.add
				.text(
					512,
					460,
					[
						"Drücke die Leer-Taste",
						"(oder klicke/ tippe)",
						"um das Spiel zu starten",
					],
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
		});

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
