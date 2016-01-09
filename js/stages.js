'use strict';

let Stage = function(){};
(function(Stage) {
	Stage.prototype.init = function (App) {
	};

	Stage.prototype.preprocess = function() {

	};

	Stage.prototype.dispose = function () {

	};
})(Stage);

let DummyStage = function(){};
DummyStage.prototype = new Stage();
(function(DummyStage) {
	Stage.prototype.init = function (App) {
		if (!App.player) {
			App.player = new Player();
			App.player.position = vector2(100, 240);
			App.player.changeState(new PlayerStateSpownDelay());
			App.player.changeWeapon(new BeanGunWeapon());
            
            App.player.powerLevelUP(2);
		}
	};

	Stage.prototype.preprocess = function() {

	};

	Stage.prototype.dispose = function () {
        
	};
})(DummyStage);
