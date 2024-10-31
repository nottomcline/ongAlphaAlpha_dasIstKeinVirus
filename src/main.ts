import "./style.css";
import Phaser from "phaser";

class GameScene extends Phaser.Scene {
	private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	private gameStarted: boolean = false;
	private openingText: Phaser.GameObjects.Text;
	private gameOverText: Phaser.GameObjects.Text;
	private points: number = 0;
	private textScore: Phaser.GameObjects.Text;

	constructor(
		player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
		ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
		cursors: Phaser.Types.Input.Keyboard.CursorKeys,
		gameStarted: boolean = false,
		openingText: Phaser.GameObjects.Text,
		gameOverText: Phaser.GameObjects.Text,
		points: number = 0,
		textScore: Phaser.GameObjects.Text
	) {
		super("GameScene");

		this.player = player;
		this.ball = ball;
		this.cursors = cursors;
		this.gameStarted = gameStarted;
		this.openingText = openingText;
		this.gameOverText = gameOverText;
		this.points = points;
		this.textScore = textScore;
	}

	preload() {
		this.load.image("ball", "../assets/ball.png");
		this.load.image("paddle", "../assets/paddle.png");
	}

	create() {
		this.ball = this.physics.add.sprite(
			this.physics.world.bounds.width / 2, // x position
			this.physics.world.bounds.height / 2, // y position
			"ball" // key of image for the sprite
		);
		this.ball.setVisible(false);

		this.player = this.physics.add.sprite(
			this.physics.world.bounds.width - (this.ball.body.width / 2 + 1), // x position
			this.physics.world.bounds.height / 2, // y position
			"paddle" // key of image for the sprite
		);

		if (this.input.keyboard) {
			this.cursors = this.input.keyboard.createCursorKeys();
		}

		this.player.setCollideWorldBounds(true);
		this.ball.setCollideWorldBounds(true);
		this.ball.setBounce(1, 1);
		this.player.setImmovable(true);
		this.physics.add.collider(
			this.ball,
			this.player,
			undefined,
			this.ifPlayerGetsHit,
			this
		);

		this.openingText = this.add
			.text(
				this.physics.world.bounds.width / 2,
				this.physics.world.bounds.height / 2,
				"Drücke die Leer-Taste um zu Starten",
				{
					fontFamily: "Monaco, Courier, monospace",
					fontSize: "25px",
					color: "#fff",
				}
			)
			.setOrigin(0.5);

		// Create player lose text
		this.gameOverText = this.add
			.text(
				this.physics.world.bounds.width / 2,
				this.physics.world.bounds.height / 2,
				"Ende",
				{
					fontFamily: "Monaco, Courier, monospace",
					fontSize: "25px",
					color: "#fff",
				}
			)
			.setOrigin(0.5);

		// Create score text
		this.textScore = this.add.text(10, 10, "Punkte: 0", {
			fontFamily: "Monaco, Courier, monospace",
			fontSize: "25px",
			color: "#fff",
		});

		// Make it invisible until the player loses
		this.gameOverText.setVisible(false);
	}

	update() {
		// if ball is behind player game is over
		if (this.ball.body.x > this.player.body.x) {
			this.gameOverText.setVisible(true);
			this.ball.disableBody(true, true);

			if (this.cursors.space.isDown) {
				this.restartGame();
			}
			return;
		}
		this.player.body.setVelocityY(0);

		if (this.cursors.up.isDown) {
			this.player.body.setVelocityY(-650);
		} else if (this.cursors.down.isDown) {
			this.player.body.setVelocityY(650);
		}

		this.changeBallVelocityOnBounce();

		if (!this.gameStarted) {
			if (this.cursors.space.isDown) {
				this.ball.setVisible(true);
				this.gameStarted = true;
				const initialXSpeed = this.randomIntFromInterval(100, 800);
				const initialYSpeed = this.randomIntFromInterval(100, 800);
				this.ball.body.setVelocity(initialXSpeed, initialYSpeed);
				this.openingText.setVisible(false);
			}
		}
	}

	restartGame() {
		// Hide "Ende" text and reset game variables
		this.gameOverText.setVisible(false);
		this.points = 0;
		this.textScore.setText("Punkte: 0");
		this.gameStarted = false;

		// Reset ball position and hide it
		this.ball.enableBody(
			true,
			this.physics.world.bounds.width / 2,
			this.physics.world.bounds.height / 2,
			true,
			true
		);
		this.ball.setVelocity(0, 0); // Stop any previous movement
		this.ball.setVisible(false); // Wait until game is started to make it visible

		// Reset player position
		this.player.body.reset(
			this.physics.world.bounds.width - (this.ball.body.width / 2 + 1),
			this.physics.world.bounds.height / 2
		);
	}

	changeBallVelocityOnBounce() {
		if (this.ball.body.x === this.player.body.x) {
			const initialXSpeed = this.randomIntFromInterval(400, 600);
			this.ball.setVelocityX(initialXSpeed);
		}

		if (this.ball.body.x === sizes.width || this.ball.body.x === 0) {
			const initialXSpeed = this.randomIntFromInterval(400, 600);
			this.ball.setVelocityX(initialXSpeed);
		}

		if (this.ball.body.y === sizes.height || this.ball.body.y === 0) {
			const initialYSpeed = this.randomIntFromInterval(400, 600);
			this.ball.setVelocityY(initialYSpeed);
		}
	}

	randomIntFromInterval(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	}

	ifPlayerGetsHit() {
		this.points++;
		this.textScore.setText(`Punkte: ${this.points}`);
	}
}

const sizes = {
	width: 800,
	height: 640,
};

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	scale: {
		mode: Phaser.Scale.FIT,
		parent: document.getElementById("gameCanvas") as HTMLCanvasElement,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: sizes.width,
		height: sizes.height,
	},
	physics: {
		default: "arcade",
		arcade: {
			gravity: { x: 0, y: 0 },
		},
	},
	scene: [GameScene],
};

new Phaser.Game(config);
