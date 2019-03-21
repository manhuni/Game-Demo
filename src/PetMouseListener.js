//Create a "one by one" touch event listener (processes one touch at a time)
var PetMouseListener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function(touch, event) {
        var gameLayer = event.getCurrentTarget();
        //when detect user click, game will unregister schedule
        gameLayer._allowedHint = false;
        //08.03.2019//click
        var allChildenOfGameLayer = gameLayer._children;
        // position of all pets and filter only pets
        var petObject = [];
        for (var i = 0; i < allChildenOfGameLayer.length; i++) {
            if (allChildenOfGameLayer[i].gameGroup != 0) {
                continue;
            } else {
                petObject.push(allChildenOfGameLayer[i]);
            }
        }
        //calculate distance between click point vs all to find point nearest
        for (var i = 0; i < petObject.length; i++) {
            var distClickedWithPets = cc.pDistance(touch.getLocation(), petObject[i].getPosition());
            if (distClickedWithPets < joinerConfig.radiusCanClickedFromCenterPet) {
                petObject[i].opacity = 255;
                // // increase number of segment(purpose for count limit point, ex: 3 seg then allow clear pet)
                gameLayer._effectNode._counterSegment = gameLayer._effectNode._counterSegment + 1;

                // //Adding a fire animation at center target pet
                var fireAnimation = gameLayer._effectNode.addFireAnim(petObject[i]);
                petObject[i].isVisited = true;

                // //Group all component of pet(fire, join, it'self to control(delete, point, ...))
                gameLayer._effectNode.petEffected.push({
                        target: petObject[i],
                        fireAnimation: fireAnimation,
                        joiner: null
                    })
                    // //Magnify target pet(effect ... )
                    // gameLayer._effectNode.glowUpPet(gameLayer._effectNode.petEffected[gameLayer._effectNode.petEffected.length - 1]['target']);
                return true;
            }
        }
        return false
    },
    onTouchMoved: function(touch, event) {
        // We will add joiner from here
        var gameLayer = event.getCurrentTarget();
        var lastTarget = gameLayer._effectNode.petEffected[gameLayer._effectNode.petEffected.length - 1]["target"];
        // Check all position of pets to evaluate distance need join
        var allChildenOfGameLayer = gameLayer._children;
        // position of all pets and filter only pets
        var petObject = [];

        for (var i = 0; i < allChildenOfGameLayer.length; i++) {
            if (allChildenOfGameLayer[i].gameGroup != 0) {
                continue;
            } else {
                petObject.push(allChildenOfGameLayer[i]);
            }
        }
        // Find pets none visted, if non visted then push into an array to calculate distance
        var petNoneVisted = [];
        for (var i = 0; i < petObject.length; i++) {
            if (!petObject[i].isVisited) {
                petNoneVisted.push(petObject[i]);
            }
        }
        // Then we need calculate distance between pos of first pet
        // With touch location and compare with position of pets non visited

        var originRange = lastTarget.getBoundingBox().width / 2;
        var bonusLength = lastTarget.getBoundingBox().width / 2;
        var totalRange = originRange + bonusLength;

        var distanceRuntime = cc.pDistance(lastTarget.getPosition(), touch.getLocation());

        if (distanceRuntime > originRange && distanceRuntime < totalRange) {
            // Now time for play this will determine draw or not
            if (gameLayer._effectNode.petEffected.length >= 2) {
                var alreadyJoinPet = gameLayer.findPetHaveAlreadyJoin(gameLayer, touch.getLocation(), gameLayer._effectNode.petEffected);
            }
            var nearestPoint = gameLayer.findNearestPosition(lastTarget, touch.getLocation(), petNoneVisted);


            if (nearestPoint != -1) {
                if (petNoneVisted[nearestPoint].colorType == lastTarget.colorType) {
                    //if same color then permit join but must check
                    //have any pet cross this path joiner
                    var radiusScan = cc.pDistance(lastTarget.getPosition(), petNoneVisted[nearestPoint].getPosition());
                    var inrangeRadiusArray = gameLayer.findInrangePet(radiusScan, lastTarget, petNoneVisted);
                    //check in this path have any pet under
                    var isPetUnderPathObj = gameLayer.findPetUnderPath(inrangeRadiusArray, lastTarget, petNoneVisted[nearestPoint]);

                    if (isPetUnderPathObj.isPetUnder != false) {
                        petNoneVisted[nearestPoint].isVisited = true;
                        // First we will blow up that sprite
                        gameLayer._effectNode._counterSegment = gameLayer._effectNode._counterSegment + 1;

                        var angle = isPetUnderPathObj.angle;
                        // define a new segment
                        var beforeJoiner = gameLayer._effectNode.petEffected[gameLayer._effectNode.petEffected.length - 1]["joiner"];
                        var scaleYUPJ = 0;
                        // beforeJoiner != null ? scaleYUPJ = beforeJoiner.scaleY + 0.07 : scaleYUPJ = gameConfig.SCALE.JOINER_FIXED_SCALEY;
                        scaleYUPJ = gameConfig.SCALE.JOINER_FIXED_SCALEY;

                        var objJoinerProperties = {
                            x: lastTarget.getPosition().x,
                            y: lastTarget.getPosition().y,
                            anchorX: 0,
                            anchorY: 0.5,
                            scaleY: scaleYUPJ,
                            rotation: angle
                        };

                        var joinerSprite = new JoinerSprite(objJoinerProperties);

                        // TINH KHOANG CACH TU POSA -> POSB DE DIEU CHINH SCALE PHU HOP
                        var disScaleRelative = cc.pDistance(lastTarget.getPosition(), petNoneVisted[nearestPoint].getPosition());
                        var widthOfJoiner = joinerSprite.width * gameConfig.SCALE.JOINER_FIXED_SCALEX; // pixel
                        var scaleRatioX = disScaleRelative * gameConfig.SCALE.JOINER_FIXED_SCALEX / widthOfJoiner;
                        joinerSprite.scaleX = scaleRatioX;

                        joinerSprite.setTag(gameConfig.TAG.JOIN_ANIM)
                        gameLayer._effectNode.addChild(joinerSprite, gameConfig.INDEX.EFFECTNODE_JOIN_INDEX);
                        var beforeFire = gameLayer._effectNode.petEffected[gameLayer._effectNode.petEffected.length - 1]["fireAnimation"];
                        var scaleYF = beforeFire.scale;


                        var fireAnimation = gameLayer._effectNode.addFireAnim(petNoneVisted[nearestPoint]);
                        fireAnimation.scale = scaleYF;
                        // add all into one
                        gameLayer._effectNode.petEffected.push({
                                target: petNoneVisted[nearestPoint],
                                fireAnimation: fireAnimation,
                                joiner: joinerSprite
                        })
                            // gameLayer._effectNode.glowDownPet(gameLayer._effectNode.petEffected[gameLayer._effectNode.petEffected.length - 2]['target']);
                            // gameLayer._effectNode.glowUpPet(gameLayer._effectNode.petEffected[gameLayer._effectNode.petEffected.length - 1]['target']);

                    }

                }
            }

        }
    },
    onTouchEnded: function(touch, event) {
        // o day can kiem tra dieu kien de tinh diem va loai bo cac doi tuong
        var gameLayer = event.getCurrentTarget();
        // phai reset lai all target
        // o day can xet xem do dai cua doi tuong co dam bao lon hon 2 hay khong
        if (gameLayer._effectNode.petEffected.length >= 2) {
            gameLayer._effectNode.dropPetAnimation(gameLayer,gameLayer._effectNode.petEffected);
        };

        for (var i = 0; i < gameLayer._effectNode.petEffected.length; i++) {
            gameLayer._effectNode.petEffected[i]['target'].isVisited = false;
        }
        gameLayer._effectNode.removeAllChildren();
        // gameLayer._effectNode.glowDownPet(gameLayer._effectNode.petEffected[gameLayer._effectNode.petEffected.length - 1]['target']);

        gameLayer._effectNode.petEffected = [];
        gameLayer._effectNode._counterSegment = 0;
        //un register/remove all handle listenner
        return false;
    }
});

