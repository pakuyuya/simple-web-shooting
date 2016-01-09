'use strict';

let EnemyBase = function(){ this.construct(); };
(function(Enemy) {
    Enemy.prototype.life = 0;
    Enemy.prototype.size = 5;
    Enemy.prototype.construct = function() {
        this.position = vector2(0, 0)
    };
    
    Enemy.prototype.requestHitTest = function(App, entity) {
        return entity.hitTest(App, this, this.resolveRectDefault());
    };
    Enemy.prototype.hitTest = function(App, entity, rect) {
        return this.hitTestDefault(App, entity, rect);
    };

    Enemy.prototype.hitTestDefault = function(App, entity, rect) {
        const selfrect = this.resolveRectDefault();
        return ((rect.left - selfrect.right > 0)^(rect.right - selfrect.left >= 0))
            && ((rect.top - selfrect.bottom > 0)^(rect.bottom - selfrect.top >= 0));
    };

    Enemy.prototype.update = function(App) {
        this.updateDefault(App);
    };

    Enemy.prototype.updateDefault = function(App) {
        const appRect = App.getBoundsRect();
        const x = this.position.x;
        const y = this.position.y;
        const size = this.size;
        if (x < appRect.left - size || x > appRect.right + size
            || y < appRect.top - size || y > appRect.bottom + size) {
            App.removeEnemy(this);
        }
    };

    Enemy.prototype.damage = function(App, entity) {
        this.damageDefault(App, entity);
    };

    Enemy.prototype.damageDefault = function(App, entity) {
        const damage = ~~entity.damage;
        if (this.life -= damage <= 0) {
            this.destroy(App);
        }
    };

    Enemy.prototype.destroy = function(App) {
        this.destroyDefault(App);
    };
    Enemy.prototype.destroyDefault = function(App) {
        App.removeEnemy(this);
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

    Enemy.prototype.hit = function(App, entity) {
        if (entity.damage)
            entity.damage(App, this);
    };
})(EnemyBase);

let RectEnemy = function(){ this.construct(); };
RectEnemy.prototype = new EnemyBase();
(function(Enemy) {
    Enemy.prototype.life = 100;

    Enemy.prototype.construct = function() {};

    Enemy.prototype.draw = function(App, ctx) {
        const rect = this.resolveRectDefault();

        ctx.strokeStyle = '#000000';
        ctx.beginPath();
        ctx.rect(rect.left, rect.top, rect.right-rect.left, rect.bottom-rect.top);
        ctx.stroke();
    };

    Enemy.prototype.move = function(App) {
        this.position.x -= 3;
    };
})(RectEnemy);
