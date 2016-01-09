'use strict';

let EnemyBase = function(){ this.constuct() };
(function(Enemy) {
	Enemy.prototype.life = 0;
	Enemy.prototype.size = 5;
	Enemy.prototype.position = vector2(0, 0);
    Enemy.prototype.construct = function() {};
    
    Enemy.prototype.requestHitTest = function(App, entity) {
    	entity.hitTest(App, this, this.resolveRectDefault());
    };
    Enemy.prototype.hitTest = function(App, entity, rect) {
    	this.hitTestDefault(App, entity, rect);
    };

    Enemy.prototype.hitTestDefault = function(App, entity, rect) {
    	const selfrect = this.resolveRectDefault();
    	if (
    		((rect.left - selfrect.right > 0)^(rect.right - selfrect.left >= 0))
    		&& ((rect.top - selfrect.bottom > 0)^(rect.bottom - selfrect.top >= 0)) 
    		) {
    		if (entity.damage) entity.damage(App, this);
    	}
    };

    Enemy.prototype.resolveRectDefault = function() {
    	const x = this.position.x;
    	const y = this.position.y;
    	const size = this.size;
    	return {
    		left  : x - size,
    		right : x + size,
    		top   : y - size,
    		bottom: y + size,
    	};
    };
})(EnemyBase);