import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as Phaser from 'phaser';
import { Scale } from 'phaser';
import { UserService } from 'src/app/services/user.service';
import { StatsService } from 'src/app/services/stats.service';
import { SessionStorageService } from 'src/app/services/session-storage.service';
import { Iuser } from 'src/app/interface/iuser';
import { Istats } from 'src/app/interface/istats';
import { __awaiter } from 'tslib';

class MainScene extends Phaser.Scene {
    constructor(
        private userservice : UserService,
        private statservice : StatsService,
        private storageservice : SessionStorageService
        ) {
            super({ key: 'main' });        
    }
    //parent!: Phaser.GameObjects.Sprite;
    //child!: Phaser.GameObjects.Sprite;

    user! : Iuser;
    stat! : Istats;
    isGameOverButtonApear : boolean = false;
    tweenManager! : Phaser.Tweens.TweenManager;
    camera! : Phaser.Cameras.Scene2D.Camera;
    startPoint! : Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
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
    _WEAPONUPGRADE_SPEED : number = 0;
    _WEAPONUPGRADE_DGTS : number = 0;
    _HEALTHPGRADE : number = 0;
    maxHealth : number = 4;
    playerDamage : number = 1;
    isMoveAuto : boolean = false;
    isOnMobile : boolean = false;
    isGameFinish : boolean = false;
    //INPUT
    btnPause!: Phaser.GameObjects.Sprite
    btnQuit!: Phaser.GameObjects.Sprite
    cursor :  Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    touchup : boolean = false;
    touchdown : boolean = false;
    touchleft : boolean = false;
    touchright : boolean = false;
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
    popenemyEleven! : Phaser.Time.TimerEvent;
    popenemyTwelve! : Phaser.Time.TimerEvent;
    popbossOne! : Phaser.Time.TimerEvent;
    popBonusCounter : number = 0; //pop weapon counter
    
    scoreValue : number = 0;
    levelValue : number = 1;
    skyIsVisible : boolean = true;
    //pointxt! : Phaser.GameObjects.BitmapText;
    scoretext! : any;
    leveltxt! : any;
    levelNextxt! : any;
    gameovertxt! : Phaser.GameObjects.BitmapText;
    goscoretxt! : any;
    starttxt! : any;
    testtxt!: Phaser.GameObjects.BitmapText;
    upgradetxt!: Phaser.GameObjects.BitmapText;
    chronotxt!: Phaser.GameObjects.BitmapText;
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
    mask! : Phaser.GameObjects.TileSprite; //transition img
    sky! : Phaser.GameObjects.TileSprite; //decor
    killwall : any; 
    chrono : number = 0;
    isChronoStart : boolean = false;
    isControlsOperational : boolean = false;
  
    preload() {
      this.load.bitmapFont('customfont','assets/img/gb.png', 'assets/img/gb.xml');
      this.load.bitmapFont('customfont2','assets/img/bmf.png', 'assets/img/bmf.xml');
      this.load.spritesheet('player', 'assets/img/f16.png', {frameWidth : 31, frameHeight : 48});
      this.load.spritesheet('bullet','assets/img/bullet01.png', {frameWidth : 16, frameHeight : 16});
      this.load.spritesheet('fatbullet','assets/img/bullet01.png', {frameWidth : 32, frameHeight : 32});
      this.load.spritesheet('largebullet','assets/img/bullet01.png', {frameWidth : 32, frameHeight : 16});
    //   this.load.spritesheet('xplose','assets/img/Xplose.png', {frameWidth : 160, frameHeight : 160});
      this.load.spritesheet('xplose','assets/img/explosion-g.png', {frameWidth : 32, frameHeight : 32});
      this.load.spritesheet('city','assets/img/bckgrnd.png', {frameWidth : 366, frameHeight : 445});
      this.load.spritesheet('sky','assets/img/sky.png', {frameWidth : 415, frameHeight : 558});
      this.load.spritesheet('airplanes','assets/img/ironbirds2.png', {frameWidth : 40, frameHeight : 48});
      this.load.spritesheet('fatbirds','assets/img/fatbirds2.png', {frameWidth : 190, frameHeight : 180});
      this.load.spritesheet('dragon','assets/img/dragon.png', {frameWidth : 90, frameHeight : 90});
      this.load.spritesheet('fruits','assets/img/obj18.png', {frameWidth : 18, frameHeight : 18});
      this.load.spritesheet('button','assets/img/Btns.png', {frameWidth : 92, frameHeight : 92});
      this.load.spritesheet('buttoninterface','assets/img/Btns2.png', {frameWidth : 70, frameHeight : 43});
      this.load.spritesheet('body','assets/img/interface.png', {frameWidth : 457, frameHeight : 242});
    }

