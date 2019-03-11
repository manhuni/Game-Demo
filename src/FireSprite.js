var FireSprite = cc.Sprite.extend({
    ctor: function() {

        this._super();
        var size = cc.director.getWinSize();
        cc.spriteFrameCache.addSpriteFrames(res.Fire_PLIST, res.Fire_PNG);
        this.initWithSpriteFrameName("fire0.png");
        //Create SpriteFrame and AnimationFrame with Frame Data
        var animFrames = [];
        for (var i = 0; i < 3; i++) {
            var str = "fire" + i + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(spriteFrame);
        };
        var animation = new cc.Animation(animFrames, 0.08);
        this.runAction(cc.animate(animation).repeatForever());
        return true;
    }
});