import { Scene } from "phaser";

export class Game extends Scene {
	camera: Phaser.Cameras.Scene2D.Camera;
	background: Phaser.GameObjects.Image;
	msg_text: Phaser.GameObjects.Text;
	private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	private points: number = 0;
	private textScore: Phaser.GameObjects.Text;

	constructor(
		player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
		ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody,
		cursors: Phaser.Types.Input.Keyboard.CursorKeys,
		points: number = 0,
		textScore: Phaser.GameObjects.Text
	) {
		super("Game");
		this.player = player;
		this.ball = ball;
		this.cursors = cursors;
		this.points = points;
		this.textScore = textScore;
	}

	// Receives the data from the previous scene
	init() {
		this.points = 0;
	}

	create() {
		this.camera = this.cameras.main;
		this.camera.setBackgroundColor("#181818");

		this.background = this.add.image(512, 384, "background");
		this.background.setAlpha(0.5);

		this.ball = this.physics.add.sprite(
			this.physics.world.bounds.width / 2, // x position
			this.physics.world.bounds.height / 2, // y position
			"ball" // key of image for the sprite
		);
		this.ball.setVisible(true);
		const initialXSpeed = this.randomIntFromInterval(100, 800);
		const initialYSpeed = this.randomIntFromInterval(100, 800);
		this.ball.body.setVelocity(initialXSpeed, initialYSpeed);

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

		// Create score text
		this.textScore = this.add.text(10, 10, "Punkte: 0", {
			fontFamily: "Monaco, Courier, monospace",
			fontSize: "25px",
			color: "#fff",
		});
	}

	update() {
		// if ball is behind player game is over
		if (this.ball.body.x > this.player.body.x) {
			this.ball.disableBody(true, true);
			this.restartGame();
			this.scene.start("GameOver", { points: this.points });
			return;
		}
		this.player.body.setVelocityY(0);

		if (this.cursors.up.isDown) {
			this.player.body.setVelocityY(-650);
		} else if (this.cursors.down.isDown) {
			this.player.body.setVelocityY(650);
		}

		this.changeBallVelocityOnBounce();
	}

	restartGame() {
		// Hide "Ende" text and reset game variables
		this.textScore.setText("Punkte: 0");

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
			const initialXSpeed = this.randomIntFromInterval(100, 800);
			this.ball.setVelocityX(initialXSpeed);
		}

		if (
			this.ball.body.x === this.game.config.width ||
			this.ball.body.x === 0
		) {
			const initialXSpeed = this.randomIntFromInterval(100, 800);
			this.ball.setVelocityX(initialXSpeed);
		}

		if (
			this.ball.body.y === this.game.config.height ||
			this.ball.body.y === 0
		) {
			const initialYSpeed = this.randomIntFromInterval(100, 800);
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
