import { Scene } from "phaser";

export class Game extends Scene {
	camera: Phaser.Cameras.Scene2D.Camera;
	background: Phaser.GameObjects.Image;
	private player: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private ball: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private powerUp: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody | null =
		null;
	private dvdLogo: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private keyboardInput: Phaser.Types.Input.Keyboard.CursorKeys;
	private points: number = 0;
	private textScore: Phaser.GameObjects.Text;
	private level: number = 1;
	private experience: number = 0;
	private experienceToLevelUp: number = 2;
	private textLevel: Phaser.GameObjects.Text;
	private obstacles: Phaser.Physics.Arcade.Group;
	private loseAudio: Phaser.Sound.BaseSound;
	private bgAudio: Phaser.Sound.BaseSound;
	private dvdHitSound: Phaser.Sound.BaseSound;
	private geld: number = 100; // Initial geld for the player
	private textGeld: Phaser.GameObjects.Text;
	// @ts-ignore
	private buyPowerUpButton: Phaser.GameObjects.Text;
	// @ts-ignore
	private buyExtraLifeButton: Phaser.GameObjects.Text;
	// @ts-ignore
	private buyPointsButton: Phaser.GameObjects.Text;

	private memeBall: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
	private memeVideos: string[] = [
		"https://www.youtube.com/watch?v=LyRBIeAw8ak",
		"https://www.youtube.com/watch?v=iwQK8YHzzpM",
		"https://www.youtube.com/watch?v=buc64u6Q_oA",
		"https://www.youtube.com/watch?v=ZVllS9y6mBg",
		"https://www.youtube.com/shorts/J-gVpUAVC1U",
	];

