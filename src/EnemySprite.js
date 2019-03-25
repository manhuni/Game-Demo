var EnemySprite = cc.Sprite.extend({
    _health: 1000,
    _itembar: null,
    _healthlabel: null,
    _isAttacking: false,
    ctor: function() {

        this._super();
        this.setContentSize(cc.size(124, 124));
        var size = cc.director.getWinSize();
        cc.spriteFrameCache.addSpriteFrames(res.Enemy_PLIST, res.Enemy_PNG);
        this.initWithSpriteFrameName("enemy0.png");
        //Create SpriteFrame and AnimationFrame with Frame Data
        this.addItemBar();
        this.addHealthBar();
        this.idle();
        // this.hitted();     
        this.scheduleUpdate();
        return true;
    },
    hitted: function() {
        var animFrames = [];
        for (var i = 0; i < 4; i++) {
            var str = "hitted" + i + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(spriteFrame);
        };
        var animation = new cc.Animation(animFrames, 0.01);
        animation.setRestoreOriginalFrame(true);
        this.runAction(cc.animate(animation));
    },
    attack: function() {
        var animFrames = [];
        for (var i = 0; i < 7; i++) {
            var str = "attack" + i + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(spriteFrame);
        };
        var animation = new cc.Animation(animFrames, 0.03);
        animation.setRestoreOriginalFrame(true);
        this.runAction(cc.animate(animation).repeatForever());
    },
    idle: function() {
        var animFrames = [];
        for (var i = 0; i < 8; i++) {
            var str = "enemy" + i + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(spriteFrame);
        };
        var animation = new cc.Animation(animFrames, 0.08);
        this.runAction(cc.animate(animation).repeatForever());
    },
    addItemBar: function() {
        this._itembar = cc.Sprite.create();
        this._itembar.initWithSpriteFrameName("items_Bar.png");
        this._itembar.setPosition(cc.p(this.getPosition().x + this.width / 2, 0 - 20));
        this._itembar.anchorX = 0.5;
        this._itembar.anchorY = 0.5;
        this._itembar.scale = 0.5;

        this.addChild(this._itembar);
    },
    addHealthBar: function() {
        this._healthBar = new cc.Sprite.create(res.RedHealth_PNG);
        var posOfItemBar = this._itembar.getPosition();

        var s = this._itembar.getBoundingBox();
        cc.log(s)
        var posSkipAchorX = posOfItemBar.x;
        var posSkipAchorY = posOfItemBar.y;
        this._healthBar.anchorX = 0;
        this._healthBar.anchorY = 0;
        this._healthBar.setPosition(cc.p(posSkipAchorX + 45, posSkipAchorY + 55));
        this._itembar.addChild(this._healthBar);
        //add status bar
        this._greenBar = new cc.Sprite.create(res.GreenHealth_PNG);
        this._greenBar.setPosition(cc.p(0, 0));
        this._greenBar.anchorX = 0;
        this._greenBar.anchorY = 0;
        this._greenBar.scaleX = 1.0;
        this._healthBar.addChild(this._greenBar);
    },
    setHealth: function() {
        this._health = this._health - 10;
        if (this._health <= 0) {
            this._greenBar.scaleX = 0;
            this._health = 1000;
            this._greenBar.scaleX = 1.0;
            cc.log("You win ....");
            return;
        } else {
            this._greenBar.scaleX = this._health / 1000;
        };
        if(this._health < 900){
            this._isAttacking = true;
            this.attack();
        };
    },
    update: function(dt) {

    }
});