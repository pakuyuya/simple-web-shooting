'use strict';

$(function() {
	let $canvas = $('#canvas');
	App.init({canvas : $canvas.get(0)});

	App.changeStage(new Stage());

	App.run();
});