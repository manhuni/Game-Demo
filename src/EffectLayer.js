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
        //store position to fire spell ball
        var allPos = [];
        for(var i = 0; i<pets.length;i++){
            allPos.push(pets[i]["target"].getPosition());
        };
        var delay = 0.5;
        // run effect before delete
        this.runSomeEffect(delay, gameLayer, pets);

        // create pet data object to add
        var petGroupSize = maxCols;
        var petGroup = [];
        // // split into group max cols max rows
        do {
            petGroup.push(pets.splice(0, petGroupSize));
        } while (pets.length);
        // create a data for new pet(fresh adding pet)
        var PetProperties = [];
        for (var i = 0; i < petGroup.length; i++) {
            PetProperties[i] = [];
            for (var j = 0; j < petGroup[i].length; j++) {
                // var scale = Math.floor(Math.random() * (1.2 - 0.5 + 1)) + 0.5;
                var scale = 1.0;
                var mass = Math.floor(Math.random() * (massOfPets.length - 1 - 0 + 1)) + 0;
                var json = 'random';
                var style = 'dynamic';
                var property = gameLayer.createPetObject(mass, scale, json, style);
                PetProperties[i].push(property);
            }
        }
        // Add new pet
        var startX = 50;
        var startY = size.height / 2 + 220;
        var loadedPet = [];
        //
        for (var i = 0; i < PetProperties.length; i++) {

            loadedPet[i] = [];

            for (var j = 0; j < PetProperties[i].length; j++) {

                var pet = PetProperties[i][j].sprite;
                var s = pet.getBoundingBox();
                var posArray = gameLayer.createDataPosition(s, startX, startY);
                var index = Math.floor(Math.random() * (posArray[i].length - 1 - 0 + 1)) + 0;

                if (loadedPet[i].includes(index)) {
                    index = findOtherPosition(index, posArray[i], loadedPet[i]);
                };
                var pos = posArray[i][index];

                loadedPet[i].push(index);
                gameLayer.createMultiPolygonEntity(PetProperties[i][j], pos);
            }//end inner loop for rows/cols pet
        } //end for loop add new pet
        gameLayer._allowedHint = true;
        for(var i = 0; i<allPos.length;i++){
           var SpellBall = new SpellFireSprite();
           SpellBall.setPosition(allPos[i]);
           gameLayer.addChild(SpellBall,gameConfig.INDEX.EFFECTNODE_INDEX);
           SpellBall.fly();
        };
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
EffectLayer.prototype.runSomeEffect = function(delay, gameLayer, pets) {

    var b2Body = Box2D.Dynamics.b2Body;
    //decrease opacity
    for (var i = 0; i < pets.length; i++) {
        pets[i]["target"].setOpacity(50);
    } //
    //convert dynamic body to static body
    var petMatched = this.findMatchedPets(gameLayer, pets);
    var originalPets = [];
    for (var i = 0; i < petMatched.length; i++) {
        var body = petMatched[i].body;
        body.SetType(b2Body.b2_staticBody);
        originalPets.push(petMatched[i].sprite);
    }
    //clone texture to create new sprite for effect
    var clonedPetsSprite = [];
    for (var i = 0; i < pets.length; i++) {
        var frame = pets[i]["target"].getSpriteFrame();
        var sprite = new cc.Sprite(frame);
        sprite.setPosition(originalPets[i].getPosition());
        sprite.setRotation(originalPets[i].getRotation());
        sprite.setScale(originalPets[i].getScale());
        sprite.setLocalZOrder(originalPets[i].getLocalZOrder());
        sprite.setName(`${i}`);
        clonedPetsSprite.push(sprite);
    };
    //run  move to effect seq
    //create an action array
    var actionArray = [];
    for (var i = 0; i < clonedPetsSprite.length; i++) {
        var actionMove = null;
        var actionFade = null;
        var spawn = null;

        if (i < clonedPetsSprite.length - 1) {
            actionMove = cc.moveTo(delay, clonedPetsSprite[i + 1].getPosition());
        } else {
            actionMove = cc.fadeOut(delay);
        };
        actionFade = cc.fadeOut(delay);

        spawn =  cc.spawn(actionMove,actionFade);
        actionArray.push(spawn);
    };
    //runaction now
    for (var i = 0; i < clonedPetsSprite.length; i++) {
        gameLayer.addChild(clonedPetsSprite[i]);
        clonedPetsSprite[i].runAction(cc.sequence(actionArray[i], cc.callFunc(function() {
            this.removeFromParent(true);
            var world = petMatched[this.getName()].world;
            world.DestroyBody(petMatched[this.getName()].body);
            gameLayer.removeChild(petMatched[this.getName()].sprite, true);
        }, clonedPetsSprite[i])));
    };

};
EffectLayer.prototype.findMatchedPets = function(gameLayer, pets) {
    //remove target joined
    var matchedPets = [];
    var allPet = gameLayer._allOfPets;
    for (var i = 0; i < pets.length; i++) {
        for (var j = 0; j < allPet.length; j++) {
            var body = allPet[j].body;
            var sprite = allPet[j].sprite;
            var world = body.GetWorld();
            if (pets[i]["target"] == sprite) {
                //group in an array
                matchedPets.push({
                    world: world,
                    sprite: sprite,
                    body: body
                });
                //delete this pet in array all pet if you don't want to get over flow
                allPet.splice(j,1);
            }
        }
    }
    return matchedPets;
}