'use strict';

function vector2(x, y) {
	return {x:x, y:y};
}

function vector2len(v) {
	return Math.sqrt(v.x * v.x + v.y * v.y);
}

function easeOutQuad(t, b, c, d) {
    return -c *(t/=d)*(t-2) + b;
}