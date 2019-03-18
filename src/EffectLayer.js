var EffectLayer = cc.Layer.extend({
    petEffected: [],
    segmentLabel: null,
    _counterSegment: 0,
    ctor: function() {
        this._super()
        this.scheduleUpdate()
    },
    addFireAnim: function(target) {
        var fireAnim = new LighterSprite(res.Lighter_PLIST, res.Lighter_PNG);
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
    dropPetAnimation: function(gameLayer, pets) {
        var size = cc.director.getWinSize();
        //remove target joined
        var allPet = gameLayer._allOfPets;
        for (var i = 0; i < pets.length; i++) {
            for (var j = 0; j < allPet.length; j++) {
                var body = allPet[j].body;
                var sprite = allPet[j].sprite;
                var world = body.GetWorld();
                if (pets[i]["target"] == sprite) {
                    world.DestroyBody(body);
                    gameLayer.removeChild(sprite, true);
                }
            }
        }


        // gameLayer._allOfPets[0].body.DestroyFixture(gameLayer._allOfPets[0].fixTure)

        // create pet data object to add
        // var petGroupSize = maxCols;
        // var petGroup = [];
        // do{
        //     petGroup.push(pets.splice(0,petGroupSize));
        // }while(pets.length);
        // //create a data for new pet

        // var additionalPet = [];
        // var petLoaded = [];

        // var verticalPos = size.height/2 + 220;
        // var rows = petGroup.length;
        // var cols = maxCols;

        // var posArray = this.getRandomPos(rows,cols,verticalPos,originalHorz);

        // for(var i = 0; i<petGroup.length;i++){
        //     petLoaded[i] = [];

        //     for(var j = 0; j<petGroup[i].length; j++){
        //         var type = petGroup[i][j]["target"].collision_type;
        //         var index = Math.floor(Math.random() * (posArray[i].length-1 - 0 + 1)) + 0;
        //         if(petLoaded[i].includes(index)){
        //             index = this.findOtherPosition(index,posArray[i],petLoaded[i]);
        //         }
        //         var pos = posArray[i][index];

        //         additionalPet.push(this.getParent().createPetObject(i, j, type,verticalPos,originalHorz,pos));
        //         petLoaded[i].push(index);
        //     }
        // }
        // //

        // // request main layer push more pets with attributes stored at additionalPet array;
        // for (var i = 0; i < additionalPet.length; i++) {
        //     this.getParent().createPhysicEntity(additionalPet[i]);
        // };

    },
    getRandomPos: function(rows, cols, verticalPos, originalHorz) {
        var pos = [];
        var x, y;
        for (var i = 0; i < rows; i++) {
            pos[i] = [];
            for (var j = 0; j < cols; j++) {
                x = originalHorz + pettile * j;
                y = verticalPos + pettile * i;

                pos[i].push(cc.p(x, y));
            }
        };
        return pos;

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
                        // scaleY: gameConfig.SCALE.JOINER_FIXED_SCALEY,
                        scaleX: scaleRatioX,
                        rotation: cc.radiansToDegrees(Math.atan2(-(_this.petEffected[i + 1]['target'].getPosition().y - _this.petEffected[i]['target'].getPosition().y),
                            _this.petEffected[i + 1]['target'].getPosition().x - _this.petEffected[i]['target'].getPosition().x))
                    })
                } // end if
            }
        }
    }
});