GameLayer.prototype.findNearestPosition = function(lastTarget, touchPosition, arrayPosition) {
    var indexOfShostestChild = arrayPosition.findIndex(function(element, index, array) {
        var distancePosition = cc.pDistance(touchPosition, element);
        return distancePosition < joinerConfig.permitedJoinerDistance && element != lastTarget;
    });
    return indexOfShostestChild;
};
GameLayer.prototype.findInrangePet = function(range, lastTarget, arrayPets) {
    var inrangeRadius = [];
    for (var i = 0; i < arrayPets.length; i++) {

        var origin = lastTarget.getPosition();
        var destination = arrayPets[i].getPosition();
        var distance = cc.pDistance(origin, destination);
        if (distance < range && arrayPets[i] != lastTarget) {
            inrangeRadius.push(arrayPets[i]);
        }
    }
    return inrangeRadius;
};
GameLayer.prototype.findPetUnderPath = function(inrangeRadiusArray, lastTarget, nearestTarget) {

    var originPos = lastTarget.getPosition();
    var destinationPos = nearestTarget.getPosition();

    var angleOrgToDest = cc.radiansToDegrees(Math.atan2(destinationPos.y - originPos.y, destinationPos.x - originPos.x));
    var petUnderPath = [];
    var isPetUnder = null;
    //
    for (var i = 0; i < inrangeRadiusArray.length; i++) {

        var inRadiusPetPos = inrangeRadiusArray[i].getPosition();
        var angleOrgToInradius = cc.radiansToDegrees(Math.atan2(inRadiusPetPos.y - originPos.y, inRadiusPetPos.x - originPos.x));

        if ((angleOrgToInradius > (angleOrgToDest - joinerConfig.offsetAngle)) && (angleOrgToInradius < (angleOrgToDest + joinerConfig.offsetAngle))) {
            cc.log("We don't permit you join this destination pet ...");
            isPetUnder = false;
            break;
        } else {
            isPetUnder = true;
        };

    };
    cc.log("We are checking, please wait a moment ...");
    return {
        isPetUnder: isPetUnder,
        angle: angleOrgToDest
    }

};