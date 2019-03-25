var SpellFireSprite = cc.Sprite.extend({
    _winSize: null,
    _isAttacking: false,
    ctor: function() {
        this._super();
        this._winSize = cc.director.getWinSize();
        this.width = 32;
        this.height = 32;
        this.anchorX = 0.5;
        this.anchorY = 0.5;

        this.x = this._winSize.width / 2;
        this.y = this._winSize.height / 2;

        var emitter = new cc.ParticleSystem(res.Particle_PLIST);
        emitter.setTotalParticles(250);
        emitter.setPosition(cc.p(0, 0));
        this.addChild(emitter);
        this.scheduleUpdate();
    },
    fly: function(toHere) {
        var action = cc.moveTo(2, toHere);
        this.runAction(action);
    },
    update: function() {
        var parent = this.getParent();
        var enemy = parent.enemy;
        var enemyBounding = enemy.getBoundingBox();
        // cc.log(parent.enemy);
        if (!enemy._isAttacking) {
            if (cc.rectIntersectsRect(enemyBounding, this.getBoundingBox())) {
                enemy.hitted();
                enemy.setHealth();
                this.removeFromParent();
            };
        } else {
            cc.log("Enemy is attacking, don't permit fire spell ball ...");
            enemy._isAttacking = true;
            parent._enemyAttacking = true;
        };

        if (this.y > this._winSize.height - 5) {
            this.removeFromParent(true);
        };
    }

});