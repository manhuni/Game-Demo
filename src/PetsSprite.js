var PetSprite = cc.Sprite.extend({
    typeLabel: null,//should remove when finish check
    isVisited: false,
    colorType: null,
    hinted: false,
    gameGroup: gameConfig.GAMEGROUP.PET,
    ctor: function(img) {
        this._super();
        var size = cc.director.getWinSize();
        cc.spriteFrameCache.addSpriteFrames(res.TSUM_PLIST, res.TSUM_PNG);
        //init with pet
        this.initWithSpriteFrameName(img);
        this.opacity = 250;
        //test type visual(checked!)
        this.typeLabel = new cc.LabelTTF("", "Arial", 58);
        this.typeLabel.setPosition(cc.p(this.width/2,0));
        this.addChild(this.typeLabel);
        
        // var size = cc.director.getWinSize();
        // cc.spriteFrameCache.addSpriteFrames(res.pet0_PLIST, res.pet0_PNG);

        // this.initWithSpriteFrameName("pet00.png");
        // //Create SpriteFrame and AnimationFrame with Frame Data
        // var animFrames = [];
        // for (var i = 0; i < 9; i++) {
        //     var str = "pet0" + i + ".png";
        //     var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
        //     animFrames.push(spriteFrame);
        // };
        // var animation = new cc.Animation(animFrames, 0.08);
        // this.runAction(cc.animate(animation).repeatForever());
        
    }   

});
//this method shoud be removed after test
PetSprite.prototype.setTypeLabel = function(type){
    this.typeLabel.setString(type);
};