var JoinerSprite = cc.Scale9Sprite.extend({
    ctor: function(attributes) {

        this._super();
        var size = cc.director.getWinSize();
        this.initWithSpriteFrameName("joinblock.png");
        this.x = attributes.x;
        this.y = attributes.y;
        this.anchorY = attributes.anchorY;
        // this.scaleX = attributes.scaleX;
        this.scaleY = attributes.scaleY;
        this.rotation = attributes.rotation;

        //Create SpriteFrame and AnimationFrame with Frame Data
        // var animFrames = [];
        // for (var i = 0; i < 3; i++) {
        //     var str = "fire" + i + ".png";
        //     var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
        //     animFrames.push(spriteFrame);
        // };
        // var animation = new cc.Animation(animFrames, 0.08);
        // this.runAction(cc.animate(animation).repeatForever());
        return true;
    }
});