'use strict';

let Player = function(){ this.construct(); };
(function(Player) {
	const speedLevels = [4, 6, 8, 12];
	const powerLevelMax = 3;
	const playerRectOffsets = {left: -5, top: -5, right: 8, bottom: 5};

	Player.prototype.construct = function() {
		this.position = vector2(0, 0);
		this.speedLevel = 0;
		this.powerLevel = 0;
		this.state = null;
		this.defaultWeapon = null;
		this.weapon = null;

		this.initPowerStatus();
	};

	Player.prototype.initPowerStatus = function() {
		this.speed = speedLevels[0];
		this.weapon = this.defaultWeapon;
	};

	Player.prototype.speedLevelUP = function(increment) {
		if (increment === undefined) increment = 1;

		this.speedLevel += increment;

		if (this.speedLevel < 0) {
			this.speedLevel = 0;
		}
		if (this.speedLevel > speedLevels.length) {
			this.speedLevel = speedLevels.length - 1;
		}

		this.speed = speedLevels[this.speedLevel];
	};

	Player.prototype.powerLevelUP = function(increment) {
		if (increment === undefined) increment = 1;

		this.powerLevel += increment;

		if (this.powerLevel < 0) {
			this.powerLvel = 0;
		}
		if (this.speedLevel > powerLevelMax) {
			this.speedLevel = powerLevelMax - 1;
		}

		if (this.weapon && this.weapon.speedLevel) {
			this.weapon.update();
		}
	};

	Player.prototype.move = function(App) {
        if (this.state && this.state.moveProvide) {
            this.state.moveProvide(App);
        } else {
            this.moveDefault(App);
        }
    }

    Player.prototype.moveDefault = function(App) {
		const input = App.input;

        let x = this.position.x;
        let y = this.position.y;

        const speed = this.speed;
		if (input.isHold('left')) {
		    x -= speed;
		}
		if (input.isHold('right')) {
			x += speed;
		}
		if (input.isHold('up')) {
			y -= speed;
		}
		if (input.isHold('down')) {
			y += speed;
		}
        
        this.position = vector2(App.adjustX(x), App.adjustY(y));
	};

	Player.prototype.update = function(App) {
        const input = App.input;

		if (this.state && this.state.update)   this.state.update(App);
		if (this.weapon && this.weapon.update) this.weapon.update(App);

        if (input.isHold('a')) this.shot(App);
	};

	Player.prototype.draw = function(App, ctx) {
		if (this.weapon && this.weapon.draw) this.weapon.draw(App, ctx);

		if (this.state && this.state.drawProvide) {
			this.state.drawProvide(App, ctx);
		} else {
			this.drawDefault(App, ctx);
		}
	};

	Player.prototype.drawDefault = function(App, ctx) {
		ctx.beginPath();

		const playerRect = this.resolvePlayerRect.call(this);

		ctx.strokeStyle = '#000000';

		ctx.moveTo(playerRect.left,  playerRect.top);
		ctx.lineTo(playerRect.right, this.position.y);
		ctx.lineTo(playerRect.left,  playerRect.bottom);
		ctx.lineTo(playerRect.left,  playerRect.top);

		ctx.closePath();

		ctx.stroke();
	};


	Player.prototype.requestHitTest = function(App, entity) {
		if (this.state && this.state.requestHitTestProvide) {
			return this.state.requestHitTestProvide(App, entity);
		} else {
			return this.requestHitTestDefault(App, entity);
		}
	};

	Player.prototype.requestHitTestDefault = function(App, entity) {
		var playerRect = this.resolvePlayerRect();
		return entity.hitTest(App, this, playerRect);
	};

	Player.prototype.damage = function(App, entity) {
		if (this.state && this.state.damageProvide) {
			this.state.damageProvide();
		} else {
			this.damageDefault();
		}
	};

	Player.prototype.damageDefault = function(App, entity) {
		this.changeState(new PlayerStateDestroyed());
	};

	Player.prototype.shot = function(App) {
		if (this.state && this.state.shotProvide) {
			this.state.shotProvide(App);
		} else {
			this.shotDefault(App);
		}
	};

	Player.prototype.shotDefault = function(App) {
		if (this.weapon)
			this.weapon.shot(App);
	};

	Player.prototype.setDefaultWeapon = function(weapon) {
		this.defaultWeapon = weapon;
	};

	Player.prototype.changeWeapon = function(weapon) {
		if (this.weapon && this.weapon.leave)
			this.weapon.leave(App, this);

        if (weapon.connect)
            weapon.connect(App, this);
		
        if (weapon.updateParameter)
			weapon.updateParameter(App);

		this.weapon = weapon;
	};

	Player.prototype.changeState = function(state) {
		if (this.state && this.state.leave)
			this.state.leave(this);

		state.connect(this);
		if (state && state.update)
			state.update();

		this.state = state;
	};

	Player.prototype.resolvePlayerRect = function() {
		return {
			left   : this.position.x + playerRectOffsets.left,
			right  : this.position.x + playerRectOffsets.right,
			top    : this.position.y + playerRectOffsets.top,
			bottom : this.position.y + playerRectOffsets.bottom,
		};
	};

})(Player);
