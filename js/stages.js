'use strict';

let Stage = function(){};
(function(Stage) {
    Stage.prototype.init = function (App) {
    };

    Stage.prototype.dispose = function (App) {

    };
})(Stage);

let DummyStage = function(){};
DummyStage.prototype = new Stage();
(function(DummyStage) {
    Stage.prototype.init = function (App) {
        if (!App.player) {
            App.player = new Player();
            App.player.position = vector2(100, 240);
            App.respownPlayer();
            App.player.changeWeapon(new BeanGunWeapon());
            
            App.player.powerLevelUP(2);
        }
    };

    var f = false;
    Stage.prototype.preProcess = function(App) {
    	if (!(~~(Math.random()*10))) {
   			f = true;
    		const enemy = new RectEnemy();
    		const rect = App.getBoundsRect();
    		enemy.position = vector2(rect.right, ~~(Math.random()*rect.bottom));
    		App.addEnemy(enemy);
    	}
    };

    Stage.prototype.dispose = function (App) {
        
    };
})(DummyStage);
