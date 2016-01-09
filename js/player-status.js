'use strict';

let PlayerStateBase = function(){ this.construct(); };
(function(PlayerState){
    PlayerState.prototype.construct = function() {
    };

    PlayerState.prototype.connect = function(player) {
    	this.player = player;
    };
})(PlayerStateBase);

/**
 * @class PlayerStateAlive
 */
let PlayerStateAlive = function(){ this.construct(); };
PlayerStateAlive.prototype = new PlayerStateBase();
(function(PlayerStateAlive){
    PlayerStateAlive.prototype.construct = function() {
    };
})(PlayerStateAlive);

/**
 * @class PlayerStateSpownDelay
 */
let PlayerStateSpownDelay = function(){ this.construct(); };
PlayerStateSpownDelay.prototype = new PlayerStateBase();
(function(PlayerState){
    PlayerState.prototype.construct = function() {
    	this.remainFrames = Settings.defaultFPS * 2;
    };

    PlayerState.prototype.update = function(App) {
    	if (--(this.remainFrames) < 0) {
    		this.player.changeState(new PlayerStateAlive());
    	}
    };

    PlayerState.prototype.drawProvide = function(App, ctx) {
    	if (this.remainFrames % 4 >= 2) {
    		this.player.drawDefault(App, ctx);
    	}
    };

    PlayerState.prototype.requestHitTestProvide = function(App, entity) {
        return false;
    };
})(PlayerStateSpownDelay);

/**
 * @class new PlayerStateDestroyed
 */
let PlayerStateDestroyed = function(){ this.construct(); };
PlayerStateDestroyed.prototype = new PlayerStateBase();
(function(PlayerState){
    const TIUN_FRAMES = Settings.defaultFPS * 0.5;
    const TIUN_DISTNANCE_MAX = 100;
    
    const TIUN_CIRCLES = [
        {
            r: 7,
            distances: [
                {x: -Math.sin(Math.PI * 45.0 / 180.0), y: -Math.sin(Math.PI * 45.0 / 180.0)},
                {x: 0.0, y: -1.0},
                {x: Math.sin(Math.PI * 45.0 / 180.0), y: -Math.sin(Math.PI * 45.0 / 180.0)},
                {x: 1.0, y: 0.0},
                {x: Math.sin(Math.PI * 45.0 / 180.0), y: Math.sin(Math.PI * 45.0 / 180.0)},
                {x: 0.0, y: 1.0},
                {x: -Math.sin(Math.PI * 45.0 / 180.0), y: Math.sin(Math.PI * 45.0 / 180.0)},
                {x: -1.0, y: 0.0},
            ]
        },
        {
            r: 10,
            distances: [
                {x: -Math.sin(Math.PI * 45.0 / 180.0)/2, y: -Math.sin(Math.PI * 45.0 / 180.0)/2},
                {x: 0.0, y: -0.5},
                {x: Math.sin(Math.PI * 45.0 / 180.0)/2, y: -Math.sin(Math.PI * 45.0 / 180.0)/2},
                {x: 0.5, y: 0.0},
                {x: Math.sin(Math.PI * 45.0 / 180.0)/2, y: Math.sin(Math.PI * 45.0 / 180.0)/2},
                {x: 0.0, y: 0.5},
                {x: -Math.sin(Math.PI * 45.0 / 180.0)/2, y: Math.sin(Math.PI * 45.0 / 180.0)/2},
                {x: -0.5, y: 0.0},
            ]
        },
    ];

    PlayerState.prototype.construct = function() {
        this.passedFrames = 0;
    	this.remainFrames = Settings.defaultFPS * 2;
    };

    PlayerState.prototype.update = function(App) {
        this.passedFrames++;
    	if (--(this.remainFrames) < 0) {
    		App.respownPlayer();
    	}
    };

    PlayerState.prototype.shotProvide = function(App) {

    };

    PlayerState.prototype.moveProvide = function(App) {

    };

    PlayerState.prototype.requestHitTestProvide = function(App, entity) {
        return false;
    };

    PlayerState.prototype.drawProvide = function(App, ctx) {
        if (this.passedFrames < TIUN_FRAMES) {
            const rate = easeOutQuad(this.passedFrames, 0, 1, TIUN_FRAMES);
            const alphatmp = ctx.globalAlpha;
      		ctx.strokeStyle = '#000000';
            ctx.globalAlpha = 1.0 - rate;

            const distance_base = rate * TIUN_DISTNANCE_MAX;
            
    		const x = this.player.position.x;
    		const y = this.player.position.y;
            for (const circleSet of TIUN_CIRCLES) {
                const r = circleSet.r;
                for (const distance of circleSet.distances) {
                    const distance_x = distance_base * distance.x;
                    const distance_y = distance_base * distance.y;

            		ctx.beginPath();
            		ctx.ellipse(x + distance_x, y + distance_y, r, r, 0, 0, 2 * Math.PI);
            		ctx.stroke();
                }
            }
            ctx.globalAlpha = alphatmp;
        }
    };

    PlayerState.prototype.hitTestProvide = function(App, entity) {
        return false;
    }
})(PlayerStateDestroyed);
