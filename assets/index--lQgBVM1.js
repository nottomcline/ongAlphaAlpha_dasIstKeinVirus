var t=Object.defineProperty,e=(e,i,s)=>((e,i,s)=>i in e?t(e,i,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[i]=s)(e,"symbol"!=typeof i?i+"":i,s);import{p as i}from"./phaser-CrGWs1g-.js";!function(){const t=document.createElement("link").relList;if(!(t&&t.supports&&t.supports("modulepreload"))){for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver((t=>{for(const i of t)if("childList"===i.type)for(const t of i.addedNodes)"LINK"===t.tagName&&"modulepreload"===t.rel&&e(t)})).observe(document,{childList:!0,subtree:!0})}function e(t){if(t.ep)return;t.ep=!0;const e=function(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),"use-credentials"===t.crossOrigin?e.credentials="include":"anonymous"===t.crossOrigin?e.credentials="omit":e.credentials="same-origin",e}(t);fetch(t.href,e)}}();class s extends i.Scene{constructor(){super("Boot")}preload(){this.load.image("background","assets/bg.png")}create(){this.scene.start("Preloader")}}class o extends i.Scene{constructor(){super("Game"),e(this,"camera"),e(this,"background"),e(this,"player"),e(this,"ball"),e(this,"powerUp",null),e(this,"dvdLogo"),e(this,"keyboardInput"),e(this,"textScore"),e(this,"textLevel"),e(this,"obstacles"),e(this,"loseAudio"),e(this,"bgAudio"),e(this,"dvdHitSound"),e(this,"textGeld"),e(this,"buyPowerUpButton"),e(this,"buyExtraLifeButton"),e(this,"buyPointsButton"),e(this,"points",0),e(this,"level",1),e(this,"experience",0),e(this,"experienceToLevelUp",2),e(this,"geld",100),e(this,"isCollisionHit",!1),e(this,"memeBall"),e(this,"memeVideos",["https://www.youtube.com/watch?v=LyRBIeAw8ak","https://www.youtube.com/watch?v=iwQK8YHzzpM","https://www.youtube.com/watch?v=buc64u6Q_oA","https://www.youtube.com/watch?v=ZVllS9y6mBg","https://www.youtube.com/shorts/J-gVpUAVC1U"])}init(){this.points=0}create(){this.camera=this.cameras.main,this.camera.setBackgroundColor("#181818"),this.background=this.add.image(512,384,"background"),this.background.setAlpha(.5),this.createMemeBall(),this.createBall(),this.player=this.physics.add.sprite(this.physics.world.bounds.width-(this.ball.body.width/2+1),this.physics.world.bounds.height/2,"paddle"),this.dvdLogo=this.physics.add.sprite(this.physics.world.bounds.width/2,this.physics.world.bounds.height/2,"dvdLogo"),this.dvdLogo.setVelocity(Phaser.Math.Between(100,200),Phaser.Math.Between(100,200)),this.dvdLogo.setBounce(1,1),this.dvdLogo.setCollideWorldBounds(!0),this.obstacles=this.physics.add.group(),this.loseAudio=this.sound.add("loseSound"),this.dvdHitSound=this.sound.add("dvdHitSound"),this.bgAudio=this.sound.add("bgMusic"),this.bgAudio.isPlaying||this.bgAudio.play(),this.time.addEvent({delay:3e3,callback:this.spawnObstacle,callbackScope:this,loop:!0}),this.input.keyboard&&(this.keyboardInput=this.input.keyboard.createCursorKeys()),this.input.on("pointermove",(t=>{this.player.y=t.y})),this.player.setCollideWorldBounds(!0),this.player.setImmovable(!0),this.physics.add.collider(this.ball,this.player,void 0,this.ifPlayerGetsHit,this),this.textScore=this.add.text(10,10,"Punkte: 0",{fontFamily:"Monaco, Courier, monospace",fontSize:"25px",color:"#fff"}),this.textLevel=this.add.text(10,40,"Level: 1",{fontFamily:"Monaco, Courier, monospace",fontSize:"25px",color:"#fff"}),this.textGeld=this.add.text(10,70,"Geld: 100",{fontFamily:"Monaco, Courier, monospace",fontSize:"25px",color:"#fff"}),this.buyPowerUpButton=this.add.text(10,130,"Power-Up mit 50 Geld kaufen? (zum kaufen klicken)",{fontFamily:"Monaco, Courier, monospace",fontSize:"20px",color:"#fff"}).setInteractive().on("pointerdown",this.buyPowerUp,this),this.buyExtraLifeButton=this.add.text(10,160,"Extra Leben mit 100 Geld kaufen? (zum kaufen klicken)",{fontFamily:"Monaco, Courier, monospace",fontSize:"20px",color:"#fff"}).setInteractive().on("pointerdown",this.buyExtraLife,this),this.buyPointsButton=this.add.text(10,190,"10 extra Punkte mit 20 Geld kaufen? (zum kaufen klicken)",{fontFamily:"Monaco, Courier, monospace",fontSize:"20px",color:"#fff"}).setInteractive().on("pointerdown",this.buyPoints,this)}spawnObstacle(){const t=this.randomIntFromInterval(50,this.physics.world.bounds.width-50),e=this.randomIntFromInterval(50,this.physics.world.bounds.height-50),i=this.obstacles.create(t,e,"obstacle");i.setScale(.5),i.setImmovable(!0),i.setCollideWorldBounds(!0),this.tweens.add({targets:i,x:{start:t-50,to:t+50},duration:2e3,yoyo:!0,repeat:-1}),this.time.delayedCall(1e4,(()=>{i.destroy()}))}hitObstacle(){this.isCollisionHit||(this.points=Math.max(this.points-5,0),this.textScore.setText(`Punkte: ${this.points}`),this.player.setScale(.5),this.time.delayedCall(3e3,(()=>this.player.setScale(1)),[],this),this.isCollisionHit=!0,this.time.delayedCall(3e3,(()=>{this.isCollisionHit=!1}),[],this))}buyPowerUp(){this.geld>=50?(this.geld-=50,this.textGeld.setText(`Geld: ${this.geld}`),this.spawnPowerUp()):this.scene.start("Shop")}buyExtraLife(){this.geld>=100?(this.geld-=100,this.textGeld.setText(`Geld: ${this.geld}`),this.giveExtraLife()):this.scene.start("Shop")}buyPoints(){this.geld>=20?(this.geld-=20,this.points+=10,this.textGeld.setText(`Geld: ${this.geld}`),this.textScore.setText(`Punkte: ${this.points}`)):this.scene.start("Shop")}giveExtraLife(){console.log("Extra Life Granted!")}spawnPowerUp(){if(this.powerUp)return;const t=Phaser.Math.Between(100,900),e=Phaser.Math.Between(100,700);this.powerUp=this.physics.add.sprite(t,e,"powerUp").setScale(.75),this.physics.add.overlap(this.ball,this.powerUp,this.collectPowerUp,void 0,this)}openMemeVideo(){const t=this.randomIntFromInterval(0,this.memeVideos.length-1),e=this.memeVideos[t];window.open(e,"_blank")}spawnMemeBall(){this.memeBall&&(this.memeBall.setVisible(!0),this.memeBall.setInteractive(),this.memeBall.on("pointerdown",this.openMemeVideo,this))}update(){if(this.player.body.setVelocityY(0),this.ball.body.x>this.player.body.x)return this.resetGame(),void this.scene.start("GameOver",{points:this.points});this.keyboardInput.up.isDown?this.player.body.setVelocityY(-650):this.keyboardInput.down.isDown&&this.player.body.setVelocityY(650),this.physics.add.collider(this.dvdLogo,this.player,this.onDVDLogoHit,void 0,this),this.physics.add.collider(this.player,this.obstacles,this.hitObstacle,void 0,this),this.changeBallVelocityOnBounce()}onDVDLogoHit(){this.points-=2,this.textScore.setText(`Punkte: ${this.points}`),this.dvdHitSound.play()}collectPowerUp(){if(this.powerUp)switch(this.powerUp.destroy(),this.powerUp=null,Phaser.Utils.Array.GetRandom(["increaseSize","slowBall","extraPoints"])){case"increaseSize":this.player.setScale(1.5),this.time.delayedCall(5e3,(()=>this.player.setScale(1)),[],this);break;case"slowBall":this.ball.setVelocity(.5*this.ball.body.velocity.x,.5*this.ball.body.velocity.y),this.time.delayedCall(5e3,this.setBallInitialVelocity,[],this);break;case"extraPoints":this.points+=5,this.textScore.setText(`Punkte: ${this.points}`)}}resetGame(){this.bgAudio.pause(),this.ball.disableBody(!0,!0),this.loseAudio.play(),this.textScore.setText("Punkte: 0"),this.ball.enableBody(!0,this.physics.world.bounds.width/2,this.physics.world.bounds.height/2,!0,!0),this.ball.setVelocity(0,0),this.ball.setVisible(!1),this.player.body.reset(this.physics.world.bounds.width-(this.ball.body.width/2+1),this.physics.world.bounds.height/2)}changeBallVelocityOnBounce(){if(this.ball.body.x===this.player.body.x){const t=this.randomIntFromInterval(100,800);this.ball.setVelocityX(t)}if(this.ball.body.x===this.game.config.width||0===this.ball.body.x){const t=this.randomIntFromInterval(100,800);this.ball.setVelocityX(t)}if(this.ball.body.y===this.game.config.height||0===this.ball.body.y){const t=this.randomIntFromInterval(100,800);this.ball.setVelocityY(t)}}randomIntFromInterval(t,e){return Math.floor(Math.random()*(e-t+1)+t)}ifPlayerGetsHit(){this.points++,this.experience++,this.textScore.setText(`Punkte: ${this.points}`),this.experience>=this.experienceToLevelUp&&this.levelUp(),this.randomIntFromInterval(1,100)<=50&&this.spawnPowerUp(),this.randomIntFromInterval(1,100)<=70&&this.spawnMemeBall()}levelUp(){this.level++,this.experience=0,this.experienceToLevelUp+=2,this.textLevel.setText(`Level: ${this.level}`);const t=this.ball.body.velocity.x,e=this.ball.body.velocity.y;this.ball.setVelocity(1.2*t,1.2*e)}setBallInitialVelocity(){const t=this.randomIntFromInterval(100,800),e=this.randomIntFromInterval(100,800);this.ball.setVelocity(t,e)}createMemeBall(){const t=this.randomIntFromInterval(100,this.physics.world.bounds.width-100),e=this.randomIntFromInterval(100,this.physics.world.bounds.height-100);this.memeBall=this.physics.add.sprite(t,e,"memeBall"),this.memeBall.setCollideWorldBounds(!0),this.memeBall.setBounce(1,1),this.memeBall.setVelocity(Phaser.Math.Between(-200,200),Phaser.Math.Between(-200,200)),this.memeBall.setVisible(!1)}createBall(){this.ball=this.physics.add.sprite(this.physics.world.bounds.width/2,this.physics.world.bounds.height/2,"ball"),this.ball.setVisible(!0),this.ball.setCollideWorldBounds(!0),this.ball.setBounce(1,1),this.setBallInitialVelocity()}}class l extends i.Scene{constructor(){super("Shop"),e(this,"camera"),e(this,"background"),e(this,"shop_text"),e(this,"selectedOption","Ja"),e(this,"keyboardInput"),e(this,"yes1Text"),e(this,"yes2Text"),e(this,"buyText"),e(this,"inputField",null)}init(){this.selectedOption="Ja"}create(){this.camera=this.cameras.main,this.camera.setBackgroundColor(16711680),this.background=this.add.image(512,384,"background"),this.background.setAlpha(.5),this.input.keyboard&&(this.keyboardInput=this.input.keyboard.createCursorKeys()),this.createInputField(),this.add.text(512,200,"Sie haben zu wenig Geld",{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.add.text(512,260,"Geben Sie ihre Kreditkarten Nummer ein:",{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.buyText=this.add.text(750,360,"jetzt kaufen",{fontFamily:"Arial Black",fontSize:38,color:"#1337",stroke:"#000000",strokeThickness:8}).setOrigin(.5).setInteractive().on("pointerdown",(()=>{alert("feature in progress")})),this.add.text(512,520,"zurück?",{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.yes1Text=this.add.text(450,580,"Ja",{fontFamily:"Arial Black",fontSize:38,color:"#ffff00",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5).setInteractive().on("pointerdown",(()=>{this.hideInputField(),this.scene.start("Game")})),this.yes2Text=this.add.text(550,580,"Ja",{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5).setInteractive().on("pointerdown",(()=>{this.hideInputField(),this.scene.start("Game")}))}update(){var t,e,i;(null==(t=this.keyboardInput)?void 0:t.left.isDown)?(this.selectedOption="Ja",this.updateSelection()):(null==(e=this.keyboardInput)?void 0:e.right.isDown)&&(this.selectedOption="Nein",this.updateSelection()),(null==(i=this.keyboardInput)?void 0:i.space.isDown)&&("Ja"===this.selectedOption?this.scene.start("Game"):this.scene.start("MainMenu"))}createInputField(){this.inputField=document.createElement("input"),this.inputField.type="text",this.inputField.placeholder="Kreditkarte Nummer...",this.inputField.style.position="absolute",this.inputField.style.left="50%",this.inputField.style.top="50%",this.inputField.style.transform="translateX(-50%)",this.inputField.style.fontSize="30px",this.inputField.style.padding="10px",this.inputField.style.color="black",this.inputField.style.border="2px solid #fff",this.inputField.style.borderRadius="5px",document.body.appendChild(this.inputField),this.inputField.focus()}hideInputField(){this.inputField&&(this.inputField.style.display="none")}updateSelection(){var t,e,i,s;"Ja"===this.selectedOption?(null==(t=this.yes1Text)||t.setColor("#ffff00"),null==(e=this.yes2Text)||e.setColor("#ffffff")):(null==(i=this.yes1Text)||i.setColor("#ffffff"),null==(s=this.yes2Text)||s.setColor("#ffff00"))}}class a extends i.Scene{constructor(){super("GameOver"),e(this,"camera"),e(this,"background"),e(this,"gameover_text"),e(this,"selectedOption","Ja"),e(this,"points"),e(this,"keyboardInput"),e(this,"yesText"),e(this,"noText")}init(t){this.points=t.points,this.selectedOption="Ja"}create(){this.camera=this.cameras.main,this.camera.setBackgroundColor(16711680),this.background=this.add.image(512,384,"background"),this.background.setAlpha(.5),this.input.keyboard&&(this.keyboardInput=this.input.keyboard.createCursorKeys()),this.add.text(512,200,"Game Over :c",{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.add.text(512,260,`Punkte: ${this.points}`,{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.add.text(512,420,"Nochmal spielen?",{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.yesText=this.add.text(450,480,"Ja",{fontFamily:"Arial Black",fontSize:38,color:"#ffff00",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5).setInteractive().on("pointerdown",(()=>{this.scene.start("Game")})),this.noText=this.add.text(550,480,"Nein",{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5).setInteractive().on("pointerdown",(()=>{this.scene.start("MainMenu")}))}update(){var t,e,i;(null==(t=this.keyboardInput)?void 0:t.left.isDown)?(this.selectedOption="Ja",this.updateSelection()):(null==(e=this.keyboardInput)?void 0:e.right.isDown)&&(this.selectedOption="Nein",this.updateSelection()),(null==(i=this.keyboardInput)?void 0:i.space.isDown)&&("Ja"===this.selectedOption?this.scene.start("Game"):this.scene.start("MainMenu"))}updateSelection(){var t,e,i,s;"Ja"===this.selectedOption?(null==(t=this.yesText)||t.setColor("#ffff00"),null==(e=this.noText)||e.setColor("#ffffff")):(null==(i=this.yesText)||i.setColor("#ffffff"),null==(s=this.noText)||s.setColor("#ffff00"))}}class n extends i.Scene{constructor(){super("MainMenu"),e(this,"background"),e(this,"logo"),e(this,"title"),e(this,"storyText"),e(this,"stroyHeadline"),e(this,"keyboardInput")}create(){this.background=this.add.image(512,384,"background"),this.stroyHeadline=this.add.text(512,250,"STORy",{fontFamily:"Arial Black",fontSize:50,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.storyText=this.add.text(512,400,"In einer Welt voller hüpfender Bälle sind Sie die letzte Verteidigungslinie. Nur mit deinem treuen Paddel bewaffnet, musst du den unerbittlichen Ball davon abhalten, die letzte Grenze zu überschreiten. Jeder Treffer bringt dich deinem Ruhm näher, aber Vorsicht - verlierst du deine Konzentration, ist das Spiel vorbei. Wirst du dich der Herausforderung stellen oder den Ball vorbeifliegen lassen? Das Schicksal des Spiels liegt in deinen Händen...",{fontFamily:"Arial",fontSize:24,color:"#ffffff",align:"center",wordWrap:{width:800}}).setOrigin(.5),this.time.delayedCall(1e3,(()=>{this.storyText.setText(""),this.stroyHeadline.setText(""),this.logo=this.add.image(512,300,"logo"),this.title=this.add.text(512,460,["Drücke die Leer-Taste","(oder klicke/ tippe)","um das Spiel zu starten"],{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5)})),this.input.keyboard&&(this.keyboardInput=this.input.keyboard.createCursorKeys()),this.input.on("pointerdown",(()=>{this.scene.start("Game")}))}update(){var t;(null==(t=this.keyboardInput)?void 0:t.space.isDown)&&this.scene.start("Game")}}class r extends i.Scene{constructor(){super("Preloader")}init(){this.add.image(512,384,"background"),this.add.rectangle(512,384,468,32).setStrokeStyle(1,16777215);const t=this.add.rectangle(282,384,4,28,16777215);this.load.on("progress",(e=>{t.width=4+460*e}))}preload(){this.load.setPath("assets"),this.load.image("logo","logo.png"),this.load.image("ball","ball.png"),this.load.image("paddle","paddle.png"),this.load.image("dvdLogo","dvd_logo.png"),this.load.image("memeBall","memeBall.png"),this.load.image("powerUp","powerUp.png"),this.load.image("obstacle","obstacle.png"),this.load.audio("loseSound","GUARDIANO_DELLE_GALASSIE_E_DELLIPERSPAZIO.mp3"),this.load.audio("bgMusic","bgMusic.mp3"),this.load.audio("dvdHitSound","-2InDenChat.mp3")}create(){this.scene.start("MainMenu")}}const h={type:Phaser.AUTO,width:1024,height:768,parent:"game-container",backgroundColor:"#028af8",scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},physics:{default:"arcade",arcade:{gravity:{x:0,y:0}}},scene:[s,r,n,o,l,a]};new i.Game(h);
