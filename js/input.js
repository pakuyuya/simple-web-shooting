'use strict';

var Input = Input || function(){ this.construct(); };
(function(Input){ 
    const keycodes = {
        37 : 'Left', 38 : 'Up', 39 : 'Right', 40 : 'Down',
        48 : '0', 49 : '1', 50 : '2', 51 : '3', 52 : '4', 53 : '5', 54 : '6', 55 : '7', 56 : '8', 57 : '9',
        65 : 'A', 66 : 'B', 67 : 'C', 68 : 'D', 69 : 'E', 70 : 'F', 71 : 'G', 72 : 'H', 73 : 'I', 74 : 'J', 75 : 'K', 76 : 'L', 77 : 'M',
        78 : 'N', 79 : 'O', 80 : 'P', 81 : 'Q', 82 : 'R', 83 : 'S', 84 : 'T', 85 : 'U', 86 : 'V', 87 : 'W', 88 : 'X', 89 : 'Y', 90 : 'Z',
    };
    Input.prototype.mouse  = { x:0, y:0 };
    Input.prototype.signal = {};
    Input.prototype.prevSignal = {};
    Input.prototype.keysignalmapping = {
        'Z' : 'a',
        'X' : 'b',
        'P' : 'pause',
        'Left' : 'left',
        'Up': 'up',
        'Right' : 'right',
        'Down' : 'down',
        'Mouse' : 'mouse',
        'MouseMove'  : 'mouseMove',
    };
    Input.prototype.construct = function() {
        for (let k in this.keysignalmapping) {
            this.signal[this.keysignalmapping[k]] = { fire : false, release : false, hold : false, };
        }
    };
    
    Input.prototype.watch = function(dom) {
        var domKeyhandling = document.createElement('input');
        Object.assign(domKeyhandling.style, {height : '1px', width: '1px', margin :'0', padding:'0', position : 'absolute', left:'-10000px'});

        document.body.appendChild(domKeyhandling);

        domKeyhandling.addEventListener('keydown', onkeydown);
        domKeyhandling.addEventListener('keyup', onkeyup);
        dom.addEventListener('click', onclick);
        dom.addEventListener('mouseup', onmouseup);
        dom.addEventListener('mousedown', onmousedown);
        dom.addEventListener('mousemove', onmousemove);
        
        dom.refWatcher  = this;
        dom.refInputDOM = domKeyhandling;
        domKeyhandling.refWatcher = this;
    };
    
    Input.prototype.fireSignal = function(signal) {
        if (this.isHold(signal)) {
            return;
        }
        this.signal[signal].fire = true;
        this.signal[signal].hold = true;
    };
    
    Input.prototype.pushSignal = function(signal) {
        this.signal[signal].fire = true;
    };
    
    Input.prototype.releaseSignal = function(signal) {
        if (!this.isHold(signal)) {
            return;
        }
        this.signal[signal].release = true;
        this.signal[signal].hold = false;
    };
    
    Input.prototype.resetSignal = function() {
        for (let k in this.signal) {
            let v = this.signal[k];
            v.fire = false;
            v.release = false;
        }
    };
    
    Input.prototype.isFire = function(signal) {
        return this.signal[signal] && this.signal[signal].fire;
    };
    
    Input.prototype.isRelease = function(signal) {
        return this.signal[signal] && this.signal[signal].release;
    };
    
    Input.prototype.isHold = function(signal) {
        return this.signal[signal] && this.signal[signal].hold;
    };
    
    Input.prototype.getMouseXY = function() {
        return this.mouse;
    };

    var onclick = function(e) {
        e.srcElement.refInputDOM.focus();
    };

    var onmousedown = function(e) {
        this.refWatcher.fireSignal('mouse');
    };
    var onmouseup = function(e) {
        this.refWatcher.releaseSignal('mouse');
    };
    var onkeydown = function(e) {
        var key = keycodes[e.keyCode];
        if (this.refWatcher.keysignalmapping[key]) {
            this.refWatcher.fireSignal(this.refWatcher.keysignalmapping[key]);
        }
    };
    var onkeyup = function(e) {
        var key = keycodes[e.keyCode];
        if (this.refWatcher.keysignalmapping[key]) {
            this.refWatcher.releaseSignal(this.refWatcher.keysignalmapping[key]);
        }
    };
    var onmousemove = function(e) {
        this.refWatcher.mouse.x = e.x;
        this.refWatcher.mouse.y = e.y;

        this.refWatcher.pushSignal('mouseMove');
    };
    
})(Input);