var SpellFireSprite = cc.Sprite.extend({
    _winSize: null,
    ctor: function() {
        this._super();
        this._winSize = cc.director.getWinSize();
        this.width = 32;
        this.height = 32;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        
        this.x = this._winSize.width/2;
        this.y = this._winSize.height/2;

        var emitter = new cc.ParticleSystem(res.Particle_PLIST);
        emitter.setTotalParticles(250);
        emitter.setPosition(cc.p(0,0));
        this.addChild(emitter);
        this.scheduleUpdate();
    },
    fly: function(){

        var action = cc.moveTo(2, cc.p(this._winSize.width/2,this._winSize.height));
        this.runAction(action);
    },
    update: function(){
        if(this.y > this._winSize.height-5){
            this.removeFromParent(true);
        }
    }

});