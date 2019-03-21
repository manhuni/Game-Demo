var SpellFireSprite = cc.Sprite.extend({
    ctor: function() {
        this._super();
        var size = cc.director.getWinSize();
        this.width = 32;
        this.height = 32;
        this.anchorX = 0.5;
        this.anchorY = 0.5;
        this.x = size.width/2;
        this.y = size.height/2;
        var emitter = new cc.ParticleSystem(res.Particle_PLIST);
        emitter.setTotalParticles(250);
        // emitter.texture = cc.textureCache.addImage(res.Particle);
        emitter.setPosition(cc.p(0,0));
        this.addChild(emitter);
        cc.log("emitter",emitter.getPosition())
        //test type visual(checked!)

    }

});