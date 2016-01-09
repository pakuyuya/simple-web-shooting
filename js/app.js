'use strict';

var App = App || {};

(function(App){
    
    // fields
    
    let hashkeyidx = 0;
    const msPerFrame = 1000/Settings.defaultFPS;

    App.stage = null;
    App.enviormentModules = {};
    App.enemies = {};
    App.playerShots = {};
    App.enemyShots = {};
    App.player = null;
    
    App.ctx = undefined;
    App.backelm = undefined;
    App.backctx = undefined;
    
    // methods
    
    /**
     * @method init
     * @param {Object} arg initialize option
     */
    App.init = function(arg) {
        const defopt = {
        };
        let opt = Object.assign(defopt, arg);
        
        App.ctx = opt.canvas.getContext('2d');
        App.backelm = document.createElement('canvas');
        App.backelm.height = opt.canvas.height;
        App.backelm.width  = opt.canvas.width;

        App.backctx = App.backelm.getContext('2d');

        App.input = new Input();
        App.input.watch(opt.canvas);
    };
    
    /**
     * @method run
     * @param {Object} arg running option
     */
    App.run = function() {
        (function tick(){
            executeFrame();
            setTimeout(tick, msPerFrame);
        })();
    };

    /**
     * @method respownPlayer
     */
    App.respownPlayer = function() {
        if (App.stage && App.stage.respownProvide) {
            App.stage.respownProvide(App);
        } else {
            
        }
    };

    /**
     * respownDefault
     */
    App.respownDefault = function() {
        const bounds = getBoundRect();
        App.player.position = vector2(100, (bounds.top + bounds.bottom) / 2);
        App.player.changeState(new PlayerStateSpownDelay);
    }

    /**
     * @method changeStage
     * @param  {Stage} stage 
     */
    App.changeStage = function(stage) {
        if (App.stage && App.stage.dispose) {
            App.stage.dispose(App);
        }

        App.stage = stage;
        if (App.stage.init) {
            App.stage.init(App);
        }
    };

    /**
     * @method  setInputFlag
     * @param {String} key   
     * @param {mixed} value 
     */
    App.setInputFlag = function(key, value) {
        App.input[key] = (value !== undefined) ? value : true;
    };
    
    /**
     * @method appEnviormentModule
     * @param {EnviomentModule} e inviorment module
     */
    App.addEnviormentModule = function(e) {

        if (App.stage && App.stage.preProcess) {
            App.stage.preProcess(App);
        };

        e.hashkey = hashkeyidx;
        App.enviormentModules[hashkeyidx++] = e;
    };

    /**
     * @method  cleanEnviormentModules
     */
    App.cleanEnviormentModules = function() {
        App.enviormentModules = {};
    };
    
    /**
     * @method  addEnemy
     * @param {Enemy} e
     */
    App.addEnemy = function(e) {
        e.hashkey = hashkeyidx;
        App.enemies[hashkeyidx++] = e;
    };

    /**
     * @method removeEnemy
     * @param  {Enemy} e
     */
    App.removeEnemy = function(e) {
        delete App.enemies[e.hashkey];
    };

    /**
     * @method  cleanEnemies
     */
    App.cleanEnemies = function() {
        App.enemies = {};
    };

    /**
     * @method  addPlayerShot
     * @param {PlayerShot} e
     */
    App.addPlayerShot = function(e) {
        e.hashkey = hashkeyidx;
        App.playerShots[hashkeyidx++] = e;
    };
    
    /**
     * @method removePlayerShot
     * @param  {PlayerShot} e
     */
    App.removePlayerShot = function(e) {
        delete App.playerShots[e.hashkey];
    };

    /**
     * @method  cleanPlayerShots
     */
    App.cleanPlayerShots = function() {
        App.playerShots = {};
    };

    /**
     * @method  addEnemyShot
     * @param {EnemyShot} e
     */
    App.addEnemyShots = function(e) {
        e.indexkey = hashkeyidx;
        App.enemyShots[hashkeyidx++] = e;
    };
    /**
     * @method  removeEnemeyShot
     * @param  {EnemyShot} e
     */
    App.removeEnemyShot = function(e) {
        delete App.enemyShots[e.hashkey];
    };

    /**
     * @method  cleanEnemyShots
     */
    App.cleanEnemyShots = function() {
        app.enemyShots = {};
    };

    App.adjustX = function(x) {
        const bounds = getBoundsRect();

        if (x < bounds.left)  return bounds.left;
        if (x > bounds.right) return bounds.right;

        return x;
    } ;

    App.adjustY = function(y) {
        const bounds = getBoundsRect();

        if (y < bounds.top)    return bounds.top;
        if (y > bounds.bottom) return bounds.bottom;

        return y;
    };
    
    App.getBoundsRect = getBoundsRect;
    function getBoundsRect() {
        return { left: 0, top: 0, right: App.backelm.width - 1, bottom: App.backelm.height - 1 };
    };

    // inner

    function preProcess() {
        if (App.stage && App.stage.preProcess)
            App.stage.preProcess(App);

        for (let key in App.enviormentModules) {
            let env = App.enviormentModules[key];
            if (env.preProcess) env.preProcess(App);
        }
    }
    
    function postProcess() {
        if (App.stage && App.stage.postProcess)
            App.stage.postProcess(App);

        for (let key in App.enviormentModules) {
            let env = App.enviormentModules[key];
            if (env.postProcess) env.postProcess(App);
        }
    }
    
    function move() {
        if (App.player && App.player.move)
            App.player.move(App);
        
        for (let key in App.playerShots) {
            let shot = App.playerShots[key];
            if (shot.move) shot.move(App);
        }
        
        for (let key in App.enemies) {
            let enemy = App.enemies[key];
            if (enemy.move) enemy.move(App);
        }
        
        for (let key in App.enemyShots) {
            let shot = App.enemyShots[key];
            if (shot.umove) shot.move(App);
        }
    }
    
    function update() {
        if(App.player && App.player.update)
            App.player.update(App);
        
        for (let key in App.playerShots) {
            let shot = App.playerShots[key];
            if (shot.update) shot.update(App);
        }
        
        for (let key in App.enemies) {
            let enemy = App.enemies[key];
            if (enemy.update) enemy.update(App);
        }
        
        for (let key in App.enemyShots) {
            let shot = App.enemyShots[key];
            if (shot.update) shot.update(App);
        }
        App.input.resetSignal();
    }
    
    function draw2backbuffer() {
        if (!App.ctx) return;
        
        for (let key in App.enviormentModules) {
            let module = App.enviormentModules[key];
            if (module.preDraw) module.preDraw(App, App.backctx);
        }

        for (let key in App.playerShots) {
            let shot = App.playerShots[key];
            if (shot.draw) shot.draw(App, App.backctx);
        }
        
        for (let key in App.enemies) {
            let enemy = App.enemies[key];
            if (enemy.draw) enemy.draw(App, App.backctx);
        }
        
        for (let key in App.enemyShots) {
            let shot = App.enemyShots[key];
            if (shot.draw) shot.draw(App, App.backctx);
        }

        if (App.player && App.player.draw)
            App.player.draw(App, App.backctx);

        for (let key in App.enviormentModules) {
            let module = App.enviormentModules[key];
            if (module.postDraw) module.postDraw(App, App.backctx);
        }
    }

    function clearBackbuffer() {
        App.backctx.clearRect(0, 0, App.backelm.width, App.backelm.height);
        App.ctx.clearRect(0, 0, App.backelm.width, App.backelm.height);
    };
    
    function present() {
        App.ctx.drawImage(App.backelm, 0, 0);
    }
    
    function executeFrame() {
        preProcess();
        
        move();
        update();
        
        postProcess();

        clearBackbuffer();
        draw2backbuffer();
        present();
    }
})(App);