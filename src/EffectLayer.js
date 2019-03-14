var EffectLayer = cc.Layer.extend({
    petEffected: [],
    segmentLabel: null,
    _counterSegment: 0,
    ctor: function() {
        this._super()
        this.scheduleUpdate()
    },
    addFireAnim: function(target) {
        var fireAnim = new FireSprite()
        fireAnim.setPosition(target.getPosition())
        fireAnim.scaleX = gameConfig.SCALE.FIREANIM_SCALEX
        fireAnim.scaleY = gameConfig.SCALE.FIREANIM_SCALEY
        fireAnim.setTag(gameConfig.TAG.FIRE_ANIM)
        this.addChild(fireAnim, gameConfig.INDEX.EFFECTNODE_FIRE_INDEX)
        return fireAnim
    },
    glowUpPet: function(pet) {
        pet.attr({
            scale: pet.scale + 0.1,
            opacity: 255,
            // zIndex: gameConfig.INDEX.ANIMATION_INDEX
        })

    },
    glowDownPet: function(pet) {
        pet.attr({
            scale: pet.scale - 0.1,
            opacity: 240,
            // zIndex: gameConfig.INDEX.GAMELAYER_INDEX
        });

    },
    dropPetAnimation: function(pet) {
        cc.log('Phan animation khi nguoi dung noi duoc 3 pet =))')
        cc.log('Xu ly cai nay nhe', pet);
    },
    update: function(dt) {
        var _this = this
        for (var i = 0; i < this.petEffected.length; i++) {
            _this.petEffected[i]['fireAnimation'].setPosition(_this.petEffected[i]['target'].getPosition())
        }
        if (this.petEffected.length > 1) {
            for (var i = 0; i < this.petEffected.length; i++) {
                _this.petEffected[i]['fireAnimation'].setPosition(_this.petEffected[i]['target'].getPosition())
                if (i < _this.petEffected.length - 1) {
                    var disScaleRelative = cc.pDistance(_this.petEffected[i]['target'].getPosition(), _this.petEffected[i + 1]['target'].getPosition())
                    var widthOfJoiner = _this.petEffected[i + 1]['joiner'].width * gameConfig.SCALE.JOINER_FIXED_SCALEX // pixel

                    var scaleRatioX = disScaleRelative * gameConfig.SCALE.JOINER_FIXED_SCALEX / widthOfJoiner
                        //
                    _this.petEffected[i + 1]['joiner'].attr({
                        x: _this.petEffected[i]['target'].getPosition().x,
                        y: _this.petEffected[i]['target'].getPosition().y,
                        anchorX: 0,
                        anchorY: 0.5,
                        scaleY: gameConfig.SCALE.JOINER_FIXED_SCALEY,
                        scaleX: scaleRatioX,
                        rotation: cc.radiansToDegrees(Math.atan2(-(_this.petEffected[i + 1]['target'].getPosition().y - _this.petEffected[i]['target'].getPosition().y),
                            _this.petEffected[i + 1]['target'].getPosition().x - _this.petEffected[i]['target'].getPosition().x))
                    })
                } // end if
            }
        }
    }
})