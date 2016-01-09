'use strict';

let ShotBase = function(){ this.construct(); };
(function(Shot){
	Shot.prototype.size = 0;
	Shot.prototype.position = {x:0, y:0};
    Shot.prototype.construct = function() {
    };
})(ShotBase);


let BeanGunShot = function(){ this.construct(); }
BeanGunShot.prototype = new ShotBase();


(function(Shot){
	Shot.prototype.damage = 0;
	Shot.prototype.vector = vector2(0.0, 0.0);
    Shot.prototype.size = 0;

    Shot.prototype.construct = function() {
    };

	Shot.prototype.draw = function(App, ctx) {
		ctx.beginPath();

		ctx.strokeStyle = '#000000';

		const x = this.position.x;
		const y = this.position.y;
		const size = this.size;

		ctx.ellipse(x, y, size, size, 0, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.stroke();
	};
	Shot.prototype.update = function(App) {
		// this mis
		const appRect = App.getBoundsRect();
		const x = this.position.x;
		const y = this.position.y;
		const size = this.size;
		if (x < appRect.left - size || x > appRect.right + size
			|| y < appRect.top - size || y > appRect.bottom + size) {
			App.removePlayerShot(this);
		}
	};
	Shot.prototype.move = function(App) {
		this.position.x += this.vector.x;
		this.position.y += this.vector.y;
	};

	Shot.prototype.hitTest = function(App, entity, rect) {
		const x = this.position.x;
		const y = this.position.y;
		const size = this.size;
        const selfrect = {
        	left:   x - size,
        	right:  x + size,
        	top:    y - size,
        	bottom: y + size,
        };
        return ((rect.left - selfrect.right > 0)^(rect.right - selfrect.left >= 0))
            && ((rect.top - selfrect.bottom > 0)^(rect.bottom - selfrect.top >= 0));
	};

    Shot.prototype.hit = function(App, target) {
    	if (target.damage) target.damage(App, this);
    	App.removeShot(this);
    };
})(BeanGunShot);