    create() {
        this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
        this.tweenManager = this.tweens;
        //CAMERA
        this.camera = this.cameras.main;
        this.camera.flashEffect.start(); //FLASH
        //this.camera.setViewport(0, 0, 366, 445); //bordure externe visible l'ors du tremblement
        //SIZE PC OR MOBILE 
        const { width, height } = this.scale;
        if(this.isOnMobile){
            this.scale.setGameSize(366,700)
            this.camera.setViewport(0, 0, 366, 700); //bordure externe visible l'ors du tremblement
        }else{
            this.scale.setGameSize(366,445)
            this.camera.setViewport(0, 0, 366, 445); //bordure externe visible l'ors du tremblement
        }
        this.isOnMobile ? this.scale.setGameSize(366,700) : this.scale.setGameSize(366,445);
        console.log(height);
        //PLAYER
        this.startPoint = this.physics.add.sprite(183, 350,'airplanes').setDepth(2).setSize(5,5).setVisible(false);
        this.startPoint.body.enable = false
        this.player = this.physics.add.sprite(183, 350,'airplanes').setDepth(2);
        this.player.body.setSize(8, 20);                                    
        this.player.setData('health', 4);
        this.player.setCollideWorldBounds(true);
        this.player.visible = true;
        //SET WEAPON
        this.armEvoCount = 1;
        //BAR RECTANGLES
        this.menuBar = this.add.rectangle(183,10,366,30,0x282828).setScrollFactor(0,0).setDepth(4);
        this.healthBar = this.add.rectangle(65,12,120,10,0xB14F37).setScrollFactor(0,0).setDepth(5);
        this.killwall = this.physics.add.sprite(183,500,'bullet', 100).setDepth(0);
        this.killwall.body.setSize(445,20);
        //BULLETS
        this.bullets = this.physics.add.group();
        this.bullets2 = this.physics.add.group();
        this.enemies = this.physics.add.group();
        this.impacts = this.physics.add.group();
        this.weaponUp = this.physics.add.group();
        //DECOR
        var filterLign = this.add.tileSprite(183,222.5,366,445,'city', 11).setDepth(3).setAlpha(0.04);
        this.city = this.add.tileSprite(183,222.5,366,445,'city', 0).setDepth(0).setAlpha(0.8);
        this.mask = this.add.tileSprite(183,222.5,366,445,'city', 10).setDepth(3).setAlpha(0);
        this.sky = this.add.tileSprite(183,222.5,366,445,'sky', 0)
        this.sky.alpha = 0.4;
        //TEXT
        this.scoretext =  this.add.bitmapText(300, 12,'customfont','score:0',10).setTintFill(0xffffff).setOrigin(0.5, 0.5).setDepth(4);
        this.leveltxt =  this.add.bitmapText(183, 12,'customfont','level:0',10).setTintFill(0xffffff).setOrigin(0.5, 0.5).setDepth(4);
        this.starttxt =  this.add.bitmapText(183, 200,'customfont2','3',60).setTintFill(0xffffff).setOrigin(0.5, 0.5).setDepth(4);
        this.gameovertxt = this.add.bitmapText(183, 200,'customfont2','GAME OVER',64).setTintFill(0xffffff).setOrigin(0.5, 0.5).setDepth(4).setVisible(false);
        this.goscoretxt = this.add.bitmapText(183, 246,'customfont2','',60).setTintFill(0xffffff).setOrigin(0.5, 0.5).setDepth(4).setVisible(false);
        //this.pointxt = this.add.bitmapText(183, 260,'customfont','9',10).setTintFill(0xffffff).setOrigin(0.5, 0.5);
        //this.testtxt = this.add.bitmapText(183, 30,'customfont','TEST',10).setTintFill(0xffffff).setOrigin(0.5, 0.5);
        this.upgradetxt = this.add.bitmapText(183, 150,'customfont','TEST',10).setTintFill(0xffffff).setOrigin(0.5, 0.5).setDepth(4).setVisible(false);;
        this.levelNextxt = this.add.bitmapText(183, 200,'customfont2','LEVEL 2',60).setTintFill(0xffffff).setOrigin(0.5, 0.5).setAlpha(0);
        this.chronotxt = this.add.bitmapText(183, 215,'customfont','time',10).setTintFill(0xffffff).setOrigin(0.5, 0.5).setDepth(4).setAlpha(0);
        //ANIMS
        this.anims.create({
          key: 'plyrleft',
          frames: this.anims.generateFrameNumbers('airplanes',{frames: [0, 1]}),
          frameRate: 8,
        });
        this.anims.create({
            key: 'burst',
            frames: this.anims.generateFrameNumbers('bullet',{frames: [252, 277, 302, 327]}),
            frameRate: 15,
            repeat: -1
        });
        this.anims.create({
            key: 'startburst',
            frames: this.anims.generateFrameNumbers('largebullet',{frames: [250 ,322, 346]}),
            frameRate: 16,
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
            frames: this.anims.generateFrameNumbers('xplose',{frames: [0, 1, 2, 3, 4, 5, 6, 7]}),
            frameRate: 15,
            //repeat: -1
        });
        this.anims.create({
            key: 'takeItem',
            frames: this.anims.generateFrameNumbers('bullet',{frames: [ 634,618 ,593, 618, 593, 618]}),
            frameRate: 8,
            // repeat: -1
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
        //REACTOR
        this.reactor = this.physics.add.sprite(183, 275,'largebullet').setDepth(2).setScale(1.5).setVisible(false);
        this.reactor.anims.play('startburst',true);
        //SHOOT CADENCE
        this.timingShoot = this.time.addEvent({delay : 250, callback: ()=> this.shootAction() , loop : true, paused : false});
        //ENEMY POP
        this.popenemyOne = this.time.addEvent({delay : 3000 , callback: () => this.setEnemyOne() , loop : true, paused : true});
        this.popenemyTwo = this.time.addEvent({delay : 2500 , callback: ()=> this.setEnemyTwo() , loop : true, paused : true});
        this.popenemyThree = this.time.addEvent({delay : 5000 , callback: ()=> this.setEnemyThree() , loop : true, paused : true});
        this.popenemyFour = this.time.addEvent({delay : 3000 , callback: ()=> this.setEnemyFour() , loop : true, paused : true,});
        this.popenemyFive = this.time.addEvent({delay : 10000, callback: ()=> this.setEnemyFive() , loop : true, paused : true,});
        this.popenemySix = this.time.addEvent({delay : 10000 , callback: ()=> this.setEnemySix() , loop : true, paused : true,});
        this.popenemySeven = this.time.addEvent({delay : 3000 , callback: ()=> this.setEnemySeven() , loop : true, paused : true});
        this.popenemyEight = this.time.addEvent({delay : 10000 , callback: ()=> this.setEnemyEight() , loop : true, paused : true});
        this.popenemyNine = this.time.addEvent({delay : 100000 ,callback: ()=> this.setEnemyNine() , loop : true, paused : false});
        this.popenemyTen = this.time.addEvent({delay : 3000 ,callback: ()=> this.setEnemyTen() , loop : true , paused : true});
        this.popenemyEleven = this.time.addEvent({delay : 80000 ,callback: ()=> this.setEnemyEleven() , loop : true , paused : true});
        this.popenemyTwelve = this.time.addEvent({delay : 30000 ,callback: ()=> this.setEnemyTwelve() , loop : true , paused : true});
        //IMPACT COLLISION
        const self = this;
        //ENEMY DAMAGE
        this.physics.add.overlap(this.bullets, this.enemies, function(blt:any,nmy:any){
            if(nmy.data.list.health > 0){
                nmy.data.list.health -= self.playerDamage;
                self._BULLETDAMAGE += self.playerDamage;
                self.scoreValue += self.levelValue;
                self.createImpact(nmy);
                self.textPoint(self.levelValue, nmy);
                blt.destroy();
            }else{
                self.popBonusCounter += 1;
                self.KILLCOUNTLEVEL += 1;
                self._KILLCOUNT +=1;
                if(nmy.data.list.type == 'boss'){
                    self.scoreValue += self.levelValue * 5;
                    self.textPoint(self.levelValue * 5, nmy);
                    console.log(nmy);
                    
                    self._BOSSKILL += 1;
                    self.bossDestruction(nmy);
                    self.destroyAll();
                    console.log("level Value : " +self.levelValue);
                }else{
                    self.scoreValue += self.levelValue * 2;
                    self.textPoint(self.levelValue * 2, nmy);
                    self.createExplose(nmy);
                    nmy.destroy();
                }
            }
            self.scoretext.setText(`SCORE:${self.scoreValue}`);
        });
        //PLAYER DAMAGE
        this.physics.add.overlap(this.player, this.bullets2, function(plyr:any, blt:any){
          blt.destroy();
          // Réinitialisation des propriétés de l'effet de secousse de la caméra
          self.camera.shakeEffect.reset();
          // Configuration des paramètres de l'effet de secousse
          self.camera.shakeEffect.start(800, 0.01);
          if(plyr.data.list.health > 1){
              plyr.data.list.health -= 1;
              (self.armEvoCount > 1)? self.armEvoCount -= 1 : self.armEvoCount = 1;
              self.createImpact(plyr);
          }else{
              self.timingShoot.paused = true;
              plyr.data.list.health = 0;
              self._DEATHNUMBER++;
              self.armEvoCount = 99;
              self.createExplose(plyr);
              console.log(plyr);
              self.GameOverScene();
        }
         console.log('plyr hlth : '+ plyr.data.list.health);
        });
        //OVERLAP ITEM
        this.physics.add.overlap(this.player, this.weaponUp, function(plyr:any, box:any){
            self.ispopBonus = true;
            self.createImpactItem(plyr);
            self.popBonusCounter = 0;
            //console.log(box);
            
            switch (box.data.list.typeCount) {
                case 0: 
                if(plyr.data.list.health >= self.maxHealth){
                    plyr.data.list.health = plyr.data.list.health
                self.textPoint('FULL', plyr);
                }else{
                plyr.data.list.health += 1;
                self.textPoint('+', plyr);
                }    
                console.log('fruits');
                box.destroy();
                    break;
                case 1: self.armEvoCount += 1;
                console.log('weapon+');
                box.destroy();
                (self.armEvoCount >= 8)? self.textPoint('FULL', plyr) : self.textPoint('UPGRADE', plyr);
                    break;
                case 2: self.timingShoot.timeScale += 0.1;
                self._WEAPONUPGRADE_SPEED += 1;
                self.weaponUp.clear(true,true);
                self.textPoint('LEVEL UP !', plyr)
                console.log(box);
                    break;
                case 3: self.playerDamage += 0.1;
                self._WEAPONUPGRADE_DGTS += 1;
                self.weaponUp.clear(true,true);
                self.textPoint('LEVEL UP !', plyr)
                console.log(box);
                    break;
                case 4: self.maxHealth += 1; 
                self._HEALTHPGRADE += 1;
                plyr.data.list.health += 1;
                self.weaponUp.clear(true,true);
                self.textPoint('LEVEL UP !', plyr)
                console.log(box);
                    break;
                default:break;
            }
        });
        //KILLWALL 
        this.physics.add.overlap(this.killwall, this.enemies, function(kllwll, enmy){
          enmy.destroy();
        })
        this.physics.add.overlap(this.killwall, this.bullets2, function(kllwll, blt){
            blt.destroy();
        })
        //STRT POINT
        this.physics.add.overlap(this.player, this.startPoint, function(plyr : any, point : any){
            self.isMoveAuto = false;
            self.popUpgrade();
            point.body.enable = false;
        })
        //INPUT
        this.input.keyboard?.on('keydown-SPACE',()=> this.PauseGameAction()); // SPACE
        this.input.keyboard?.on('keydown-B',()=> {console.log(this.popenemyOne);}); // B
        this.cursor = this.input.keyboard?.createCursorKeys(); // ARROWS
        //HTMLBTN
        // const btn = document.getElementById('ctnbtn');
        //if(btn){btn.addEventListener('click', ()=>{this.PauseGameAction()});};
        this.add.sprite(183, 568, 'body',0).setScale(1.02).setDepth(7);
        //#region TOUCH INPUT
        let btnquitposition = (this.isOnMobile) ? 476 : 400;
        this.btnQuit = this.add.sprite(323, btnquitposition, 'buttoninterface',3).setScale(1.02).setDepth(9).setAlpha(1).setInteractive({ pixelPerfect: true }).setVisible(false); //BTN UP
        this.btnQuit.on('pointerup', function (event : any){
            //self.btnQuit.setTint(0xff0000);
            self.btnQuit.setFrame(5);
            // window.location.href = '/home';
            window.location.href = '/metalbirds_angular/';
        });
        this.btnQuit.on('pointerover', function (event : any){self.btnQuit.setFrame(4);});
        this.btnQuit.on('pointerout', function (event : any){
            //self.btnQuit.clearTint();
            self.btnQuit.setFrame(3);
         });
        this.btnPause = this.add.sprite(42.50, 476, 'buttoninterface',0).setScale(1.02).setDepth(9).setAlpha(1).setInteractive({ pixelPerfect: true }); //BTN UP
        this.btnPause.on('pointerup', function (event : any){
            //self.btnPause.setTint(0xff0000);
            self.btnPause.setFrame(2);
            self.PauseGameAction();
        });
        this.btnPause.on('pointerover', function (event : any){self.btnPause.setFrame(1);});
        this.btnPause.on('pointerout', function (event : any){
             //self.btnPause.clearTint();
             self.btnPause.setFrame(0);
         });
        const btnUp = this.add.sprite(185, 504, 'button',0).setDepth(8).setAlpha(1).setInteractive({ pixelPerfect: true }); //BTN UP
        btnUp.on('pointerover', function (event : any){
            self.touchup = true;
            btnUp.setTint(0xff0000);
            btnUp.setFrame(1);
        });
        btnUp.on('pointerout', function (event : any){
           self.touchup = false;
            btnUp.clearTint();
            btnUp.setFrame(0);
        });
        const btnDown = this.add.sprite(185, 633, 'button',0).setDepth(8).setAlpha(1).setInteractive({ pixelPerfect: true }); //BTN DOWN
        btnDown.flipY = true;
        btnDown.on('pointerover', function (event : any){
            self.touchdown = true;
            btnDown.setTint(0xff0000);
            btnDown.setFrame(1);
        });
        btnDown.on('pointerout', function (event : any){
           self.touchdown = false;
            btnDown.clearTint();
            btnDown.setFrame(0);
        });
        const btnUpRight = this.add.sprite(238, 513, 'button',2).setDepth(8).setAlpha(1).setInteractive({ pixelPerfect: true }); //BTN DOWN
        btnUpRight.on('pointerover', function (event : any){
            self.touchup = true;
            self.touchright = true;
            btnUpRight.setTint(0xff0000);
            btnUpRight.setFrame(3);
        });
        btnUpRight.on('pointerout', function (event : any){
           self.touchup = false;
           self.touchright = false;
            btnUpRight.clearTint();
            btnUpRight.setFrame(2);
        });
        const btnRight = this.add.sprite(248, 570, 'button',0).setDepth(8).setAlpha(1).setInteractive({ pixelPerfect: true }); //BTN UP
        console.log(btnRight);
        btnRight.rotation = 1.58;
        btnRight.on('pointerover', function (event : any){
            self.touchright = true;
            btnRight.setTint(0xff0000);
            btnRight.setFrame(1);
        });
        btnRight.on('pointerout', function (event : any){
           self.touchright = false;
            btnRight.clearTint();
            btnRight.setFrame(0);
        });
        const btnDownRight = this.add.sprite(238, 624, 'button',2).setDepth(8).setAlpha(1).setInteractive({ pixelPerfect: true }); //BTN UP
        btnDownRight.flipY = true;
        btnDownRight.on('pointerover', function (event : any){
            self.touchright = true;
            self.touchdown = true;
            btnDownRight.setTint(0xff0000);
            btnDownRight.setFrame(3);
        });
        btnDownRight.on('pointerout', function (event : any){
           self.touchright = false;
           self.touchdown = false;
            btnDownRight.clearTint();
            btnDownRight.setFrame(2);
        });
        const btnUpLeft = this.add.sprite(129, 513, 'button',2).setDepth(8).setAlpha(1).setInteractive({ pixelPerfect: true }); //BTN UP
        btnUpLeft.flipX = true;
        btnUpLeft.on('pointerover', function (event : any){
            self.touchup = true;
            self.touchleft = true;
            btnUpLeft.setTint(0xff0000);
            btnUpLeft.setFrame(3);
        });
        btnUpLeft.on('pointerout', function (event : any){
           self.touchup = false;
           self.touchleft = false;
            btnUpLeft.clearTint();
            btnUpLeft.setFrame(2);
        });
        const btnLeft = this.add.sprite(118, 567, 'button',0).setDepth(8).setAlpha(1).setInteractive({ pixelPerfect: true }); //BTN UP
        btnLeft.rotation = -1.58;
        btnLeft.on('pointerover', function (event : any){
            self.touchleft = true;
            btnLeft.setTint(0xff0000);
            btnLeft.setFrame(1);
        });
        btnLeft.on('pointerout', function (event : any){
           self.touchleft = false;
            btnLeft.clearTint();
            btnLeft.setFrame(0);
        });
        const btnDownLeft = this.add.sprite(129, 624, 'button',2).setDepth(8).setAlpha(1).setInteractive({ pixelPerfect: true }); //BTN UP
        btnDownLeft.flipY= true;
        btnDownLeft.flipX= true;
        btnDownLeft.on('pointerover', function (event : any){
            self.touchleft = true;
            self.touchdown = true;
            btnDownLeft.setTint(0xff0000);
            btnDownLeft.setFrame(3);
        });
        btnDownLeft.on('pointerout', function (event : any){
           self.touchleft = false;
           self.touchdown = false;
            btnDownLeft.clearTint();
            btnDownLeft.setFrame(2);
        });
        //#endregion

        //this.setBossFour();
        //this.setEnemyThree()
        //var testObj = this.physics.add.sprite(183, 350,'largebullet', 238).setDepth(2).setScale(2);
        //testObj.anims.play('startburst',true);
        //this.setBossOne()
        //this.setDragon();
        this.StartScene();
        //END CREATE
    }

    override update() {
        if(!this.isPaused){
            this.city.tilePositionY -= (1 + this.backGroundSpeed);
            this.sky.tilePositionY -= (3 + this.backGroundSpeed);
            this.mask.tilePositionY -= 100;
            (this.isChronoStart)? this.chrono ++ : this.chrono = this.chrono;
            this.popBoss();
            this.popBonusWeapon();
            this.LevelNext();
            this.SceneAction();
            this.playerMovement();
        }else{
            this.city.tilePositionY = this.city.tilePositionY;
            this.sky.tilePositionY = this.sky.tilePositionY;
            this.mask.tilePositionY = this.mask.tilePositionY;
            this.chrono = this.chrono;
        }
        this.healthBar.width = this.player.data.list['health'] * 20;
        //console.log(this.maxHealth);
        this.reactor.x = this.player.x;
        this.reactor.y = this.player.y + 32;
        this.leveltxt.setText(`LVL:${this.levelValue}`);
        this.levelNextxt.setText(`LEVEL ${this.levelValue + 1}`);
        this.upgradetxt.setText([
            `UPGRADE`,
            `  dammage:lvl ${this._WEAPONUPGRADE_DGTS}`,
            `  SPEED:    lvl ${this._WEAPONUPGRADE_SPEED}`,
            `  HEALTH:  lvl ${this._HEALTHPGRADE}`
        ]);
        //this.testtxt.setText(`popBonusCtn:${this.popBonusCounter}killcountlvl:${this.KILLCOUNTLEVEL}`);
        this.chronotxt.setText(`time : ${this.formatChronoTime(this.chrono)}`);

        if(!this.skyIsVisible){
            if(this.sky.alpha > 0){this.sky.alpha -= 0.005;}
        }else{
            if(this.sky.alpha < this.skyAlphaMax){this.sky.alpha += 0.005;}
        }
        if(this.drgBody.length > 0){
            Phaser.Actions.Angle(this.drgBody, 1.5, 0.1,17,2);
            //destroyDragon(drgBody);
        }
        (this.isMoveAuto)? this.playerAuto() : '';
        //END UPDATE
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
              this.isChronoStart = true;
              clearInterval(start);
              this.isControlsOperational = true;
          };
      },1000);
    } 

    SceneAction(){
        let rnd = Math.floor(Math.random() * 2); // 0 | 1
        //console.log(this.popenemyOne);
        this.popenemyOne.timeScale = this.levelValue ;
        this.popenemyTwo.timeScale = this.levelValue ;
        this.popenemyThree.timeScale = this.levelValue ;
        this.popenemyFour.timeScale = this.levelValue ;
        this.popenemyFive.timeScale = this.levelValue ;
        this.popenemySix.timeScale = this.levelValue ;
        this.popenemySeven.timeScale = this.levelValue ;
        this.popenemyEight.timeScale = this.levelValue ;
        this.popenemyNine.timeScale = this.levelValue ;
        this.popenemyTen.timeScale = this.levelValue ;
        this.popenemyEleven.timeScale = this.levelValue ;
        this.popenemyTwelve.timeScale = this.levelValue ;
        
        switch (this.KILLCOUNTLEVEL) {
        case 0 :
        // this.popenemyOne.paused = false;
        (this.levelValue >= 2 && rnd == 0) ? this.popenemyTwelve.paused = false : this.popenemyOne.paused = false;
        this.popenemySix.paused = false;

        this.ispopBoss = true;
        //console.log('salut');
            break;
        case this.levelValue * 10: console.log(this.levelValue * 10 +" Kill");
        this.cloudOpacityChange();
        this.popenemyTwo.paused = false;
        this.popenemyFive.paused = false;

        this.popenemyOne.paused = true;
        this.popenemySix.paused = true;
        this.popenemyTwelve.paused = true;
            break;
        case this.levelValue * 20:console.log(this.levelValue * 20 +" Kill");
        this.cloudOpacityChange();
        this.popenemyThree.paused = false;
        this.popenemySeven.paused = false;

        this.popenemyOne.paused = true;
        this.popenemyTwo.paused = true;
        this.popenemyFive.paused = true;
        this.popenemySix.paused = true;
        this.popenemyTwelve.paused = true;
            break;
        case this.levelValue * 25: console.log(this.levelValue * 25 +" Kill");

        this.popenemyOne.paused = true;
        this.popenemyTwo.paused = true;
        this.popenemyFive.paused = true;
        this.popenemySix.paused = true;
        this.popenemySeven.paused = true;
        this.popenemyTwelve.paused = true;
            break;
        case this.levelValue * 30: console.log(this.levelValue * 30 +" Kill");
        this.cloudOpacityChange();
        this.popenemyEight.paused = false;
        this.popenemyFour.paused = false;

        this.popenemyOne.paused = true;
        this.popenemyTwo.paused = true;
        this.popenemyThree.paused = true;
        this.popenemyFive.paused = true;
        this.popenemySix.paused = true;
        this.popenemySeven.paused = true;
        this.popenemyNine.paused = true;
        this.popenemyTwelve.paused = true;
            break;
        case this.levelValue * 40: console.log(this.levelValue * 40 +" Kill");
        this.cloudOpacityChange();
        this.popenemyTen.paused = false;

        this.popenemyOne.paused = true;
        this.popenemyTwo.paused = true;
        this.popenemyFour.paused = true;
        this.popenemyFive.paused = true;
        this.popenemySix.paused = true;
        this.popenemySeven.paused = true;
        this.popenemyEight.paused = true;
        this.popenemyNine.paused = true;
        this.popenemyTwelve.paused = true;
            break;
        case this.levelValue * 50: console.log(this.levelValue * 50 +" Kill");
        this.cloudOpacityChange();
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
        this.popenemyTwelve.paused = true;
            break;
        default:
            break;
      }
    }

    LevelNext(){
    if(this.itsIncrementNextLvlValue){
        if(this.KILLCOUNTLEVEL >= 50){this.levelValue++;this._LEVELMAX++}
        this.isControlsOperational = true;
        this.KILLCOUNTLEVEL = 0;
        this.itsIncrementNextLvlValue = false;
        this.city.alpha = 1;
        this.levelNextxt.alpha = 0;
        this.chronotxt.alpha = 0;
        this.mask.alpha = 0;
        this.isChronoStart = true;
        this.camera.flashEffect.start(); //FLASH
        this.weaponUp.clear(true,true);
        console.log('hola');
      }
    }

    nextLevelAction(){
    let newSpeed = 20;
    this.isMoveAuto = true;
    this.startPoint.body.enable = true;
    //this.city.setTintFill(1);
    var cloudAccelerate = this.tweens.addCounter({
        from: this.backGroundSpeed,
        to: newSpeed,
        duration: 15000,
        ease: 'expo.out',
            onUpdate: (tween:any) => {
                this.isControlsOperational = false;
                this.levelNextxt.alpha = this.sky.alpha
                this.chronotxt.alpha = this.sky.alpha
                this.isChronoStart = false;
                this.mask.alpha = 1;
                this.popBonusCounter = 0;
                this.city.alpha = 0.2;
                this.popenemyNine.paused = true;
                this.popenemyEleven.paused = true;
                this.reactor.visible = true;
                const value = Math.round(tween.getValue());
                this.backGroundSpeed = value;
            },
            onComplete: (tween:any) => {
                this.reactor.visible = false;
                this.city.setFrame(this.levelValue >= 8 ? 8 : this.levelValue - 1);
                this.timingShoot.paused = false;
                newSpeed = 0;
                this.backGroundSpeed = 0;
                cloudAccelerate.stop();
                this.popenemyNine.paused = false;
                this.popenemyEleven.paused = false;
                this.itsIncrementNextLvlValue = true;
            }
        });
    }

    GameOverScene(){
        if(!this.isGameFinish){
            console.log(this._KILLCOUNT);
            this.AllEnemyPaused();
            this.isChronoStart = false;
            this.player.visible = false;
            this.isGameFinish = true;
            this.isControlsOperational = false;
            setTimeout(()=>{this.destroyAll();},1500);
            setTimeout(()=>{
                this.mask.setAlpha(0.8);
                this.mask.setFrame(9);
                this.goscoretxt.setText(this.scoreValue);
                this.gameovertxt.visible = true;
                this.goscoretxt.visible = true;
                this.physics.pause();
                this.tweenManager.pauseAll();
                this.chronotxt.setAlpha(1);
                this.btnPause.setVisible(false);
                this.btnQuit.setVisible(true);
                this.buttonMenuIsVisible(false,true);
            } , 4000)
            this.SetUserValues(this._KILLCOUNT,this._DEATHNUMBER,this._LEVELMAX,this._BULLETDAMAGE,this._BOSSKILL,this.scoreValue);
          }
    }

    playerMovement(){
        this.player.setVelocity(0); 
        this.player.setFrame(0);                  
        if(this.cursor!.up.isDown || this.touchup){                         
            this.player.setVelocityY(-100);
        }
        if(this.cursor!.down.isDown || this.touchdown){                         
            this.player.setVelocityY(100);
        }                      
        if(this.cursor!.left.isDown || this.touchleft){
            this.player.setVelocityX(-100);
            this.player.setFrame(1);
        }                 
        if(this.cursor!.right.isDown || this.touchright){
            this.player.setVelocityX(100);
            this.player.setFrame(3);
        }  
    }

    playerAuto(){
        this.physics.moveToObject(this.player, this.startPoint, 100);
    }

    popUpgrade(){
        this.weaponUp.create(100,250,'fruits',15).setScale(2).setData('typeCount', 2);
        this.weaponUp.create(180,250,'fruits',16).setScale(2).setData('typeCount', 3);
        this.weaponUp.create(260,250,'fruits',17).setScale(2).setData('typeCount', 4);
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
    if(this.KILLCOUNTLEVEL >= this.levelValue * 50){
        if(this.ispopBoss){
            console.log(this.ispopBoss);
            switch (this.levelValue) {
                case 1: this.setBossOne();
                this.ispopBoss = false;
                    break;
                case 2: this.setBossTwo();
                this.ispopBoss = false;
                this.popenemyEleven.paused = false;           
                    break;
                case 3: this.setBossThree();
                this.ispopBoss = false;
                    break;
                case 4: this.setBossFour();
                this.ispopBoss = false;
                    break;
                case 5: this.setDragon();
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
        //this.armEvoCount = 8
        switch (this.armEvoCount) {
        case 1: 
            var fire = this.bullets.create(this.player.body.position.x + 3, this.player.body.position.y,'bullet', 404).setSize(3, 6).setOffset(7,5).setScale(2);
            setTimeout(() => {fire.destroy();}, 1000);
            fire.setCollideWorldBounds(true);
            // console.log(fire);
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
            var fire = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 625, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire2 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 625, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire3 = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire4 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            setTimeout(() => {fire.destroy();fire2.destroy();fire3.destroy;fire4.destroy();}, 1000);
            fire.body.velocity.x = 120;
            fire.body.velocity.y = -300;
            fire2.body.velocity.x = -120;
            fire2.body.velocity.y = -300;
            fire2.flipX = true;
            fire3.body.velocity.y = -300;
            fire4.body.velocity.y = -300;
            break;
        case 4:
            var fire = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 675, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire2 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 675, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire3 = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 763, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire4 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 763, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire5 = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire6 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            setTimeout(() => {fire.destroy();fire2.destroy();fire3.destroy();fire4.destroy();fire5.destroy();fire6.destroy();}, 1000);
            fire.body.velocity.x = 120;
            fire.body.velocity.y = 300;
            fire2.body.velocity.x = -120;
            fire.flipX = true;
            fire2.body.velocity.y = 300;
            fire3.body.velocity.x = 180;
            fire4.body.velocity.x = -180;
            fire4.body.velocity.y = -300;
            fire4.flipX = true;
            fire3.body.velocity.y = -300;
            fire5.body.velocity.y = -300;
            fire6.body.velocity.y = -300;
            break;
        case 5:
            var fire0 = this.bullets!.create(this.player.body.position.x + 3, this.player.body.position.y,'bullet', 404).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 764, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire2 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 764, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire3 = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 763, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire4 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 763, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire5 = this.bullets.create(this.player.body.position.x + 14, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire6 = this.bullets.create(this.player.body.position.x - 10, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            setTimeout(() => {fire0.destroy();fire.destroy();fire2.destroy();fire3.destroy;fire4.destroy();fire5.destroy();fire6.destroy();}, 1000);
            fire0.body.velocity.y = -300;
            fire.body.velocity.x = 120;
            fire.body.velocity.y = 300;
            fire2.body.velocity.x = -120;
            fire.flipX = true;
            fire2.body.velocity.y = 300;
            fire3.body.velocity.x = 180;
            fire4.body.velocity.x = -180;
            fire4.body.velocity.y = -300;
            fire4.flipX = true;
            fire3.body.velocity.y = -300;
            fire5.body.velocity.y = -300;
            fire6.body.velocity.y = -300;
            break;
        case 6: 
            var fire0 = this.bullets.create(this.player.body.position.x + 3, this.player.body.position.y,'bullet', 404).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 764, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire2 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 764, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire25 = this.bullets.create(this.player.body.position.x, this.player.body.position.y + 8,'bullet', 675, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire3 = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 763, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire35 = this.bullets.create(this.player.body.position.x, this.player.body.position.y + 8,'bullet', 675, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire4 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 763, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire45 = this.bullets.create(this.player.body.position.x - 24, this.player.body.position.y,'bullet', 625, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire5 = this.bullets.create(this.player.body.position.x + 14, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire55 = this.bullets.create(this.player.body.position.x + 36, this.player.body.position.y,'bullet', 625, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire6 = this.bullets.create(this.player.body.position.x - 10, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            setTimeout(() => {fire0.destroy();fire.destroy();fire2.destroy();fire25.destroy();fire3.destroy();fire35.destroy();fire4.destroy();fire45.destroy();fire5.destroy();fire55.destroy();fire6.destroy();}, 1000);
            fire0.body.velocity.y = -300;
            fire.body.velocity.x = 120;
            fire.body.velocity.y = 300;
            fire.flipX = true;
            fire2.body.velocity.x = -120;
            fire2.body.velocity.y = 300;
            fire25.body.velocity.x = -280;
            fire25.body.velocity.y = 300;
            fire3.body.velocity.y = -300;
            fire35.body.velocity.x = 280;
            fire35.body.velocity.y = 300;
            fire35.flipX = true;
            fire3.body.velocity.x = 180;
            fire4.body.velocity.x = -180;
            fire4.body.velocity.y = -300;
            fire4.flipX = true;
            fire45.flipX = true;
            fire45.body.velocity.x = -180;
            fire45.body.velocity.y = -300;
            fire5.body.velocity.y = -300;
            fire55.body.velocity.x = 180;
            fire55.body.velocity.y = -300;
            fire6.body.velocity.y = -300;
            break;
        case 7:
            //
            var fire0 = this.bullets.create(this.player.body.position.x + 22, this.player.body.position.y,'bullet', 404).setSize(3, 6).setOffset(7,5).setScale(2);
            //dev LEFT
            var fire02 = this.bullets.create(this.player.body.position.x - 18, this.player.body.position.y,'bullet', 404).setSize(3, 6).setOffset(7,5).setScale(2);
            //DIAG BAS right
            var fire = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 764, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire1 = this.bullets.create(this.player.body.position.x, this.player.body.position.y + 10,'bullet', 678, true).setSize(3, 6).setOffset(7,5).setScale(2);
            //DIAG BAS Left
            var fire2 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 764, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire22 = this.bullets.create(this.player.body.position.x, this.player.body.position.y + 10,'bullet', 678, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire25 = this.bullets.create(this.player.body.position.x, this.player.body.position.y + 8,'bullet', 675, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire3 = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 763, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire35 = this.bullets.create(this.player.body.position.x, this.player.body.position.y + 8,'bullet', 675, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire4 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 763, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire45 = this.bullets.create(this.player.body.position.x - 24, this.player.body.position.y,'bullet', 625, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire5 = this.bullets.create(this.player.body.position.x + 10, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire55 = this.bullets.create(this.player.body.position.x + 36, this.player.body.position.y,'bullet', 625, true).setSize(3, 6).setOffset(7,5).setScale(2);
            var fire6 = this.bullets.create(this.player.body.position.x - 6, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
            setTimeout(() => {fire0.destroy();fire02.destroy();fire.destroy();fire1.destroy();fire2.destroy();fire22.destroy();fire25.destroy();fire3.destroy();fire35.destroy();fire4.destroy();fire45.destroy();fire5.destroy();fire55.destroy();fire6.destroy();}, 1000);
            fire0.body.velocity.y = -300;
            fire02.body.velocity.y = -300;
            fire.body.velocity.x = 120;
            fire.body.velocity.y = 300;
            fire1.body.velocity.x = 300;
            fire1.body.velocity.y = 120;
            fire.flipX = true;
            fire1.flipX = true;
            fire2.body.velocity.x = -120;
            fire2.body.velocity.y = 300;
            fire22.body.velocity.x = -300;
            fire22.body.velocity.y = 120;
            fire25.body.velocity.x = -280;
            fire25.body.velocity.y = 300;
            fire3.body.velocity.y = -300;
            fire35.body.velocity.x = 280;
            fire35.body.velocity.y = 300;
            fire35.flipX = true;
            fire3.body.velocity.x = 180;
            fire4.body.velocity.x = -180;
            fire4.body.velocity.y = -300;
            fire4.flipX = true;
            fire45.flipX = true;
            fire45.body.velocity.x = -180;
            fire45.body.velocity.y = -300;
            fire5.body.velocity.y = -300;
            fire55.body.velocity.x = 180;
            fire55.body.velocity.y = -300;
            fire6.body.velocity.y = -300;
            break;
            case 8:
                //
                var fire0 = this.bullets.create(this.player.body.position.x + 28, this.player.body.position.y,'bullet', 404).setSize(3, 6).setOffset(7,5).setScale(2);
                var fire00 = this.bullets.create(this.player.body.position.x + 3, this.player.body.position.y,'bullet', 281).setSize(3, 6).setOffset(7,5).setScale(2);
                //dev LEFT
                var fire02 = this.bullets.create(this.player.body.position.x - 24, this.player.body.position.y,'bullet', 404).setSize(3, 6).setOffset(7,5).setScale(2);
                //DIAG BAS right
                var fire = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 764, true).setSize(3, 6).setOffset(7,5).setScale(2);
                var fire1 = this.bullets.create(this.player.body.position.x, this.player.body.position.y + 10,'bullet', 678, true).setSize(3, 6).setOffset(7,5).setScale(2);
                //DIAG BAS Left
                var fire2 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 764, true).setSize(3, 6).setOffset(7,5).setScale(2);
                var fire22 = this.bullets.create(this.player.body.position.x, this.player.body.position.y + 10,'bullet', 678, true).setSize(3, 6).setOffset(7,5).setScale(2);
                var fire25 = this.bullets.create(this.player.body.position.x, this.player.body.position.y + 8,'bullet', 675, true).setSize(3, 6).setOffset(7,5).setScale(2);
                var fire3 = this.bullets.create(this.player.body.position.x + 8, this.player.body.position.y,'bullet', 763, true).setSize(3, 6).setOffset(7,5).setScale(2);
                var fire32 = this.bullets.create(this.player.body.position.x, this.player.body.position.y +30,'bullet', 678, true).setSize(3, 6).setOffset(7,5).setScale(2);
                var fire33 = this.bullets.create(this.player.body.position.x , this.player.body.position.y +20,'bullet', 767, true).setSize(3, 6).setOffset(7,5).setScale(2);
                var fire35 = this.bullets.create(this.player.body.position.x, this.player.body.position.y + 8,'bullet', 675, true).setSize(3, 6).setOffset(7,5).setScale(2);
                var fire4 = this.bullets.create(this.player.body.position.x - 2, this.player.body.position.y,'bullet', 763, true).setSize(3, 6).setOffset(7,5).setScale(2);
                var fire42 = this.bullets.create(this.player.body.position.x, this.player.body.position.y +30,'bullet', 678, true).setSize(3, 6).setOffset(7,5).setScale(2);
                var fire44 = this.bullets.create(this.player.body.position.x, this.player.body.position.y + 20,'bullet', 767, true).setSize(3, 6).setOffset(7,5).setScale(2);
                var fire45 = this.bullets.create(this.player.body.position.x - 24, this.player.body.position.y,'bullet', 625, true).setSize(3, 6).setOffset(7,5).setScale(2);
                var fire5 = this.bullets.create(this.player.body.position.x + 14, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
                var fire55 = this.bullets.create(this.player.body.position.x + 36, this.player.body.position.y,'bullet', 625, true).setSize(3, 6).setOffset(7,5).setScale(2);
                var fire6 = this.bullets.create(this.player.body.position.x - 10, this.player.body.position.y,'bullet', 404, true).setSize(3, 6).setOffset(7,5).setScale(2);
                setTimeout(() => {fire00.destroy();fire0.destroy();fire02.destroy();fire.destroy();fire1.destroy();fire2.destroy();fire22.destroy();fire25.destroy();fire3.destroy();fire32.destroy();fire33.destroy();fire35.destroy();fire4.destroy();fire42.destroy();fire44.destroy();fire45.destroy();fire5.destroy();fire55.destroy();fire6.destroy();}, 1000);
                fire00.body.velocity.y = -300;
                fire0.body.velocity.y = -300;
                fire02.body.velocity.y = -300;
                fire.body.velocity.x = 120;
                fire.body.velocity.y = 300;
                fire1.body.velocity.x = 300;
                fire1.body.velocity.y = 120;
                fire.flipX = true;
                fire1.flipX = true;
                fire2.body.velocity.x = -120;
                fire2.body.velocity.y = 300;
                fire22.body.velocity.x = -300;
                fire22.body.velocity.y = 120;
                fire25.body.velocity.x = -280;
                fire25.body.velocity.y = 300;
                fire3.body.velocity.y = -300;
                fire3.body.velocity.x = 180;
                fire32.body.velocity.x = 200;
                fire32.body.velocity.y = -200;
                fire33.body.velocity.x = 180;;
                fire35.body.velocity.x = 280;
                fire35.body.velocity.y = 300;
                fire35.flipX = true;
                fire4.body.velocity.x = -180;
                fire4.body.velocity.y = -300;
                fire42.body.velocity.x = -200;
                fire42.body.velocity.y = -200;
                fire4.flipX = true;
                fire44.body.velocity.x = -180;;
                fire45.flipX = true;
                fire45.body.velocity.x = -180;
                fire45.body.velocity.y = -300;
                fire5.body.velocity.y = -300;
                fire55.body.velocity.x = 180;
                fire55.body.velocity.y = -300;
                fire6.body.velocity.y = -300;
                break;
        case 9 : this.armEvoCount = 8;
            break;
        case 99 : 
            break;
        default: this.armEvoCount = this.armEvoCount;
            break;
        }

      }else{
        console.log('bullets not found');
        // console.log(this);
      }
    };

    textPoint(value:any, enmy:any){
    var rndX = Phaser.Math.Between(-15,15);      
    var ptxt = this.add.bitmapText(183, 260,'customfont2','9',15).setTintFill(0xffffff).setOrigin(0.5, 0.5).setDepth(2).setText(value);
    ptxt.x = enmy.x + rndX;
    ptxt.y = enmy.y;
    this.tweens.add({
        targets: ptxt,
        y: enmy.y - 50,  // Position y finale
        duration: 500,  // Durée de l'animation en millisecondes
        ease: 'Linear',  // Type d'interpolation
        onComplete: () => {
            ptxt.destroy();
        }
      });
    }

    cloudOpacityChange(){
    this.skyIsVisible = false;
    setTimeout(()=>{
        this.skyIsVisible = true;
        this.skyAlphaMax = 0.4;
    },5000)
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
        enemy.setData('health', 1 + this.levelValue);
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
        enemy.setData('health', 3 + this.levelValue);
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
        enemy.setData('health', 7 + this.levelValue);
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
        enemy.setData('health', 2 + this.levelValue);
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
        enemy.setData('health', 4 + this.levelValue);
        enemy.flipY = true;
        this.tweens.add({
            targets: enemy,
            x : {value : rndX2 , ease : 'expo.in'},
            y : {value : 140 , ease : 'quint.out'},
            duration : 8000
        });
        //enemy.body.velocity.y = 40;
        setTimeout(() => {
            //if(enemy.data != undefined){
                this.ShootEnemyFive(enemy);
            //}
        }, 2000);
    }

    setEnemySix(){
        let rnd = Math.floor(Math.random() * 2) 
        let posX = (rnd == 0)? 0 : 366;
        var rndX = Phaser.Math.Between(50,316);         
        var rndY = Phaser.Math.Between(90,200);         
        var enemy = this.enemies.create(posX,250,'airplanes',6);
        enemy.body.setSize(25, 35);
        enemy.setData('health', 5 + this.levelValue);
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
            var rndpopx = Phaser.Math.Between(10,260);         
            var rndtimeShoot = Phaser.Math.Between(3000,8000); 
            var enemy = this.enemies.create(rndpopx,0,'airplanes',7);
            enemy.body.setSize(25, 35);
            enemy.setData('health', 2 + this.levelValue);
            enemy.flipY = true;
            
            this.tweens.add({
                targets: enemy,
                props: {
                    x: { value: rndpopx + 100, duration: 2000,},
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
        enemy.setData('health', 7 + this.levelValue);
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
        enemy.setData('health', 19 + this.levelValue);
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
        enemy.setData('health', 4 + this.levelValue);
        enemy.flipY = true;
        enemy.body.setSize(30, 35);
        enemy.body.velocity.y = rndyvel;
        enemy.body.velocity.x = rndxvel;
        setTimeout(()=>{    
            if(enemy.data != undefined){
                enemy.setCollideWorldBounds(true);
                enemy.body.bounce.y = 1;
                enemy.body.bounce.x = 1;
            }
            },1000);
        this.ShootEnemyTen(enemy);  
    }

    setEnemyEleven(){
        // var rndyvel = Phaser.Math.Between(3000,8000);         
        let rnd = Math.floor(Math.random() * 2); // 0 | 1
        let posX = (rnd == 0)? 0 : 366;
        console.log(rnd);
        var enemy = this.enemies.create(posX,200,'fatbirds',7);
        enemy.body.setSize(70, 20);
        enemy.setData('health', 50 + this.levelValue);
        this.tweens.add({
            targets: enemy,
            x : {value : 173 , ease : 'back.out'},
            y : {value : 50 , ease : 'quint.in'},
            duration : 8000
        });
        enemy.body.velocity.y = 15;
        setTimeout(() => {
            if(enemy.data != undefined){
                //this.ShootEnemyFour(enemy);
                this.ShootAnyRightBottom(enemy,0,0,150,'bullet',211,600,5,5000,true)
            }
        }, 1500);
    }

    setEnemyTwelve(){
        var rndx = Phaser.Math.Between(50,316);         
        let rnd = Math.floor(Math.random() * 2); // 0 | 1
        let posX = (rnd == 0)? 50 : 316;
        console.log(rnd);
        var enemy = this.enemies.create(posX,400,'fatbirds',5);
        enemy.setData('health', 20 + this.levelValue);
        enemy.body.setSize(70, 20);
        enemy.flipY = true;
        this.tweens.add({
            targets: enemy,
            x : {value : rndx , ease : 'back.out'},
            y : {value : 50 , ease : 'circle.in'},
            duration : 8000,
            onComplete: (tween:any) => {
            }
        });
        setTimeout(() => {
            if(enemy.data != undefined){
                enemy.body.velocity.y = 80;
                this.ShootEnemyFour(enemy);
            }
        }, 1500);
    }

    setBossOne(){
        var enemy = this.enemies.create(173,0,'fatbirds',3).setDepth(2);
        var canon = this.bullets2.create(173,0,'bullet',9);
        enemy.body.setSize(85, 40)
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

    setBossTwo(){
        var enemy = this.enemies.create(173,0,'fatbirds',2).setDepth(2);
        var canon = this.bullets2.create(173,0,'bullet',9);
        enemy.body.setSize(85, 40)
        enemy.setData('health', 300);
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
                this.ShootAnyRightBottom(enemy,0,0,150,'bullet',261,450,30,5000,true)
                this.ShootEnemyFive(enemy);
        },2000);
    };

    setBossThree(){
        var enemy = this.enemies.create(173,0,'fatbirds',1).setDepth(2);
        var canon = this.bullets2.create(173,0,'bullet',100);
        enemy.body.setSize(180, 10)
        enemy.setData('health', 500);
        enemy.setData('type', 'boss');
        enemy.body.velocity.y = 80;
        canon.body.velocity.y = 80;
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
            //this.ShootBossOne(canon, enemy);
            this.ShootAnyRightBottom(enemy,-70,0,200,'bullet', 155, 1000, 4,6000, false);
            this.ShootAnyRightBottom(enemy,70,0,200,'bullet', 155, 1000, 4,6000, false);
            this.ShootAnyRightBottom(enemy,0,0,100,'bullet', 136, 200, 8,10000, true);
            this.ShootAnyRightBottom(enemy,0,0,310,'bullet', 254, 0, 2,15000, false);
            this.ShootEnemyFive(enemy);
        },2000);
    };

    setBossFour(){
        var enemy = this.enemies.create(173,0,'fatbirds',0).setDepth(2);
        var canon = this.bullets2.create(173,0,'bullet',100).setDepth(8);
        enemy.body.setSize(180, 40)
        enemy.setData('health', 600);
        enemy.setData('type', 'boss');
        enemy.body.velocity.y = 80;
        canon.body.velocity.y = 80;
            this.tweens.add({
                targets: canon,
                angle: { start: 180, to: 0 },
                ease: 'sine.inout',
                yoyo: true,
                repeat: -1,
                duration: Phaser.Math.Between(1000, 3000)
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
                //this.ShootBossOne(canon, enemy);
                //this.ShootEnemyFive(enemy);
                this.ShootAnyRightBottom(enemy, 0, 0,150,'bullet',254,2000,5,2000,true);
                this.ShootAnyRightBottom(enemy, -80, 0,150,'bullet',253,1200,5,5000,false);
                this.ShootAnyRightBottom(enemy, 80, 0,150,'bullet',253,1200,5,7000,false);
                //this.ShootAnyRightBottom(enemy, 0, 0,200,'bullet',275,200,5,7000,false);
                this.ShootAnyCanon(enemy,canon, 50);
                // console.log(canon.angle);
        },2000);
    };

    setWeaponUp(){      
        //var rndX = Phaser.Math.Between(100,266);      
        var rndXChoices = (this.armEvoCount < 3)? 1 : Math.floor(Math.random() * 2); // 0 | 1 
        var rndyvel = Phaser.Math.Between(10,50);         
        var rndxvel = Phaser.Math.Between(-130,130);
              console.log(rndXChoices);
        switch (rndXChoices) {
            case 0: 
            var rnd = Phaser.Math.Between(0,12);      
            var box = this.weaponUp.create(173,10,'fruits',rnd).setScale(2).setData('typeCount', 0);
            console.log(box);
            break;
            case 1: 
            var box = this.weaponUp.create(173,10,'fruits',13).setScale(2).setData('typeCount', 1);
            console.log(box);
            break;
            // case 2: var box = this.weaponUp.create(173,10,'fruits',14).setScale(2);
            //     break;
            default:
                break;
        }  
        // var box = this.weaponUp.create(173,10,'box',0).setScale(0.8);
        box.setCollideWorldBounds(true);
        box.body.setSize(20, 20);
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
                this.drgBody[i].setData('health', 1000);
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
        this.ShootAnyRightBottom(this.drgBody[14],0,0,150,'bullet',385,800,6,10000,true);
        this.ShootAnyRightBottom(this.drgBody[14],0,0,100,'bullet',381,200,2,3000,true);
        //destroyDragon(drgBody);
    };
    //SHOOT
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////                                                                                                              by tristan roel
    ShootAnyRightBottom(enmy : any, positionShootX : number,positionShootY : number, bulletVlctyY : number, keyStringShoot : string, frameShootNbr : number, intervalNbr : number, blltNbrForBreak : number, timePause : number, isTargeted : boolean){
        let breakTimeNbr = 0;
        let isShoot = true;

        var shoot = setInterval(()=>{
            if(isShoot){
                var bulet = this.bullets2.create(enmy.x + positionShootX,enmy.y + positionShootY, keyStringShoot,frameShootNbr).setDepth(1);
                bulet.body.setSize(6, 6);
                bulet.setScale(2);
                bulet.flipY = true;
                breakTimeNbr++;
                if(isTargeted){
                    this.physics.moveToObject(bulet, this.player, bulletVlctyY);
                }else{
                     bulet.body.velocity.y = bulletVlctyY;
                }
                if(enmy.data == undefined || enmy.data.list.health <= 0){bulet.destroy();clearInterval(shoot)};
                setTimeout(()=>{bulet.destroy();},15000);

                switch (breakTimeNbr) {
                    case blltNbrForBreak:
                        isShoot = false;
                        setTimeout(()=>{
                            breakTimeNbr = 0;
                            isShoot = true;
                            console.log('pause?'+ isShoot);
                            
                        },timePause)
                        break;
                    default:
                        break;
                }
            }
            },intervalNbr);
        
    }

    ShootAnyCanon(enmy : any,canon : any, bulletVelocity : number){
        console.log(canon.angle);
        var shoot = setInterval(()=>{
            var bulet = this.bullets2.create(canon.x,canon.y,'bullet', 377).setDepth(1).setScale(2);
            bulet.body.setSize(4,4);
            this.physics.velocityFromAngle(canon.angle, bulletVelocity, bulet.body.velocity);
            if(enmy.data == undefined || enmy.data.list.health <= 0){bulet.destroy();clearInterval(shoot)};
            setTimeout(() => {bulet.destroy();},8000);
        }, 100);
    }

    ShootEnemyOne(enmy : any){
        var bulet = this.bullets2.create(enmy.x,enmy.y,'bullet').setDepth(1);
        bulet.anims.play('bullet1', true);
        bulet.body.setSize(6, 6);
        bulet.setScale(2);
        setTimeout(()=>{bulet.destroy();},7000);
        this.physics.moveToObject(bulet, this.player, 160);
    }

    ShootEnemyTwo(enmy : any){
        var bulet = this.bullets2.create(enmy.x,enmy.y,'bullet').setDepth(1);
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
            buletOne.body.velocity.y = 100;
            buletTwo.body.velocity.y = 100;
            buletTwo.body.velocity.x = -30;
            buletThree.body.velocity.y = 100;
            buletThree.body.velocity.x = 30;
            if(enmy.data == undefined){this.destroyEnmyBullet(buletOne,buletTwo,buletThree,fire),clearInterval(fire)};
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
        var bulet = this.bullets2.create(enmy.x,enmy.y,'bullet').setDepth(1);
        bulet.anims.play('bullet4', true);
        bulet.body.setSize(6, 6);
        bulet.setScale(2);
        setTimeout(()=>{bulet.destroy();},7000);
        this.physics.moveToObject(bulet, this.player, 100);
    }

    ShootEnemyFive(enmy : any){
        var shoot = setInterval(()=>{
            var bulet = this.bullets2.create(enmy.x,enmy.y,'bullet').setDepth(1).setScale(2).setSize(6, 6);
            bulet.anims.play('bullet5', true);
            setTimeout(()=>{bulet.destroy();},7000);
            if(enmy.data == undefined || enmy.data.list.health <= 0){bulet.destroy();clearInterval(shoot)}
            else{
                this.physics.moveToObject(bulet, this.player, 100);
            }
        },2000);
    }

    ShootEnemySix(enmy : any){
            var shoot = setInterval(()=>{
                var bulet = this.bullets2.create(enmy.x,enmy.y,'fatbullet').setDepth(1);
                bulet.anims.play('bullet6', true);
                bulet.body.setSize(12, 12);
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
            var bulet = this.bullets2.create(enmy.x + rndX,enmy.y,'bullet', 281).setDepth(1);
            bulet.body.setSize(6, 6);
            bulet.body.velocity.y = 110;
            bulet.flipY = true;
            bulet.setScale(2);
            setTimeout(()=>{bulet.destroy();},7000);
            if(enmy.data == undefined || enmy.data.list.health <= 0){bulet.destroy();clearInterval(shoot)};
        },1000);
        setTimeout(()=>{clearInterval(shoot);},3000);
    }

    ShootEnemyEight(canon : any,enmy : any){
        var shoot = setInterval(()=>{
            
        var bulet = this.bullets2.create(canon.x,canon.y,'bullet', 127).setDepth(1);
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
        var bulet = this.bullets2.create(canon.x,canon.y,'bullet', 377).setDepth(1);
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
            if(enmy.data != undefined){
                var bulet = this.bullets2.create(enmy.x,enmy.y,'bullet').setDepth(1);
                bulet.anims.play('bullet10', true);
                bulet.body.setSize(6,8);
                bulet.setScale(2);
                bulet.body.velocity.y = 100;
                setTimeout(()=>{bulet.destroy();},7000);
            }else{
                clearInterval(shoot)
            }
            if(enmy.data == undefined){
            };
        }, 3000);
    }

    ShootBossOne(canon:any, enmy:any){
        let gunType = false;
        let nbr = 400;
        var shootType = setInterval(()=>{
            nbr = Phaser.Math.Between(200,1000);         
            gunType = !gunType;
        },5000);
        var shoot = setInterval(()=>{
            if(canon != undefined){
                if(gunType){
                    var bulet = this.bullets2.create(canon.x,canon.y,'bullet', 200).setDepth(1).setScale(2);
                    bulet.body.setSize(6,6);
                    bulet.anims.play('bulletBossOne',true);
                    this.physics.velocityFromAngle(canon.angle, 50, bulet.body.velocity);
                    setTimeout(() => {bulet.destroy();},5000);
                }else{
                    var bulet2 = this.bullets2.create(canon.x,canon.y,'bullet', 252).setDepth(1).setScale(2);
                    bulet2.body.setSize(6,9);
                    bulet2.body.velocity.y = 150;
                    bulet2.flipY = true;
                    setTimeout(() => {bulet2.destroy();},5000);
                }
                if(enmy.data == undefined || enmy.data.list.health <= 0){
                    canon.destroy();
                    clearInterval(shoot);
                    clearInterval(shootType)};
            }
        }, nbr);
    }

    ShootDragon(dragon : any){
        var shoot = setInterval(()=>{
            var fire = this.bullets2.create(dragon.x, dragon.y + 40, 'fatbullet').setDepth(1);
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
        enmy.setTintFill(0.24, 0.24, 0.24, 1);
        var destruct = setInterval(()=>{
            var rnd = Phaser.Math.Between(-80,80);    
            var rnd2 = Phaser.Math.Between(-80,80);    
            var ipct = this.impacts.create(enmy.x + rnd,enmy.y + rnd2,'xplose').setDepth(2).setScale(2);
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
        },6000)
    }

    createImpact(enmy:any){
        var rnd = Phaser.Math.Between(-10,10);    
        var rnd2 = Phaser.Math.Between(-10,10);    
        var ipct = this.impacts.create(enmy.x + rnd, enmy.y + rnd2,'bullet').setDepth(3);
        ipct.setScale(2);
        ipct.anims.play('impactzero', true);

        if(enmy.data.list.health >= 0){
         enmy.setTintFill(0xffffff,0xffffff,0xffffff,0xffffff);
         setTimeout(()=>{ enmy.clearTint();},100)
        }else{
            if(enmy.data.list.type == 'boss'){
                enmy.setTintFill(0.24, 0.24, 0.24, 1);
            }
        }
        setTimeout(() => {
            // enmy.clearTint();
            ipct.destroy();
        }, 600);
    }

    createImpactItem(enmy:any){
        var rnd = Phaser.Math.Between(-8,8);    
        var rnd2 = Phaser.Math.Between(-8,8);    
        var ipct = this.impacts.create(enmy.x + rnd,enmy.y + rnd2,'bullet').setDepth(3);
        ipct.setScale(2);
        ipct.anims.play('takeItem', true);
        setTimeout(() => {
            ipct.destroy();
        }, 600);
    }

    createExplose(enmy:any){
        var xplose = this.impacts.create(enmy.x,enmy.y,'xplose').setDepth(1);;
        xplose.anims.play('xplosion', true);
        xplose.setScale(2);
        setTimeout(() => {
            xplose.destroy();
        }, 600);
    }

    destroyAll(){
        for (let index = 0; index < this.enemies.children.entries.length; index++) {
            this.bossDestruction(this.enemies.children.entries[index]); 
        }
        //for (let index = 0; index < this.bullets2.children.entries.length; index++) {
            //this.bullets2.children.entries[index].destroy(); 
            this.bullets2.clear(true,true);
        //}
    }

    PauseGameAction(){
        if(this.isControlsOperational){
            this.isPaused = !this.isPaused; // Inverse l'état de pause lorsque la touche espace est enfoncée
            if(this.isPaused){
                this.btnQuit.setVisible(true);
                this.upgradetxt.setVisible(true);
                this.physics.pause();
                this.tweenManager.pauseAll();
                this.scene.pause();
                setTimeout(()=>{
                    this.scene.resume();
                },250)
                this.isChronoStart = false;
                this.chronotxt.setAlpha(1);
                this.buttonMenuIsVisible(true,true)
                this.mask.setFrame(9);
                this.mask.setAlpha(1);
                this.AllEnemyPaused();
            }else{
                console.log("killcnt" + this.KILLCOUNTLEVEL);
                this.btnQuit.setVisible(false);
                this.upgradetxt.setVisible(false);
                this.physics.resume();
                this.tweenManager.resumeAll();
                this.isChronoStart = true;
                this.chronotxt.setAlpha(0);
                this.buttonMenuIsVisible(false,false)
                this.mask.setFrame(10);
                this.mask.alpha = 0;
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
    }

    AllEnemyPaused(){
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
        this.popenemyEleven.paused = true;
        this.popenemyTwelve.paused = true;
    }

    formatChronoTime(time: number): string {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = Math.floor(time % 60);
      
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        const formattedSeconds = seconds.toString().padStart(2, '0');
      
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
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

    buttonMenuIsVisible(ContinuebtnIsVisible : boolean, QuitIsVisible : boolean){
        const element = document.getElementById('ctnbtn');
        const element2 = document.getElementById('rebtn');
        if(ContinuebtnIsVisible){
            if (element) {element.style.visibility = 'visible';}
        }else{
            if (element) {element.style.visibility = 'hidden';}
        }
        if(QuitIsVisible){
            if (element2) {element2.style.visibility = 'visible';}
        }else{
            if (element2) {element2.style.visibility = 'hidden';}
        }
            
          
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
    //   height : 700,
      backgroundColor : '#282828',
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
//by tristan roel
