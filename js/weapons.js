'use strict';

let WeaponBase = function(){ this.construct(); };
(function(Weapon){
    Weapon.prototype.construct = function() {};
    Weapon.prototype.connect = function() {};
})(WeaponBase);


// BeanGunWeapon
let BeanGunWeapon = function(){ this.construct(); }
BeanGunWeapon.prototype = new WeaponBase();

(function(Weapon){
	Weapon.prototype.power = 0;
	Weapon.prototype.vector = vector2(0.0, 0.0);
    
    const MAX_POWER_LEVEL = 3;
    const SPEED_MAP = [15, 15, 20, 20];
    const DAMAGE_MAP = [10, 10, 12, 15];
    const COOL_FRAME_MAP = [4, 4, 3, 3];
    const SHOTSIZE_MAP   = [5, 6, 5, 10];

    Weapon.prototype.construct = function() {
    	this.speed = 0;
        this.damage = 0;
        this.coolFrame = 0;
        this.shotsize = 0;
        this.shotNextTo = 0;
    };

	Weapon.prototype.draw = function(App, ctx) {
        
	};
	
	Weapon.prototype.updateParameter = function(App) {
        var level = App.player.powerLevel;
        if (level > MAX_POWER_LEVEL) level = MAX_POWER_LEVEL;

    	this.speed = SPEED_MAP[level];
        this.damage = DAMAGE_MAP[level];
        this.shotsize = SHOTSIZE_MAP[level];
        this.coolFrame = COOL_FRAME_MAP[level];
	};

	Weapon.prototype.update = function(App) {
        if (this.shotNextTo > 0) {
            --this.shotNextTo;
        }
	};

	Weapon.prototype.shot = function(App) {
        if (this.shotNextTo > 0) {
            return;
        }

        const position = App.player.position;
        
        const level = App.player.powerLevel;
        if (level == 0) {
            let shot = new BeanGunShot();
            shot.position = vector2(position.x, position.y);
            shot.vector = vector2(this.speed, 0);
            shot.damage = this.damage;
            shot.size = this.shotsize;
            App.addPlayerShot(shot);
        } else if (level == 1) {
            let shot = new BeanGunShot();
            shot.position = vector2(position.x + 2, position.y);
            shot.vector = vector2(this.speed, 0);
            shot.damage = this.damage;
            shot.size = this.shotsize;
            App.addPlayerShot(shot);

            shot = new BeanGunShot();
            shot.position = vector2(position.x, position.y);
            shot.vector = vector2(this.speed, 0);
            shot.damage = this.damage;
            shot.size = this.shotsize;
            App.addPlayerShot(shot);

            shot = new BeanGunShot();
            shot.position = vector2(position.x, position.y);
            shot.vector = vector2(this.speed, 0);
            shot.damage = this.damage;
            shot.size = this.shotsize;
            App.addPlayerShot(shot);
        } else if (level == 2) {
            let shot = new BeanGunShot();
            shot.position = vector2(position.x, position.y);
            shot.vector = vector2(this.speed, 0);
            shot.damage = this.damage;
            shot.size = this.shotsize;
            App.addPlayerShot(shot);

            shot = new BeanGunShot();
            shot.position = vector2(position.x, position.y);
            shot.vector = vector2(this.speed, -0.2);
            shot.damage = this.damage;
            shot.size = this.shotsize;
            App.addPlayerShot(shot);

            shot = new BeanGunShot();
            shot.position = vector2(position.x + 2, position.y);
            shot.vector = vector2(this.speed, 0.2);
            shot.damage = this.damage;
            shot.size = this.shotsize;
            App.addPlayerShot(shot);

            shot = new BeanGunShot();
            shot.position = vector2(position.x, position.y);
            shot.vector = vector2(this.speed, -1);
            shot.damage = this.damage;
            shot.size = this.shotsize;
            App.addPlayerShot(shot);

            shot = new BeanGunShot();
            shot.position = vector2(position.x, position.y);
            shot.vector = vector2(this.speed, 1);
            shot.damage = this.damage;
            shot.size = this.shotsize;
            App.addPlayerShot(shot);
        } 

        this.shotNextTo = this.coolFrame;
	};
})(BeanGunWeapon);