	constructor() {
		super("Game");
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

		this.createMemeBall();
		this.createBall();

		this.player = this.physics.add.sprite(
			this.physics.world.bounds.width - (this.ball.body.width / 2 + 1), // x position
			this.physics.world.bounds.height / 2, // y position
			"paddle" // key of image for the sprite
		);

		// DVD Logo initialization (enemy)
		this.dvdLogo = this.physics.add.sprite(
			this.physics.world.bounds.width / 2, // Initial X
			this.physics.world.bounds.height / 2, // Initial Y
			"dvdLogo" // Sprite key
		);
		this.dvdLogo.setVelocity(
			Phaser.Math.Between(100, 200),
			Phaser.Math.Between(100, 200)
		); // Random initial velocity
		this.dvdLogo.setBounce(1, 1); // Make the logo bounce off walls
		this.dvdLogo.setCollideWorldBounds(true); // Keep the logo within the bounds of the screen

		this.obstacles = this.physics.add.group();
		this.loseAudio = this.sound.add("loseSound"); // Assign the audio object
		this.dvdHitSound = this.sound.add("dvdHitSound"); // Assign the audio object
		this.bgAudio = this.sound.add("bgMusic"); // Assign the audio object
		if (!this.bgAudio.isPlaying) {
			this.bgAudio.play();
		}

		// Set up a timed event to spawn obstacles every few seconds
		this.time.addEvent({
			delay: 3000, // Spawn every 3 seconds
			callback: this.spawnObstacle,
			callbackScope: this,
			loop: true,
		});

		if (this.input.keyboard) {
			this.keyboardInput = this.input.keyboard.createCursorKeys();
		}

		// Check if it's a touch-enabled device and add touch/mouse listeners
		this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
			this.player.y = pointer.y;
		});

		this.player.setCollideWorldBounds(true);
		this.player.setImmovable(true);
		this.physics.add.collider(
			this.ball,
			this.player,
			undefined,
			this.ifPlayerGetsHit,
			this
		);

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

		this.textGeld = this.add.text(10, 70, "Geld: 100", {
			fontFamily: "Monaco, Courier, monospace",
			fontSize: "25px",
			color: "#fff",
		});

		this.buyPowerUpButton = this.add
			.text(
				10,
				130,
				"Power-Up mit 50 Geld kaufen? (zum kaufen klicken)",
				{
					fontFamily: "Monaco, Courier, monospace",
					fontSize: "20px",
					color: "#fff",
				}
			)
			.setInteractive()
			.on("pointerdown", this.buyPowerUp, this);

		this.buyExtraLifeButton = this.add
			.text(
				10,
				160,
				"Extra Leben mit 100 Geld kaufen? (zum kaufen klicken)",
				{
					fontFamily: "Monaco, Courier, monospace",
					fontSize: "20px",
					color: "#fff",
				}
			)
			.setInteractive()
			.on("pointerdown", this.buyExtraLife, this);

		this.buyPointsButton = this.add
			.text(
				10,
				190,
				"10 extra Punkte mit 20 Geld kaufen? (zum kaufen klicken)",
				{
					fontFamily: "Monaco, Courier, monospace",
					fontSize: "20px",
					color: "#fff",
				}
			)
			.setInteractive()
			.on("pointerdown", this.buyPoints, this);
	}

	// Function to spawn obstacles
	spawnObstacle() {
		const x = this.randomIntFromInterval(
			50,
			this.physics.world.bounds.width - 50
		);
		const y = this.randomIntFromInterval(
			50,
			this.physics.world.bounds.height - 50
		);

		// Create a new obstacle at a random position
		const obstacle = this.obstacles.create(x, y, "obstacle");
		obstacle.setScale(0.5);
		obstacle.setImmovable(true); // Obstacles should not move when hit by other objects
		obstacle.setCollideWorldBounds(true);

		// Optional horizontal movement for added randomness (if desired)
		this.tweens.add({
			targets: obstacle,
			x: { start: x - 50, to: x + 50 }, // Movement along the X-axis
			duration: 2000,
			yoyo: true,
			repeat: -1,
		});

		this.time.delayedCall(10000, () => {
			// Destroy the obstacle after the specified time
			obstacle.destroy();
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

	buyPowerUp() {
		if (this.geld >= 50) {
			this.geld -= 50;
			this.textGeld.setText(`Geld: ${this.geld}`);
			this.spawnPowerUp();
		} else {
			this.scene.start("Shop");
		}
	}

	// Simulate buying an extra life
	buyExtraLife() {
		if (this.geld >= 100) {
			this.geld -= 100;
			this.textGeld.setText(`Geld: ${this.geld}`);
			this.giveExtraLife();
		} else {
			this.scene.start("Shop");
		}
	}

	// Simulate buying points
	buyPoints() {
		if (this.geld >= 20) {
			this.geld -= 20;
			this.points += 10; // Adding 10 points for 20 geld
			this.textGeld.setText(`Geld: ${this.geld}`);
			this.textScore.setText(`Punkte: ${this.points}`);
		} else {
			this.scene.start("Shop");
		}
	}

	// Simulated extra life logic (e.g., increase player lives)
	giveExtraLife() {
		console.log("Extra Life Granted!");
		// You can add more complex logic to grant an extra life here
	}

	spawnPowerUp() {
		if (this.powerUp) return;

		const x = Phaser.Math.Between(100, 900);
		const y = Phaser.Math.Between(100, 700);
		this.powerUp = this.physics.add.sprite(x, y, "powerUp").setScale(0.75);
		this.physics.add.overlap(
			this.ball,
			this.powerUp,
			this.collectPowerUp,
			undefined,
			this
		);
	}

	openMemeVideo() {
		// Choose a random meme video from the list
		const randomIndex = this.randomIntFromInterval(
			0,
			this.memeVideos.length - 1
		);
		const randomMemeVideo = this.memeVideos[randomIndex];

		// Open the YouTube video in a new tab
		window.open(randomMemeVideo, "_blank");
	}

	spawnMemeBall() {
		// Add a click event to the meme ball sprite to open the meme video
		if (this.memeBall) {
			this.memeBall.setVisible(true);
			this.memeBall.setInteractive();
			this.memeBall.on("pointerdown", this.openMemeVideo, this);
		}
	}

	update() {
		// if ball is behind player game is over
		this.player.body.setVelocityY(0);
		if (this.ball.body.x > this.player.body.x) {
			this.resetGame();
			this.scene.start("GameOver", { points: this.points });
			return;
		}

		if (this.keyboardInput.up.isDown) {
			this.player.body.setVelocityY(-650);
		} else if (this.keyboardInput.down.isDown) {
			this.player.body.setVelocityY(650);
		}

		this.physics.add.collider(
			this.dvdLogo,
			this.player,
			this.onDVDLogoHit,
			undefined,
			this
		);

		// Add collision detection between player and obstacles
		this.physics.add.collider(
			this.player,
			this.obstacles,
			this.hitObstacle,
			undefined,
			this
		);

		this.changeBallVelocityOnBounce();
	}

	onDVDLogoHit() {
		this.points -= 2; // Deduct points when the logo hits the player
		this.textScore.setText(`Punkte: ${this.points}`);

		// Optionally: play a sound effect or trigger some animation
		this.dvdHitSound.play();
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
		this.bgAudio.pause();
		this.ball.disableBody(true, true);
		this.loseAudio.play();
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

		const memeBallSpawnChance = 70;
		const randomMemeBallChance = this.randomIntFromInterval(1, 100);
		if (randomMemeBallChance <= memeBallSpawnChance) {
			this.spawnMemeBall();
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

	createMemeBall() {
		const x = this.randomIntFromInterval(
			100,
			this.physics.world.bounds.width - 100
		);
		const y = this.randomIntFromInterval(
			100,
			this.physics.world.bounds.height - 100
		);
		this.memeBall = this.physics.add.sprite(x, y, "memeBall");
		this.memeBall.setCollideWorldBounds(true);
		this.memeBall.setBounce(1, 1);
		this.memeBall.setVelocity(
			Phaser.Math.Between(-200, 200),
			Phaser.Math.Between(-200, 200)
		);
		this.memeBall.setVisible(false);
	}

	createBall() {
		this.ball = this.physics.add.sprite(
			this.physics.world.bounds.width / 2, // x position
			this.physics.world.bounds.height / 2, // y position
			"ball" // key of image for the sprite
		);
		this.ball.setVisible(true);
		this.ball.setCollideWorldBounds(true);
		this.ball.setBounce(1, 1);
		this.setBallInitialVelocity();
	}
}
