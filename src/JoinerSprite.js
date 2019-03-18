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
        return true;
    }
});