var JoinerSprite = cc.Scale9Sprite.extend({
    ctor: function(attributes) {

        this._super();
        var size = cc.director.getWinSize();
        this.initWithFile(res.Joiner_PNG);
        this.x = attributes.x;
        this.y = attributes.y;
        this.anchorY = attributes.anchorY;
        this.scaleY = attributes.scaleY;
        this.rotation = attributes.rotation;
        this.opacity = attributes.opacity;
        this.runEffect();
        return true;
    },
    runEffect: function(){
        //cc.scaleTo( time, scaleX, scaleY );"
        cc.log(this.scaleX);
        cc.log(this.scaleY);
        var actionScaleBy = cc.scaleTo(0.5, this.scaleX, this.scaleY-0.3);
        var actionScaleReverse = cc.scaleTo(0.5, this.scaleX, this.scaleY);
        var seq = cc.sequence(actionScaleBy, actionScaleReverse);
        this.runAction(seq).repeatForever();

    }
});