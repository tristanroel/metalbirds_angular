import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as Phaser from 'phaser';
import { UserService } from 'src/app/services/user.service';
import { StatsService } from 'src/app/services/stats.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { Iuser } from 'src/app/interface/iuser';
import { Istats } from 'src/app/interface/istats';

class MainScene extends Phaser.Scene {
    constructor(
      private userservice : UserService,
      private statservice : StatsService,
      private storageservice : SessionStorageService
      ) {
      super({ key: 'main' });

    }
    isGameOverButtonApear : boolean = false;
    user! : Iuser;
    stat! : Istats;
    tweenManager! : Phaser.Tweens.TweenManager;
    camera! : Phaser.Cameras.Scene2D.Camera;
    player! : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    timingShoot! : Phaser.Time.TimerEvent;
    bullets! : Phaser.Physics.Arcade.Group;
    bullets2! : Phaser.Physics.Arcade.Group;
    enemies! : Phaser.Physics.Arcade.Group;
    impacts! : Phaser.Physics.Arcade.Group;
    drgBody : any[] = []; //dragon boss body array
    bodyMoveDragonVelocity = 0.5;
    KILLCOUNTLEVEL : number = 0;
    _KILLCOUNT : number = 0;
    _DEATHNUMBER : number = 0;
    _LEVELMAX : number = 1;
    _BULLETDAMAGE : number = 0;
    _BOSSKILL : number = 0;

    cursor :  Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    // spacebar : any;
    // lvlnxtfunc :any;
    popenemyOne!: Phaser.Time.TimerEvent;
    popenemyTwo! : Phaser.Time.TimerEvent;
    popenemyThree! : Phaser.Time.TimerEvent;
    popenemyFour! : Phaser.Time.TimerEvent;
    popenemyFive! : Phaser.Time.TimerEvent;
    popenemySix! : Phaser.Time.TimerEvent;
    popenemySeven! : Phaser.Time.TimerEvent;
    popenemyEight! : Phaser.Time.TimerEvent;
    popenemyNine! : Phaser.Time.TimerEvent;
    popenemyTen! : Phaser.Time.TimerEvent;
    popbossOne! : Phaser.Time.TimerEvent;
    popBonusCounter : number = 0; //pop weapon counter

    scoreValue : number = 0;
    levelValue : number = 1;
    skyIsVisible : boolean= true;
    pointxt! : Phaser.GameObjects.Text;
    scoretext! : any;
    leveltxt! : any;
    gameovertxt! : Phaser.GameObjects.Text;
    goscoretxt! : any;
    starttxt! : any;
    reactor! : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    backGroundSpeed = 0;
    skyAlphaMax = 0.4;
    itsIncrementNextLvlValue : boolean = false;
    ispopBonus : boolean = true;
    ispopBoss : boolean = true;
    isPaused : boolean = false;
    armEvoCount : number = 1; 
    speed : number = 100; // popenemy = levelvalue * speed 
    menuBar! : Phaser.GameObjects.Rectangle;
    healthBar! : Phaser.GameObjects.Rectangle;
    weaponUp! : Phaser.Physics.Arcade.Group; //box weapon+
    city! : Phaser.GameObjects.TileSprite; //decor
    sky! : Phaser.GameObjects.TileSprite; //decor
    killwall : any;
  
    preload() {
      this.load.spritesheet('player', 'assets/img/f16.png', {frameWidth : 31, frameHeight : 48});
      this.load.spritesheet('bullet','assets/img/bullet01.png', {frameWidth : 16, frameHeight : 16});
      this.load.spritesheet('fatbullet','assets/img/bullet01.png', {frameWidth : 32, frameHeight : 32});
      this.load.spritesheet('xplose','assets/img/Xplose.png', {frameWidth : 160, frameHeight : 160});
      this.load.spritesheet('city','assets/img/sea.png', {frameWidth : 366, frameHeight : 445});
      this.load.spritesheet('sky','assets/img/sky.png', {frameWidth : 415, frameHeight : 558});
      this.load.spritesheet('airplanes','assets/img/ironbirds.png', {frameWidth : 40, frameHeight : 48});
      this.load.spritesheet('fatbirds','assets/img/fatbirds.png', {frameWidth : 190, frameHeight : 180});
      this.load.spritesheet('dragon','assets/img/dragon.png', {frameWidth : 90, frameHeight : 90});
      this.load.spritesheet('box','assets/img/box.png', {frameWidth : 32, frameHeight : 48});
    }

