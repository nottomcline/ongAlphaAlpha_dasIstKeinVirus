var t=Object.defineProperty,e=(e,s,i)=>((e,s,i)=>s in e?t(e,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[s]=i)(e,"symbol"!=typeof s?s+"":s,i);import{p as s}from"./phaser-CrGWs1g-.js";!function(){const t=document.createElement("link").relList;if(!(t&&t.supports&&t.supports("modulepreload"))){for(const t of document.querySelectorAll('link[rel="modulepreload"]'))e(t);new MutationObserver((t=>{for(const s of t)if("childList"===s.type)for(const t of s.addedNodes)"LINK"===t.tagName&&"modulepreload"===t.rel&&e(t)})).observe(document,{childList:!0,subtree:!0})}function e(t){if(t.ep)return;t.ep=!0;const e=function(t){const e={};return t.integrity&&(e.integrity=t.integrity),t.referrerPolicy&&(e.referrerPolicy=t.referrerPolicy),"use-credentials"===t.crossOrigin?e.credentials="include":"anonymous"===t.crossOrigin?e.credentials="omit":e.credentials="same-origin",e}(t);fetch(t.href,e)}}();class i extends s.Scene{constructor(){super("Boot")}preload(){this.load.image("background","assets/bg.png")}create(){this.scene.start("Preloader")}}class o extends s.Scene{constructor(t,s,i,o=0,a){super("Game"),e(this,"camera"),e(this,"background"),e(this,"msg_text"),e(this,"player"),e(this,"ball"),e(this,"cursors"),e(this,"points",0),e(this,"textScore"),this.player=t,this.ball=s,this.cursors=i,this.points=o,this.textScore=a}init(){this.points=0}create(){this.camera=this.cameras.main,this.camera.setBackgroundColor("#181818"),this.background=this.add.image(512,384,"background"),this.background.setAlpha(.5),this.ball=this.physics.add.sprite(this.physics.world.bounds.width/2,this.physics.world.bounds.height/2,"ball"),this.ball.setVisible(!0);const t=this.randomIntFromInterval(100,800),e=this.randomIntFromInterval(100,800);this.ball.body.setVelocity(t,e),this.player=this.physics.add.sprite(this.physics.world.bounds.width-(this.ball.body.width/2+1),this.physics.world.bounds.height/2,"paddle"),this.input.keyboard&&(this.cursors=this.input.keyboard.createCursorKeys()),this.player.setCollideWorldBounds(!0),this.ball.setCollideWorldBounds(!0),this.ball.setBounce(1,1),this.player.setImmovable(!0),this.physics.add.collider(this.ball,this.player,void 0,this.ifPlayerGetsHit,this),this.textScore=this.add.text(10,10,"Punkte: 0",{fontFamily:"Monaco, Courier, monospace",fontSize:"25px",color:"#fff"})}update(){if(this.ball.body.x>this.player.body.x)return this.ball.disableBody(!0,!0),this.restartGame(),void this.scene.start("GameOver",{points:this.points});this.player.body.setVelocityY(0),this.cursors.up.isDown?this.player.body.setVelocityY(-650):this.cursors.down.isDown&&this.player.body.setVelocityY(650),this.changeBallVelocityOnBounce()}restartGame(){this.textScore.setText("Punkte: 0"),this.ball.enableBody(!0,this.physics.world.bounds.width/2,this.physics.world.bounds.height/2,!0,!0),this.ball.setVelocity(0,0),this.ball.setVisible(!1),this.player.body.reset(this.physics.world.bounds.width-(this.ball.body.width/2+1),this.physics.world.bounds.height/2)}changeBallVelocityOnBounce(){if(this.ball.body.x===this.player.body.x){const t=this.randomIntFromInterval(100,800);this.ball.setVelocityX(t)}if(this.ball.body.x===this.game.config.width||0===this.ball.body.x){const t=this.randomIntFromInterval(100,800);this.ball.setVelocityX(t)}if(this.ball.body.y===this.game.config.height||0===this.ball.body.y){const t=this.randomIntFromInterval(100,800);this.ball.setVelocityY(t)}}randomIntFromInterval(t,e){return Math.floor(Math.random()*(e-t+1)+t)}ifPlayerGetsHit(){this.points++,this.textScore.setText(`Punkte: ${this.points}`)}}class a extends s.Scene{constructor(){super("GameOver"),e(this,"camera"),e(this,"background"),e(this,"gameover_text"),e(this,"selectedOption","Ja"),e(this,"points"),e(this,"keyboardInput"),e(this,"yesText"),e(this,"noText")}init(t){this.points=t.points,this.selectedOption="Ja"}create(){this.camera=this.cameras.main,this.camera.setBackgroundColor(16711680),this.background=this.add.image(512,384,"background"),this.background.setAlpha(.5),this.input.keyboard&&(this.keyboardInput=this.input.keyboard.createCursorKeys()),this.add.text(512,200,"Game Over :c",{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.add.text(512,260,`Punkte: ${this.points}`,{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.add.text(512,420,"Nochmal spielen?",{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.yesText=this.add.text(450,480,"Ja",{fontFamily:"Arial Black",fontSize:38,color:"#ffff00",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.noText=this.add.text(550,480,"Nein",{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5)}update(){var t,e,s;(null==(t=this.keyboardInput)?void 0:t.left.isDown)?(this.selectedOption="Ja",this.updateSelection()):(null==(e=this.keyboardInput)?void 0:e.right.isDown)&&(this.selectedOption="Nein",this.updateSelection()),(null==(s=this.keyboardInput)?void 0:s.space.isDown)&&("Ja"===this.selectedOption?this.scene.start("Game"):this.scene.start("MainMenu"))}updateSelection(){var t,e,s,i;"Ja"===this.selectedOption?(null==(t=this.yesText)||t.setColor("#ffff00"),null==(e=this.noText)||e.setColor("#ffffff")):(null==(s=this.yesText)||s.setColor("#ffffff"),null==(i=this.noText)||i.setColor("#ffff00"))}}class r extends s.Scene{constructor(){super("MainMenu"),e(this,"background"),e(this,"logo"),e(this,"title"),e(this,"keyboardInput")}create(){this.background=this.add.image(512,384,"background"),this.logo=this.add.image(512,300,"logo"),this.title=this.add.text(512,460,["Drücke die Leer-Taste","um das Spiel zu starten"],{fontFamily:"Arial Black",fontSize:38,color:"#ffffff",stroke:"#000000",strokeThickness:8,align:"center"}).setOrigin(.5),this.input.keyboard&&(this.keyboardInput=this.input.keyboard.createCursorKeys())}update(){var t;(null==(t=this.keyboardInput)?void 0:t.space.isDown)&&this.scene.start("Game")}}class n extends s.Scene{constructor(){super("Preloader")}init(){this.add.image(512,384,"background"),this.add.rectangle(512,384,468,32).setStrokeStyle(1,16777215);const t=this.add.rectangle(282,384,4,28,16777215);this.load.on("progress",(e=>{t.width=4+460*e}))}preload(){this.load.setPath("assets"),this.load.image("logo","logo.png"),this.load.image("ball","ball.png"),this.load.image("paddle","paddle.png")}create(){this.scene.start("MainMenu")}}const l={type:Phaser.AUTO,width:1024,height:768,parent:"game-container",backgroundColor:"#028af8",scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},physics:{default:"arcade",arcade:{gravity:{x:0,y:0}}},scene:[i,n,r,o,a]};new s.Game(l);