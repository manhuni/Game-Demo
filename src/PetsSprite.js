var PetSprite = cc.PhysicsSprite.extend({
    typeLabel: null,//should remove when finish check
    isVisited: false,
    colorType: null,
    collision_type: 0,
    tmpBlocked: false,
    gameGroup: gameConfig.GAMEGROUP.PET,
    ctor: function(img) {
        this._super();
        var size = cc.director.getWinSize();
        cc.spriteFrameCache.addSpriteFrames(res.TSUM_PLIST, res.TSUM_PNG);
        //init with pet
        this.initWithSpriteFrameName(img);
        this.opacity = 240;
        //test type visual(checked!)
        this.typeLabel = new cc.LabelTTF("", "Arial", 38);
        this.typeLabel.setPosition(cc.p(this.width/2,this.height/2));
        this.addChild(this.typeLabel);
        
    }   

});
//this method shoud be removed after test
PetSprite.prototype.setTypeLabel = function(type){
    this.typeLabel.setString(type);
};