    create() {
        console.log('create method');
        this.tweenManager = this.tweens;
        this.menuBar = this.add.rectangle(183,10,366,30,0x3D3D3D);                                   //healthbar
        this.menuBar.setScrollFactor(0,0);
        this.menuBar.setDepth(3);
        this.input.keyboard?.on('keydown-SPACE',()=> this.PauseGameAction());
        this.cursor = this.input.keyboard?.createCursorKeys();

        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');

        this.camera = this.cameras.main;
        this.camera.setViewport(0, 0, 366, 445); //bordure externe visible l'ors du tremblement
        this.player = this.physics.add.sprite(183, 350,'airplanes').setDepth(2);
        this.player.body.setSize(8, 20);                                    
        this.player.setData('health', 4);
        this.player.setCollideWorldBounds(true);
        this.player.visible = true;
        this.armEvoCount = 1;

        this.healthBar = this.add.rectangle(70,10,120,10,0xB14F37);                                   //healthbar
        this.healthBar.setScrollFactor(0,0);
        this.healthBar.setDepth(5);

        this.bullets = this.physics.add.group();
        this.bullets2 = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.impacts = this.physics.add.group();
        this.weaponUp = this.physics.add.group();
        console.log(this.bullets);
        //DECOR
        this.city = this.add.tileSprite(183,222.5,366,445,'city', 0);
        this.city.alpha = 0.7;
        this.sky = this.add.tileSprite(183,222.5,366,445,'sky', 0)
        this.sky.alpha = 0.4;
        this.scoretext = this.add.text(290, 10, 'SCORE:',{font:'16px Arial Black'}).setOrigin(0.5, 0.5).setDepth(4);    
        this.leveltxt = this.add.text(150, 10, 'LEVEL: ',{ font: '18px Courier'}).setOrigin(0.5, 0.5).setDepth(4);
        this.starttxt = this.add.text(183, 200, '3',{ font: '60px Courier'}).setOrigin(0.5, 0.5).setDepth(4);
        this.gameovertxt = this.add.text(183, 200, 'GAME OVER',{ font: '60px Courier'}).setOrigin(0.5, 0.5).setDepth(4).setVisible(false);
        this.goscoretxt = this.add.text(183, 260, 'score',{ font: '60px Courier'}).setOrigin(0.5, 0.5).setDepth(4).setVisible(false);
        this.killwall = this.physics.add.sprite(183,500,'');
        this.pointxt = this.add.text(0, 0,'',{ font: '20px Courier'}).setOrigin(0.5, 0.5);
        this.killwall.body.setSize(445,20);
        //ANIMS
        this.anims.create({
          key: 'burst',
          frames: this.anims.generateFrameNumbers('bullet',{frames: [252, 277, 302, 327]}),
          frameRate: 15,
          repeat: -1
        });
        this.anims.create({
            key: 'impactzero',
            frames: this.anims.generateFrameNumbers('bullet',{frames: [1, 26, 51, 76, 1, 26, 51, 76, 1, 26, 51, 76]}),
            frameRate: 15,
            //repeat: -1
        });
        this.anims.create({
            key: 'xplosion',
            frames: this.anims.generateFrameNumbers('xplose',{frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}),
            frameRate: 15,
            //repeat: -1
        });
          this.anims.create({
              key: 'bullet1',
              frames: this.anims.generateFrameNumbers('bullet',{frames: [134, 159, 184, 209]}),
              frameRate: 15,
              repeat: -1
          });
        this.anims.create({
            key: 'bullet2',
            frames: this.anims.generateFrameNumbers('bullet',{frames: [509, 534, 559, 584]}),
            frameRate: 25,
            repeat: -1
        });
        this.anims.create({
            key: 'bullet3',
            frames: this.anims.generateFrameNumbers('bullet',{frames: [627, 652, 677, 702]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'bullet4',
            frames: this.anims.generateFrameNumbers('bullet',{frames: [630, 655, 680, 705]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'bullet5',
            //frames: this.anims.generateFrameNumbers('bullet',{frames: [765, 790, 815, 840]}),
            frames: this.anims.generateFrameNumbers('bullet',{frames: [765,815,790,840]}),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'bullet6',
            //frames: this.anims.generateFrameNumbers('bullet',{frames: [765, 790, 815, 840]}),
            frames: this.anims.generateFrameNumbers('fatbullet',{frames: [44,56,68]}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'bullet8',
            //frames: this.anims.generateFrameNumbers('bullet',{frames: [765, 790, 815, 840]}),
            frames: this.anims.generateFrameNumbers('bullet',{frames: [127,152,177,202]}),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'bullet10',
            frames: this.anims.generateFrameNumbers('bullet',{frames: [129,154,179,204]}),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'bulletBossOne',
            frames: this.anims.generateFrameNumbers('bullet',{frames: [633,658,683,708]}),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'flame',
            frames: this.anims.generateFrameNumbers('fatbullet',{frames: [18, 30, 42, 54]}),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'dragonHead',
            //frames: this.anims.generateFrameNumbers('dragon',{frames: [0, 1, 2, 3, 2, 1, 0]}),
            frames: this.anims.generateFrameNumbers('dragon',{frames: [3, 2, 1, 0, 0, 1, 2]}),
            frameRate: 4,
            repeat: -1
        });

        this.reactor = this.physics.add.sprite(183, 290,'bullet').setDepth(2);
        this.reactor.anims.play('burst',true);
        this.reactor.visible = false;
        //SHOOT CADENCE
        this.timingShoot = this.time.addEvent({delay : 250, callback: ()=> this.shootAction() , loop : true, paused : false});
        // //ENEMY POP
        this.popenemyOne = this.time.addEvent({delay : 3000 , callback: () => this.setEnemyOne() , loop : true, paused : true});
        this.popenemyTwo = this.time.addEvent({delay : 2500 , callback: ()=> this.setEnemyTwo() , loop : true, paused : true});
        this.popenemyThree = this.time.addEvent({delay : 5000 , callback: ()=> this.setEnemyThree() , loop : true, paused : true});
        this.popenemyFour = this.time.addEvent({delay : 3000 , callback: ()=> this.setEnemyFour() , loop : true, paused : true,});
        this.popenemyFive = this.time.addEvent({delay : 10000, callback: ()=> this.setEnemyFive() , loop : true, paused : true,});
        this.popenemySix = this.time.addEvent({delay : 10000 , callback: ()=> this.setEnemySix() , loop : true, paused : true,});
        this.popenemySeven = this.time.addEvent({delay : 1000 , callback: ()=> this.setEnemySeven() , loop : true, paused : true});
        this.popenemyEight = this.time.addEvent({delay : 10000 , callback: ()=> this.setEnemyEight() , loop : true, paused : true});
        this.popenemyNine = this.time.addEvent({delay : 100000 ,callback: ()=> this.setEnemyNine() , loop : true});
        this.popenemyTen = this.time.addEvent({delay : 2000 ,callback: ()=> this.setEnemyTen() , loop : true , paused : true});
        
      
        
        this.physics.add.overlap(this.bullets, this.enemies, function(){

        });
        //IMPACT COLLISION
          const self = this;

          this.physics.add.overlap(this.bullets, this.enemies, function(blt:any,nmy:any){
            if(nmy.data.list.health > 0){
                nmy.data.list.health -= 1;
                self._BULLETDAMAGE +=1;
                self.scoreValue ++;
                self.createImpact(nmy);
                self.textPoint(1, nmy);
                blt.destroy();
            }else{
                self.popBonusCounter += 1;
                self.KILLCOUNTLEVEL += 1;
                self._KILLCOUNT +=1;
                self.scoreValue += 10;
                self.textPoint(5, nmy);
                if(nmy.data.list.type == 'boss'){
                    self._BOSSKILL += 1;
                    self.bossDestruction(nmy);
                    self.destroyAll();
                    console.log("level Value : " +self.levelValue);
                }else{
                    self.createExplose(nmy);
                    nmy.destroy();
                }
            }
            self.scoretext.setText(`SCORE:${self.scoreValue}`);
          });

        this.physics.add.overlap(this.player, this.bullets2, function(plyr :any, blt:any){
          blt.destroy();
          // Réinitialisation des propriétés de l'effet de secousse de la caméra
          self.camera.shakeEffect.reset();
          // Configuration des paramètres de l'effet de secousse
          self.camera.shakeEffect.start(800, 0.01);
          if(plyr.data.list.health > 1){
              plyr.data.list.health -= 1;
              self.armEvoCount -= 1;
              self.createImpact(plyr);
          }else{
              plyr.data.list.health = 0;
              self._DEATHNUMBER++;
              self.armEvoCount = 99;
              self.createExplose(plyr);
              console.log(plyr);
              self.GameOverScene();
          }
         console.log('plyr hlth : '+ plyr.data.list.health);
        });

        this.physics.add.overlap(this.player, this.weaponUp, function(plyr, box){
          self.armEvoCount += 1;
          box.destroy();
          self.ispopBonus = true;
        });

        this.physics.add.overlap(this.killwall, this.enemies, function(kllwll, enmy){
          enmy.destroy();
        })
        this.StartScene();
    }

    override update() {
        if(!this.isPaused){
            this.city.tilePositionY -= (1 + this.backGroundSpeed);
            this.sky.tilePositionY -= (3 + this.backGroundSpeed);
            this.popBoss();
            this.popBonusWeapon();
            this.LevelNext();
            this.SceneAction();
            this.playerMovement();
        }else{
            this.city.tilePositionY = this.city.tilePositionY;
            this.sky.tilePositionY = this.sky.tilePositionY;
        }
        this.healthBar.width = this.player.data.list['health'] * 20;
        this.reactor.x = this.player.x;
        this.reactor.y = this.player.y + 30;
        this.leveltxt.setText(`LVL:${this.levelValue}`);

        if(!this.skyIsVisible){
            if(this.sky.alpha > 0){this.sky.alpha -= 0.005;}
        }else{
            if(this.sky.alpha < this.skyAlphaMax){this.sky.alpha += 0.005;}
        }
        
        if(this.drgBody.length > 0){
            Phaser.Actions.Angle(this.drgBody, 1.5, 0.1,17,2);
            //destroyDragon(drgBody);
        }
    }
    // FUNCTIONS
    StartScene(){
      var startValues = [3,2,1,'GO!',''];
      var nbr = 0;
      this.timingShoot.paused = true;
      var start = setInterval(()=>{
          nbr++;
          this.starttxt.setText(startValues[nbr]);
          //console.log(nbr);
          if(nbr >= 4){
              this.timingShoot.paused = false;
              clearInterval(start)
          };
      },1000);
    } 

    SceneAction(){
    switch (this.KILLCOUNTLEVEL) {
        case 0 :
        this.popenemyOne.paused = false;
        this.popenemySix.paused = false;
        this.ispopBoss = true;
        //console.log('salut');
            break;
        case 10 + this.levelValue:
        this.cloudOpacityChange();
        this.popenemyOne.paused = true;
        this.popenemySix.paused = true;
        this.popenemyTwo.paused = false;
        this.popenemyFive.paused = false;
            break;
        case 20 + this.levelValue:console.log("20 Kill");
        this.cloudOpacityChange();
        this.popenemyThree.paused = false;
        this.popenemySeven.paused = false;
        this.popenemyTwo.paused = true;
        this.popenemyFive.paused = true;
            break;
        case 25 + this.levelValue: console.log("25 Kill");
        this.popenemySeven.paused = true;
            break;
        case 30 : console.log("30 Kill");
        this.cloudOpacityChange();
        this.popenemyEight.paused = false;
        this.popenemyFour.paused = false;
        this.popenemyThree.paused = true;
            break;
        case 40 + this.levelValue: //console.log("40 Kill");
        this.cloudOpacityChange();
        this.popenemyTen.paused = false;
        this.popenemyEight.paused = true;
        this.popenemyFour.paused = true;
            break;
        case 50 + this.levelValue: //console.log("50 Kill");
        this.cloudOpacityChange();
        this.popenemyTen.paused = true;
            break
        default:
            break;
      }
    }

    LevelNext(){
    if(this.itsIncrementNextLvlValue){
        if(this.KILLCOUNTLEVEL >= 50){this.levelValue++;this._LEVELMAX++}
        this.KILLCOUNTLEVEL = 0;
        this.itsIncrementNextLvlValue = false;
        console.log('hola');
      }
    }

    nextLevelAction(){
    let newSpeed = 10;
    this.skyAlphaMax = 0.8;
    this.popenemyNine.paused = true;
    this.city.setTintFill(1);
     var cloud = this.tweens.addCounter({
        from: this.backGroundSpeed,
        to: newSpeed,
        duration: 15000,
        ease: 'expo.out',
        onUpdate: (tween:any) =>
        {
            this.reactor.visible = true;
            const value = Math.round(tween.getValue());
            this.backGroundSpeed = value;
        },
    });
      setTimeout(()=>{
        this.reactor.visible = false;
        this.timingShoot.paused = false;
        newSpeed = 0;
        this.backGroundSpeed = 0;
        this.skyAlphaMax = 0.4;
        cloud.stop();
        this.itsIncrementNextLvlValue = true;
        this.popenemyNine.paused = false;
      },15000);
    }

    GameOverScene(){
      console.log(this._KILLCOUNT);
      
      console.log('allo ?');
      this.player.visible = false;
      setTimeout(()=>{
          this.goscoretxt.setText(this.scoreValue);
          this.gameovertxt.visible = true;
          this.goscoretxt.visible = true;
          //this.SetUserInfo(self);
          this.scene.pause();
          this.destroyAll();

          const element = document.getElementById('rebtn');
          if (element) {
          element.style.visibility = 'visible';
          }
      } , 2000)
      this.SetUserValues(this._KILLCOUNT,this._DEATHNUMBER,this._LEVELMAX,this._BULLETDAMAGE,this._BOSSKILL,this.scoreValue);
    }

    playerMovement(){
      this.player.setVelocity(0); 
      this.player.setFrame(0);                  
      if(this.cursor!.up.isDown){                         
          this.player.setVelocityY(-80);
      }
      if(this.cursor!.down.isDown){                         
          this.player.setVelocityY(80);
      }                      
      if(this.cursor!.left.isDown){                         
          this.player.setVelocityX(-80);
          this.player.setFrame(1)
      }                    
      if(this.cursor!.right.isDown){                         
          this.player.setVelocityX(80);
          this.player.setFrame(3);
      }
    }

    popBonusWeapon(){
      if(this.popBonusCounter >= 10){
          if(this.ispopBonus){
              this.setWeaponUp();
              //(KILLCOUNTLEVEL >= 50)? levelValue++ : "ok";
              this.popBonusCounter = 0;
              this.ispopBonus = false;
              console.log('hola');
          }
      }
    }

    popBoss(){
    if(this.KILLCOUNTLEVEL >= 50 + this.levelValue){
        if(this.ispopBoss){
            console.log(this.ispopBoss);
            switch (this.levelValue) {
                case 1: this.setBossOne();
                this.ispopBoss = false;
                    break;
                case 2: this.setBossOne();
                this.ispopBoss = false;           
                    break;
                case 3: this.setBossOne();
                this.ispopBoss = false;
                    break;
                case 4: this.setBossOne();
                this.ispopBoss = false;
                    break;
                case 5: //this.setDragon();
                this.ispopBoss = false;
                    break;
                default: this.setBossOne();
                this.ispopBoss = false;
                    break;
            }
        }
    }
    }

    shootAction(){
      if(this.bullets){
        switch (this.armEvoCount) {
        case 1: 
            var fire = this.bullets!.create(this.player.body.position.x + 3, this.player.body.position.y,'bullet', 404).setSize(3, 6).setOffset(7,5).setScale(2);
            setTimeout(() => {fire.destroy();}, 1000);
            fire.body.velocity.y = -300;
            break;
        case 2: 
            var fire = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire2 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            setTimeout(() => {fire.destroy();fire2.destroy();}, 1000);
            fire.body.velocity.y = -300;
            fire2.body.velocity.y = -300;
            break;
        case 3:
            var fire3 = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire4 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire2 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            setTimeout(() => {fire.destroy();fire2.destroy();fire3.destroy;fire4.destroy();}, 1000);
            fire.body.velocity.x = 120;
            fire.body.velocity.y = -300;
            fire2.body.velocity.x = -120;
            fire2.body.velocity.y = -300;
            fire3.body.velocity.y = -300;
            fire4.body.velocity.y = -300;
            break;
        case 4: this.armEvoCount = 3;
            break;
        case 99 : 
            break;
        default: this.armEvoCount = 1;
            break;
        }

      }else{
        console.log('pas trouvé');
        console.log(this);
      }
    };

    textPoint(value:any, enmy:any){
    this.pointxt.x = enmy.x;
    this.pointxt.y = enmy.y;
    this.pointxt.setDepth(5);
    this.pointxt.text = `+ ${value}`;
    this.pointxt.visible = true;
    this.tweens.add({
        targets: this.pointxt,
        delay : 100,
        y: enmy.y - 25,
    });
    setTimeout(() => {
        this.pointxt.visible = false;
    }, 100);
    }

    cloudOpacityChange(){
    this.skyIsVisible = false;
    setTimeout(()=>{this.skyIsVisible = true;},5000)
    };

  //SET ENEMY
  //////////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////

    setEnemyOne(){
        var rndX = Phaser.Math.Between(50,316);      
        var shootDelay = Phaser.Math.Between(1000,10000);
        var enemy = this.enemies.create(rndX,0,'airplanes',4);
        enemy.body.setSize(20, 35)
        // .setOffset(80,50);
        enemy.setData('health', 3);
        enemy.flipY = true;
        enemy.body.velocity.y = 40;
        setTimeout(() => {
            if(enemy.data != undefined){
                this.ShootEnemyOne(enemy);
            }
        }, shootDelay);
    }

    setEnemyTwo(){   
        var rndX = Phaser.Math.Between(30,336);      
        var shootDelay = Phaser.Math.Between(1000,10000);      
        var enemy = this.enemies.create(rndX,-30,'airplanes',10);
        enemy.body.setSize(25, 35);
        enemy.setData('health', 5);
        enemy.flipY = true;
        this.tweens.add({
            targets : enemy,
            props: {
                x: { value: 200, duration: 4000, },
                y: { value: 600, duration: 15000,  },
            },
            ease: 'Sine.easeInOut',
            yoyo: true,
            //repeat: -1
        });
        setTimeout(() => {
            if(enemy.data != undefined){this.ShootEnemyTwo(enemy);}
        }, shootDelay);
    }

    setEnemyThree(){
        var rndX = Phaser.Math.Between(-40,40);      
        //var shootDelay = Phaser.Math.Between(1000,10000);      
        var enemy = this.enemies.create(174,0,'airplanes',11).setDepth(2);
        enemy.setData('health', 12);
        enemy.flipY = true;
        enemy.body.velocity.y = 40;
        enemy.body.velocity.x = rndX;
        setTimeout(() => {
            if(enemy.data != undefined){
                this.ShootEnemyThree(enemy);
                enemy.body.velocity.y = 0;
                enemy.body.velocity.x = 0;
            }
        }, 3000);
    }

    setEnemyFour(){
        // var rndyvel = Phaser.Math.Between(3000,8000);         
        let rnd = Math.floor(Math.random() * 2); // 0 | 1
        let posX = (rnd == 0)? 0 : 366;
        console.log(rnd);
        var enemy = this.enemies.create(posX,80,'airplanes',9);
        enemy.setData('health', 3);
        enemy.flipY = true;
        this.tweens.add({
            targets: enemy,
            x : {value : 173 , ease : 'back.out'},
            y : {value : 500 , ease : 'quint.in'},
            duration : 8000
        });
        enemy.body.velocity.y = 30;
        setTimeout(() => {
            if(enemy.data != undefined){
                this.ShootEnemyFour(enemy);
            }
        }, 1500);
    }

    setEnemyFive(){
        let rnd = Math.floor(Math.random() * 2) 
        let posX = (rnd == 0)? 100 : 266;
        var rndX = Phaser.Math.Between(50,316);      
        var rndX2 = Phaser.Math.Between(50,316);   
        // var shootDelay = Phaser.Math.Between(1000,10000);      
        var enemy = this.enemies.create(posX,0,'airplanes',5);
        enemy.body.setSize(25, 35);   
        enemy.setData('health', 10);
        enemy.flipY = true;
        this.tweens.add({
            targets: enemy,
            x : {value : rndX2 , ease : 'expo.in'},
            y : {value : 140 , ease : 'quint.out'},
            duration : 8000
        });
        //enemy.body.velocity.y = 40;
        setTimeout(() => {
            if(enemy.data != undefined){
                this.ShootEnemyFive(enemy);
            }
        }, 2000);
    }

    setEnemySix(){
        let rnd = Math.floor(Math.random() * 2) 
        let posX = (rnd == 0)? 0 : 366;
        var rndX = Phaser.Math.Between(50,316);         
        var rndY = Phaser.Math.Between(90,200);         
        var enemy = this.enemies.create(posX,250,'airplanes',6);
        enemy.body.setSize(25, 35);
        enemy.setData('health', 10);
        enemy.flipY = true;
        this.tweens.add({
            targets: enemy,
            x : {value : rndX , ease : 'linear'},
            y : {value : rndY , ease : 'sine.int'},
            duration : 4000
        });
        setTimeout(() => {
            if(enemy.data != undefined){
                this.ShootEnemySix(enemy);
            }
        }, 300);
    }

    setEnemySeven(){
        var rndtimeShoot = Phaser.Math.Between(3000,8000);         
        var enemy = this.enemies.create(173,0,'airplanes',7);
        enemy.setData('health', 3);
        enemy.flipY = true;
        this.tweens.add({
            targets: enemy,
            props: {
                x: { value: 300, duration: 2000,},
                y: { value: 500, duration: 25000,  },
            },
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
        setTimeout(() => {
            if(enemy.data != undefined){
                this.ShootEnemySeven(enemy);
            }
        }, rndtimeShoot);
    }

    setEnemyEight(){  
        var rndx = Phaser.Math.Between(-30,30);         
        var rndy = Phaser.Math.Between(10,50);         
        var enemy = this.enemies.create(173,0,'airplanes',13);
        enemy.setData('health', 8);
        enemy.flipY = true;
        enemy.body.velocity.y = rndy;
        enemy.body.velocity.x = rndx;
        setTimeout(() => {
            if(enemy.data != undefined){
                enemy.body.velocity.y = 0;
                enemy.body.velocity.x = 0;
                var canon = this.bullets2.create(enemy.x, enemy.y, 'bullet', 9).setData('',0);
                this.tweens.add({
                    targets: canon,
                    angle: { start: 30, to: 160 },
                    ease: 'sine.inout',
                    yoyo: true,
                    repeat: -1,
                    duration: Phaser.Math.Between(2000, 5000)
                });
                this.ShootEnemyEight(canon,enemy);
            }
        }, 3500);
    };

    setEnemyNine(){
        var rndxpos = Phaser.Math.Between(100,266);         
        var rndyvel = Phaser.Math.Between(15,30);         
        var enemy = this.enemies.create(rndxpos,0,'fatbirds',4);
        enemy.setData('health', 20);
        enemy.body.setSize(30, 60).setOffset(80,50);
        enemy.body.velocity.y = rndyvel;
        setTimeout(() => {
            if(enemy.data != undefined){
                enemy.body.velocity.y = 0;
                var canon = this.bullets2.create(enemy.x, enemy.y, 'bullet', 9).setData('',0);
                this.tweens.add({
                    targets: canon,
                    angle: { start: 30, to: 160 },
                    ease: 'sine.inout',
                    //yoyo: true,
                    repeat: -1,
                    duration: Phaser.Math.Between(2000, 5000)
                });
                this.ShootEnemyNine(canon,enemy);
            }
        }, 6000);
    }

    setEnemyTen(){      
        var rndX = Phaser.Math.Between(100,266);         
        var rndyvel = Phaser.Math.Between(10,50);         
        var rndxvel = Phaser.Math.Between(-50,50);         
        var enemy = this.enemies.create(rndX,0,'airplanes',12);
        enemy.setData('health', 5);
        enemy.flipY = true;
        enemy.body.setSize(30, 35);
        enemy.body.velocity.y = rndyvel;
        enemy.body.velocity.x = rndxvel;
        enemy.body.bounce.y = 1;
        enemy.body.bounce.x = 1;
        setTimeout(()=>{
        enemy.setCollideWorldBounds(true);
        },500);
        this.ShootEnemyTen(enemy);  
    }

    setBossOne(){
        var enemy = this.enemies.create(173,0,'fatbirds',3).setDepth(4);
        var canon = this.bullets2.create(173,0,'bullet',9);
        enemy.body.setSize(35, 70)
        enemy.setData('health', 200);
        enemy.setData('type', 'boss');
        enemy.body.velocity.y = 80;
        canon.body.velocity.y = 80;
            this.tweens.add({
                targets: canon,
                angle: { start: 180, to: 0 },
                ease: 'sine.inout',
                yoyo: true,
                repeat: -1,
                duration: Phaser.Math.Between(2000, 5000)
            });
        setTimeout(()=>{
            enemy.body.velocity.y = 0;
            canon.body.velocity.y = 0;
            this.tweens.add({
                targets: [enemy, canon],
                props: {
                    x: { value: Phaser.Math.Between(50, 300), duration: 4000,},
                    y: { value: Phaser.Math.Between(50, 300), duration: 8000,},
                },
                ease: 'Sine.easeInOut',
                yoyo: true,
                repeat: -1
            });
            this.ShootBossOne(canon, enemy);
            this.ShootEnemyFive(enemy);
        },2000);
    };

    setWeaponUp(){      
        var rndX = Phaser.Math.Between(100,266);      
        var rndyvel = Phaser.Math.Between(10,50);         
        var rndxvel = Phaser.Math.Between(-130,130);         
        var box = this.weaponUp.create(173,10,'box',0).setScale(0.8);
        box.setCollideWorldBounds(true);
        box.body.setSize(30, 35);
        box.body.velocity.y = rndyvel;
        box.body.velocity.x = rndxvel;
        box.body.bounce.y = 1;
        box.body.bounce.x = 1;
    };

    setDragon(){
        for (let i = 0; i < 20; i++)
        {
            if(i == 19){
                this.drgBody.push(this.enemies.create(460 - (i * 10),-200 + (i * 8),'dragon',3));
                this.drgBody[i].setData('health', 100);
                this.drgBody[i].setData('type', 'boss');
                this.drgBody[i].body.setSize(50, 50);
                this.drgBody[i].body.velocity.y = 20;
                this.drgBody[i].anims.play('dragonHead', true);
            }else{
                this.drgBody.push(this.enemies.create(460 - (i * 10),-200 + (i * 8),'dragon',4));
                this.drgBody[i].setData('health', 5000);
                this.drgBody[i].body.setSize(40, 40);
                this.drgBody[i].body.velocity.y = 20;
            }
            this.tweens.add({
                targets: [ this.drgBody[i]],
                x:  i * 6,
                yoyo: true,
                duration: 1500 -(i * 0.5) ,
                ease: 'Sine.easeInOut',
                repeat: -1,
            });
            setTimeout(() => {
                this.drgBody[i].body.velocity.y = 0;
            }, 11500);
        }
        this.ShootDragon(this.drgBody[19]);
        this.ShootEnemyFive(this.drgBody[9]);
        //destroyDragon(drgBody);
    };
    //SHOOT
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////
    ShootEnemyOne(enmy : any){
        var bulet = this.bullets2.create(enmy.x,enmy.y,'bullet');
        bulet.anims.play('bullet1', true);
        bulet.body.setSize(6, 6);
        bulet.setScale(2);
        setTimeout(()=>{bulet.destroy();},7000);
        this.physics.moveToObject(bulet, this.player, 60);
    }

    ShootEnemyTwo(enmy : any){
        var bulet = this.bullets2.create(enmy.x,enmy.y,'bullet');
        bulet.anims.play('bullet2', true);
        bulet.body.setSize(4, 10);
        bulet.flipY = true;
        bulet.setScale(2);
        bulet.body.velocity.y = 100;
        setTimeout(()=>{bulet.destroy();},7000);
        //console.log('daboom');
    }

    ShootEnemyThree(enmy : any){
        var fire = setInterval(()=>{       
            var buletOne = this.bullets2.create(enmy.x,enmy.y,'bullet');
            var buletTwo = this.bullets2.create(enmy.x,enmy.y,'bullet');
            var buletThree = this.bullets2.create(enmy.x,enmy.y,'bullet');
            buletOne.anims.play('bullet3', true).setDepth(1);
            buletTwo.anims.play('bullet3', true).setDepth(1);
            buletThree.anims.play('bullet3', true).setDepth(1);
            buletOne.body.setSize(4, 4);
            buletTwo.body.setSize(4, 4);
            buletThree.body.setSize(4, 4);
            buletOne.flipY = true;
            buletTwo.flipY = true;
            buletThree.flipY = true;
            buletOne.setScale(2);
            buletTwo.setScale(2);
            buletThree.setScale(2);
            buletOne.body.velocity.y = 50;
            buletTwo.body.velocity.y = 50;
            buletTwo.body.velocity.x = -10;
            buletThree.body.velocity.y = 50;
            buletThree.body.velocity.x = 10;
            if(enmy.data == undefined){this.destroyEnmyBullet(buletOne,buletTwo,buletThree,fire)};
            setTimeout(()=>{
                this.destroyEnmyBullet(buletOne,buletTwo,buletThree, fire);
                if(enmy.data != undefined){
                    enmy.body.velocity.y = 20;
                    enmy.body.velocity.x = 60;
                };
            },6000);
        },1500);
    }

    destroyEnmyBullet(bullet1:any,bullet2:any,bullet3:any, interval:any){
        bullet1.destroy();
        bullet2.destroy();
        bullet3.destroy();
        clearInterval(interval);
    }

    ShootEnemyFour(enmy : any){
        var bulet = this.bullets2.create(enmy.x,enmy.y,'bullet');
        bulet.anims.play('bullet4', true);
        bulet.body.setSize(6, 6);
        bulet.setScale(2);
        setTimeout(()=>{bulet.destroy();},7000);
        this.physics.moveToObject(bulet, this.player, 100);
    }

    ShootEnemyFive(enmy : any){
        var shoot = setInterval(()=>{
            var bulet = this.bullets2.create(enmy.x,enmy.y,'bullet');
            bulet.anims.play('bullet5', true);
            bulet.body.setSize(6, 6);
            bulet.setScale(2);
            setTimeout(()=>{bulet.destroy();},7000);
            this.physics.moveToObject(bulet, this.player, 100);
            if(enmy.data == undefined){bulet.destroy();clearInterval(shoot)};
        },2000);
    }

    ShootEnemySix(enmy : any){
        var shoot = setInterval(()=>{
            var bulet = this.bullets2.create(enmy.x,enmy.y,'fatbullet');
            bulet.anims.play('bullet6', true);
            bulet.body.setSize(6, 6);
            bulet.body.velocity.y = 110;
            bulet.flipY = true;
            bulet.setScale(2);
            setTimeout(()=>{bulet.destroy();},7000);
            if(enmy.data == undefined){bulet.destroy();clearInterval(shoot)};
        },3000);
    }

    ShootEnemySeven(enmy : any){
        var shoot = setInterval(()=>{
            var rndX = Phaser.Math.Between(-10,10);
            var bulet = this.bullets2.create(enmy.x + rndX,enmy.y,'bullet', 281);
            bulet.body.setSize(6, 6);
            bulet.body.velocity.y = 110;
            bulet.flipY = true;
            bulet.setScale(2);
            setTimeout(()=>{bulet.destroy();},7000);
            if(enmy.data == undefined){bulet.destroy();clearInterval(shoot)};
        },1000);
        setTimeout(()=>{clearInterval(shoot);},3000);
    }

    ShootEnemyEight(canon : any,enmy : any){
        var shoot = setInterval(()=>{
            
        var bulet = this.bullets2.create(canon.x,canon.y,'bullet', 127);
        bulet.body.setSize(10,10);
        bulet.setScale(2);
        bulet.anims.play('bullet8', true);
        this.physics.velocityFromAngle(canon.angle, 100, bulet.body.velocity);
        setTimeout(()=>{bulet.destroy();},7000);
        if(enmy.data == undefined){
            bulet.destroy();
            canon.destroy();
            clearInterval(shoot)};
        },700);
    }

    ShootEnemyNine(canon : any,enmy : any){
        var shoot = setInterval(()=>{
        var bulet = this.bullets2.create(canon.x,canon.y,'bullet', 377);
        bulet.body.setSize(4,5);
        bulet.setScale(2);
        //bulet.anims.play('bullet8', true);
        this.physics.velocityFromAngle(canon.angle, 100, bulet.body.velocity);
        setTimeout(()=>{bulet.destroy();},7000);
        if(enmy.data == undefined){
            bulet.destroy();
            canon.destroy();
            clearInterval(shoot)};
        },300);
    }

    ShootEnemyTen(enmy : any){
        var shoot = setInterval(()=>{
        var bulet = this.bullets2.create(enmy.x,enmy.y,'bullet');
        bulet.anims.play('bullet10', true);
        bulet.body.setSize(6,8);
        bulet.setScale(2);
        bulet.body.velocity.y = 100;
        if(enmy.data == undefined){
            bulet.destroy();
            clearInterval(shoot)};
        }, 3000);
    }

    ShootBossOne(canon:any, enmy:any){
        let gunType = false;
        var shootType = setInterval(()=>{
            gunType = !gunType;
        },5000);
        var shoot = setInterval(()=>{
            if(gunType){
                var bulet = this.bullets2.create(canon.x,canon.y,'bullet', 200);
                bulet.setScale(2);
                bulet.anims.play('bulletBossOne',true);
                this.physics.velocityFromAngle(canon.angle, -50, bulet.body.velocity);
                setTimeout(() => {bulet.destroy();},5000);
            }else{
                var bulet2 = this.bullets2.create(canon.x,canon.y,'bullet', 252);
                bulet2.body.velocity.y = 200;
                bulet2.setScale(2);
                bulet2.flipY = true;
                setTimeout(() => {bulet2.destroy();},5000);
            }
            if(enmy.data == undefined){
                canon.destroy();
                clearInterval(shoot);
                clearInterval(shootType)};
        }, 400);
    }

    ShootDragon(dragon : any){
        var shoot = setInterval(()=>{
            var fire = this.bullets2.create(dragon.x, dragon.y + 40, 'fatbullet');
            fire.anims.play('flame', true);
            fire.body.setSize(13, 20).setOffset(10,10);                                       
            fire.flipY = true;
            fire.setScale(2);
            fire.body.velocity.y = 80; 
            if(dragon.data == undefined){clearInterval(shoot);};
            setTimeout(() => {fire.destroy();},5000);
        }, 3000)
    };

    bossDestruction(enmy : any){
        this.timingShoot.paused = true;
        enmy.setTintFill(1,1,1,1);
        var destruct = setInterval(()=>{
            var rnd = Phaser.Math.Between(-50,50);    
            var rnd2 = Phaser.Math.Between(-50,50);    
            var ipct = this.impacts.create(enmy.x + rnd,enmy.y + rnd2,'xplose').setDepth(5);
            ipct.setScale(0.4);
            ipct.anims.play('xplosion', true);
            //console.log(enemies);
            setTimeout(() => {
                ipct.destroy();
            }, 600);
        },2000);
        setTimeout(() => {
            clearInterval(destruct);
            enmy.destroy();
            this.nextLevelAction();
        },4000)
    }

    createImpact(enmy:any){
        var rnd = Phaser.Math.Between(-8,8);    
        var rnd2 = Phaser.Math.Between(-8,8);    
        var ipct = this.impacts.create(enmy.x + rnd,enmy.y + rnd2,'bullet').setDepth(5);
        ipct.setScale(2);
        ipct.anims.play('impactzero', true);
        enmy.setTintFill(0xffffff,0xffffff,0xffffff,0xffffff)

        setTimeout(()=>{ enmy.clearTint();},100)
        setTimeout(() => {
            enmy.clearTint();
            ipct.destroy();
        }, 600);
    }

    createExplose(enmy:any){
        var xplose = this.impacts.create(enmy.x,enmy.y,'xplose');
        xplose.anims.play('xplosion', true);
        xplose.setScale(0.4);
        setTimeout(() => {
            xplose.destroy();
        }, 600);
    }

    destroyAll(){
        for (let index = 0; index < this.enemies.children.entries.length; index++) {
            this.bossDestruction(this.enemies.children.entries[index]); 
        }
    }

    PauseGameAction(){
        this.isPaused = !this.isPaused; // Inverse l'état de pause lorsque la touche espace est enfoncée
            if(this.isPaused){
                this.physics.pause();
                this.tweenManager.pauseAll();
                this.scene.pause();
                setTimeout(()=>{
                this.scene.resume();
                },250)
                this.popenemyOne.paused = true;
                this.popenemyTwo.paused = true;
                this.popenemyThree.paused = true;
                this.popenemyFour.paused = true;
                this.popenemyFive.paused = true;
                this.popenemySix.paused = true;
                this.popenemySeven.paused = true;
                this.popenemyEight.paused = true;
                this.popenemyNine.paused = true;
                this.popenemyTen.paused = true;
            }else{
                this.physics.resume();
                this.tweenManager.resumeAll();
                console.log("killcnt" + this.KILLCOUNTLEVEL);
                if(this.KILLCOUNTLEVEL < 10 + this.levelValue){
                    this.popenemyOne.paused = false;
                    this.popenemySix.paused = false;
                }else if(this.KILLCOUNTLEVEL > 10 && this.KILLCOUNTLEVEL < 20 + this.levelValue){
                    this.popenemyTwo.paused = false;
                    this.popenemyFive.paused = false;
                }else if(this.KILLCOUNTLEVEL > 20 && this.KILLCOUNTLEVEL < 30 + this.levelValue){
                    this.popenemyThree.paused = false;
                    this.popenemySeven.paused = false;
                }else if(this.KILLCOUNTLEVEL > 30 && this.KILLCOUNTLEVEL < 40 + this.levelValue){
                    this.popenemyEight.paused = false;
                    this.popenemyFour.paused = false;
                }else if(this.KILLCOUNTLEVEL > 40 && this.KILLCOUNTLEVEL < 50 + this.levelValue){
                    this.popenemyTen.paused = false;
                }
            }
    }

    SetUserValues(KILLCOUNT : number,DEATHNUMBER : number,LEVELMAX : number,BULLETDAMAGE : number,BOSSKILL : number,scoreValue : number){
      console.log(KILLCOUNT);
      sessionStorage.setItem('score', scoreValue.toString());
      sessionStorage.setItem('killcount', KILLCOUNT.toString());
      sessionStorage.setItem('deathNumber', DEATHNUMBER.toString());
      sessionStorage.setItem('levelMax', LEVELMAX.toString());
      sessionStorage.setItem('BulletDammage', BULLETDAMAGE.toString());
      sessionStorage.setItem('BossKillNbr', BOSSKILL.toString());
      console.log('storage ok');
      // btn apear
      // console.log(this.storageservice.GetIdTknStorage());
      // this.userservice.GetUserById(this.storageservice.GetIdTknStorage()).subscribe({
      //   next : (data) => {
      //     this.user = data;
      //   },
      //   error : (err:any)=>{console.log('missing tkn');
      //   },
      //   complete:()=>{
      //     this.statservice.GetStatsById(this.user.id).subscribe({
      //       next : (data)=>{
      //         this.stat = data;
      //         console.log(this.stat);
      //       },
      //       error : (err:any)=>{console.log('missing user');
      //       },
      //       complete:()=>{
      //         this.userservice.UpdateScore(this.user.id, scoreValue).subscribe({
      //           next : (data)=>{
      //             console.log(data);
      //             //btn apear
      //             const element = document.getElementById('rebtn');
      //             if (element) {
      //             element.style.visibility = 'visible';
      //             }
      //           }
      //         })
      //       }
      //     })
      //   }
      // });
    }
}


@Component({
  selector: 'app-metalbirds',
  templateUrl: './metalbirds.component.html',
  styleUrls: ['./metalbirds.component.scss']
})
export class MetalbirdsComponent implements OnDestroy,OnInit{
  phaserGame?: Phaser.Game;
  config: Phaser.Types.Core.GameConfig;

  constructor() {

    this.config = {
      type: Phaser.AUTO,
      pixelArt : true,
      width : 366,
      height : 445,
      backgroundColor : '#2eb4f2',
      fps:{
        target: 50,
        forceSetTimeOut: true
      },
      input:{
        gamepad: true
      },
      scale:{
        mode : Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      scene: [ MainScene as any],
      
      //parent: 'gameContainer',
      physics: {
        default: 'arcade',
        arcade: {
          debug : false
        }
      }
    };
  }
  ngOnInit() {
    this.phaserGame = new Phaser.Game(this.config);
  }
  ngOnDestroy() {
    this.phaserGame!.destroy(true, false);
  }
}

