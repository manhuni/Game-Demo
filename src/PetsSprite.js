var PetSprite = cc.Sprite.extend({
    typeLabel: null,//should remove when finish check
    isVisited: false,
    colorType: null,
    hinted: false,
    id: null,
    plist: null,
    imagesheet: null,
    gameGroup: gameConfig.GAMEGROUP.PET,
    ctor: function(id,plist,imagesheet) {
        this._super();
        var size = cc.director.getWinSize();
        this.plist = plist;
        this.imagesheet = imagesheet;
        this.id = id;
        cc.spriteFrameCache.addSpriteFrames(plist, imagesheet);
        //init with pet
        var initFrame = `${id}_idle.png`;
        this.initWithSpriteFrameName(initFrame);
        this.opacity = 250;
        //test type visual(checked!)
        this.typeLabel = new cc.LabelTTF("", "Arial", 58);
        this.typeLabel.setPosition(cc.p(this.width/2,0));
        this.addChild(this.typeLabel);
    },
    shaking: function(step, repeat){
        var animFrames = [];
        for (var i = 0; i < 5; i++) {
            var str = `${this.id}_shaking${i}.png`;
            var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(spriteFrame);
        };
        var animation = new cc.Animation(animFrames, step);
        animation.setRestoreOriginalFrame(true);
        var action = cc.animate(animation);
        var seq = cc.sequence(action,cc.callFunc(function(){
            // this.setTexture(`${this.id}_idle.png`);
        },this))
        if(repeat){
            this.runAction(seq).repeatForever();
        }else{
            this.runAction(seq);
        }
        //recover
    }

});
//this method shoud be removed after test
PetSprite.prototype.setTypeLabel = function(type){
    this.typeLabel.setString(type);
};