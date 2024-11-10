import { Scene } from "phaser";

export class Shop extends Scene {
	camera: Phaser.Cameras.Scene2D.Camera;
	background: Phaser.GameObjects.Image;
	shop_text: Phaser.GameObjects.Text;

	private selectedOption: string = "Ja"; // Track selected option
	private keyboardInput: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
	private yes1Text: Phaser.GameObjects.Text | undefined;
	private yes2Text: Phaser.GameObjects.Text | undefined;
	// @ts-ignore
	private buyText: Phaser.GameObjects.Text | undefined;

	private inputField: HTMLInputElement | null = null; // Reference to the HTML input field

	constructor() {
		super("Shop");
	}

	// Receives the data from the previous scene
	init() {
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

		// Create input field for credit card number
		this.createInputField();

		this.add
			.text(512, 200, "Sie haben zu wenig Geld", {
				fontFamily: "Arial Black",
				fontSize: 38,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5);

		this.add
			.text(512, 260, `Geben Sie ihre Kreditkarten Nummer ein:`, {
				fontFamily: "Arial Black",
				fontSize: 38,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5);

		this.buyText = this.add
			.text(750, 360, "jetzt kaufen", {
				fontFamily: "Arial Black",
				fontSize: 38,
				color: "#1337", // Start with "Yes" highlighted
				stroke: "#000000",
				strokeThickness: 8,
			})
			.setOrigin(0.5)
			.setInteractive()
			.on("pointerdown", () => {
				alert("feature in progress");
			});

		this.add
			.text(512, 420, "zurück?", {
				fontFamily: "Arial Black",
				fontSize: 38,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5);

		this.yes1Text = this.add
			.text(450, 480, "Ja", {
				fontFamily: "Arial Black",
				fontSize: 38,
				color: "#ffff00", // Start with "Yes" highlighted
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5)
			.setInteractive()
			.on("pointerdown", () => {
				this.hideInputField();
				this.scene.start("Game"); // Restart the game
			});

		this.yes2Text = this.add
			.text(550, 480, "Ja", {
				fontFamily: "Arial Black",
				fontSize: 38,
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 8,
				align: "center",
			})
			.setOrigin(0.5)
			.setInteractive()
			.on("pointerdown", () => {
				this.hideInputField();
				this.scene.start("Game"); // Restart the game
			});
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

	private createInputField() {
		// Create HTML input element
		this.inputField = document.createElement("input");
		this.inputField.type = "text";
		this.inputField.placeholder = "Kreditkarte Nummer...";
		this.inputField.style.position = "absolute";
		this.inputField.style.left = "30%";
		this.inputField.style.top = "360px"; // Position in the center of the screen
		this.inputField.style.transform = "translateX(-50%)";
		this.inputField.style.fontSize = "30px";
		this.inputField.style.padding = "10px";
		this.inputField.style.color = "black";
		this.inputField.style.border = "2px solid #fff";
		this.inputField.style.borderRadius = "5px";

		document.body.appendChild(this.inputField);

		// Focus the input field on scene start
		this.inputField.focus();
	}

	// Function to hide input field when done
	private hideInputField() {
		if (this.inputField) {
			this.inputField.style.display = "none"; // Hide the input field
		}
	}

	// Update the color to indicate the selected option
	private updateSelection() {
		if (this.selectedOption === "Ja") {
			this.yes1Text?.setColor("#ffff00");
			this.yes2Text?.setColor("#ffffff");
		} else {
			this.yes1Text?.setColor("#ffffff");
			this.yes2Text?.setColor("#ffff00");
		}
	}
}
