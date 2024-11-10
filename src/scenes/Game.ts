import { Scene } from "phaser";

export class Game extends Scene {
	camera: Phaser.Cameras.Scene2D.Camera;
	background: Phaser.GameObjects.Image;
	private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private keyboardInput: Phaser.Types.Input.Keyboard.CursorKeys;
	private powerUp: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null =
		null;
	private points: number = 0;
	private textScore: Phaser.GameObjects.Text;
	private level: number = 1;
	private experience: number = 0;
	private experienceToLevelUp: number = 2;
	private textLevel: Phaser.GameObjects.Text;
	private obstacles: Phaser.Physics.Arcade.Group;
	private loseAudio: Phaser.Sound.BaseSound; // Declare the audio

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
		this.keyboardInput = cursors;
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
		this.setBallInitialVelocity();

		this.player = this.physics.add.sprite(
			this.physics.world.bounds.width - (this.ball.body.width / 2 + 1), // x position
			this.physics.world.bounds.height / 2, // y position
			"paddle" // key of image for the sprite
		);

		this.obstacles = this.physics.add.group();
		this.loseAudio = this.sound.add("loseSound"); // Assign the audio object

		// Set up a timed event to spawn obstacles every few seconds
		this.time.addEvent({
			delay: 3000, // Spawn every 3 seconds
			callback: this.spawnObstacle,
			callbackScope: this,
			loop: true,
		});

		// Add collision detection between player and obstacles
		this.physics.add.collider(
			this.player,
			this.obstacles,
			this.hitObstacle,
			undefined,
			this
		);

		if (this.input.keyboard) {
			this.keyboardInput = this.input.keyboard.createCursorKeys();
		}

		// Check if it's a touch-enabled device and add touch/mouse listeners
		this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
			this.player.y = pointer.y;
		});

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

		this.textLevel = this.add.text(10, 40, "Level: 1", {
			fontFamily: "Monaco, Courier, monospace",
			fontSize: "25px",
			color: "#fff",
		});
	}

	// Function to spawn obstacles
	spawnObstacle() {
		const x = Phaser.Math.Between(50, this.physics.world.bounds.width - 50);
		const y = Phaser.Math.Between(
			50,
			this.physics.world.bounds.height - 50
		);

		// Create a new obstacle at a random position
		const obstacle = this.obstacles.create(x, y, "obstacleImage");
		obstacle.setImmovable(true); // Obstacles should not move when hit by other objects
		obstacle.setCollideWorldBounds(true);

		// Optionally add movement (e.g., vertical oscillation)
		this.tweens.add({
			targets: obstacle,
			y: { start: y - 50, to: y + 50 },
			duration: 2000,
			yoyo: true,
			repeat: -1,
		});
	}

	hitObstacle() {
		// Reduce points as a penalty
		this.points = Math.max(this.points - 5, 0); // Ensure points don’t go negative
		this.textScore.setText(`Punkte: ${this.points}`);

		// Apply a temporary effect (e.g., reduce paddle size)
		this.player.setScale(0.5);
		this.time.delayedCall(3000, () => this.player.setScale(1), [], this); // Reset after 3 seconds
	}

	spawnPowerUp() {
		if (this.powerUp) return;

		const x = Phaser.Math.Between(100, 900);
		const y = Phaser.Math.Between(100, 700);
		this.powerUp = this.physics.add.sprite(x, y, "powerUp").setScale(0.5);
		this.physics.add.overlap(
			this.ball,
			this.powerUp,
			this.collectPowerUp,
			undefined,
			this
		);
	}

	update() {
		// if ball is behind player game is over
		if (this.ball.body.x > this.player.body.x) {
			this.loseAudio.play();
			this.ball.disableBody(true, true);
			this.resetGame();
			this.scene.start("GameOver", { points: this.points });
			return;
		}
		this.player.body.setVelocityY(0);

		if (this.keyboardInput.up.isDown) {
			this.player.body.setVelocityY(-650);
		} else if (this.keyboardInput.down.isDown) {
			this.player.body.setVelocityY(650);
		}

		this.changeBallVelocityOnBounce();
	}

	collectPowerUp() {
		if (!this.powerUp) return;

		this.powerUp.destroy();
		this.powerUp = null;

		// Choose a random effect for the power-up
		const effects = ["increaseSize", "slowBall", "extraPoints"];
		const effect = Phaser.Utils.Array.GetRandom(effects);

		switch (effect) {
			case "increaseSize":
				this.player.setScale(1.5);
				this.time.delayedCall(
					5000,
					() => this.player.setScale(1),
					[],
					this
				);
				break;
			case "slowBall":
				this.ball.setVelocity(
					this.ball.body.velocity.x * 0.5,
					this.ball.body.velocity.y * 0.5
				);
				this.time.delayedCall(
					5000,
					this.setBallInitialVelocity,
					[],
					this
				);
				break;
			case "extraPoints":
				this.points += 5;
				this.textScore.setText(`Punkte: ${this.points}`);
				break;
		}
	}

	resetGame() {
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
		this.experience++;
		this.textScore.setText(`Punkte: ${this.points}`);

		// Check if the player has gained enough experience to level up
		if (this.experience >= this.experienceToLevelUp) {
			this.levelUp();
		}

		const spawnChance = 50; // percentage chance
		const randomNumber = this.randomIntFromInterval(1, 100);
		if (randomNumber <= spawnChance) {
			this.spawnPowerUp();
		}
	}

	levelUp() {
		this.level++;
		this.experience = 0; // Reset experience for the new level
		this.experienceToLevelUp += 2; // Increase experience required for next level
		this.textLevel.setText(`Level: ${this.level}`);

		// Increase ball speed by 20% each level
		const currentVelocityX = this.ball.body.velocity.x;
		const currentVelocityY = this.ball.body.velocity.y;
		this.ball.setVelocity(currentVelocityX * 1.2, currentVelocityY * 1.2);
	}

	setBallInitialVelocity() {
		const initialXSpeed = this.randomIntFromInterval(100, 800);
		const initialYSpeed = this.randomIntFromInterval(100, 800);
		this.ball.setVelocity(initialXSpeed, initialYSpeed);
	}
}
