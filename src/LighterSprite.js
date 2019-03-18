var LighterSprite = cc.Sprite.extend({
    ctor: function(plist,imagesheet) {

        this._super();
        var size = cc.director.getWinSize();
        cc.spriteFrameCache.addSpriteFrames(plist, imagesheet);
        this.initWithSpriteFrameName("lighter_0000.png");
        //Create SpriteFrame and AnimationFrame with Frame Data
        var animFrames = [];
        for (var i = 0; i < 9; i++) {
            var str = "lighter_000" + i + ".png";
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(spriteFrame);
        };
        var animation = new cc.Animation(animFrames, 0.02);
        this.runAction(cc.animate(animation).repeatForever());
        return true;
    }
});