var GameLayer = cc.Layer.extend({
    space: null, //contain all physic
    _debugNode: null, //show element physics
    _showDebugger: false,
    _effectNode: null,
    _allOfPets: [],
    _testMode: false,
    _commontype: startWithType,
    _shuffle: shuffleObj,
    ctor: function() {
        this._super();
        this.init();
        //setup for draw test
        this._effectNode = new EffectLayer();
        this._effectNode.setTag(gameConfig.TAG.TEMP_ANI_TAG);
        this.addChild(this._effectNode, gameConfig.INDEX.EFFECTNODE_INDEX);

        //define physic world1
        this.space = this.initPhysicsWorld();
        //turn on or off debug node physic
        this.showPhysicWorld(this._showDebugger);
        //create an object physic sprite

        var size = cc.director.getWinSize();
        var bounderGame = {
            position: cc.p(size.width / 2, size.height / 2),
            image: res.gameBackground,
            json: res.gameBackground_JSON,
            type: typeCollision.GROUND_INNER,
            scale: 1,
            style: "static"

        };
        //put in group, we add pets in center of screen 
        //org: size.height/2;
        //pettile: 50px

        var rows = 7;
        var cols = maxCols;
        //
        var Pets = [];
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var pet = this.createPetObject(i, j, null, size.height / 2 - 300, originalHorz, null);
                Pets.push(pet);
            }
        };
        cc.log(Pets)
            //create a entity and need return some body and shape, sprite
            //add game play bounder
        this.createStaticEntity(bounderGame);
        //add pet
        for (var i = 0; i < Pets.length; i++) {
            this.createPhysicEntity(Pets[i]);
        }
        //listen mouse event click on gameLayer
        cc.eventManager.addListener(petListener, this);
        //need update for physics requirement
        this.scheduleUpdate();
    },
    init: function() {
        this._super();
        var size = cc.director.getWinSize();
        //add shuffle button
        //2.create a menu and assign onPlay event callback to it
        var norShuffle = cc.Sprite.create(res.Shuffle_Button_Nor);
        var selShuffle = cc.Sprite.create(res.Shuffle_Button_Sel);
        //test mode
        norShuffle.scale = selShuffle.scale = 0.8;
        var menuItemShuffle = cc.MenuItemSprite.create(norShuffle, selShuffle, this.shuffleAllPhysics, this);

        var menu = cc.Menu.create(menuItemShuffle);
        menu.setPosition(size.width - 50, 75);
        this.addChild(menu, gameConfig.INDEX.SHUFFLE_INDEX);
        //create inner background
        // var sprite = cc.Sprite.create(res.gameBackground_inner);
        // sprite.setPosition(cc.p(size.width / 2, size.height / 2));
        // this.addChild(sprite, gameConfig.INDEX.GAMELAYER_INDEX);
        //create a animation effect pet
        //test
        var size = cc.director.getWinSize();
        var myPet = new PetAnimationSprite(res.pet0_PLIST, res.pet0_PNG);
        myPet.setPosition(cc.p(100, size.height / 2 + 210));
        this.addChild(myPet, gameConfig.INDEX.ANIMATIONPET_INDEX+1);
        // end test

    },
    initPhysicsWorld: function() {

        space = new cp.Space();
        var size = cc.director.getWinSize();
        // 壁を作る
        var walls = [
            new cp.SegmentShape(space.staticBody, cp.v(0, 0), cp.v(size.width, 0), 1), // bottom
            new cp.SegmentShape(space.staticBody, cp.v(0, size.height), cp.v(size.width, size.height), 1), // top
            new cp.SegmentShape(space.staticBody, cp.v(0, 0), cp.v(0, size.height), 1), // left
            new cp.SegmentShape(space.staticBody, cp.v(size.width, 0), cp.v(size.width, size.height), 1) // right
        ];
        for (var i = 0; i < walls.length; i++) {
            var shape = walls[i];
            shape.setElasticity(0);
            shape.setFriction(0);
            space.addStaticShape(shape);
            shape.setCollisionType(0);
        }
        space.gravity = cp.v(0, -800); // 下方向に重力を設定する
        // space.sleepTimeThreshold = 0.5;
        return space
    },
    shuffleAllPhysics: function() {
        // cc.log("Before");
        // cc.log(this.space.constraints);
        var _this = this;
        this._shuffle._timesShuffle++;

        if (this._shuffle._firstRotate) {
            this._shuffle._firstRotate = false
            for (var i = 0; i < this._children.length; i++) {
                if (_this._children[i].gameGroup != 0) {
                    continue;
                } else {

                    var physicsSprite = _this._children[i];
                    var body = physicsSprite.body;

                    var motor = new cp.SimpleMotor(_this.space.staticBody, body, _this._shuffle._startForce);

                    _this.space.addConstraint(motor);
                    _this._shuffle._rotary.push({
                        target: body,
                        constraint: motor,
                    });

                }
            };
        } else {
            _this._shuffle._startForce = _this._shuffle._startForce + 3;
            cc.log("start", _this._shuffle._startForce)

            if (_this._shuffle._startForce < _this._shuffle._maxForce) {
                cc.log("Oh");
                // // // cc.log("Haha",_this._shuffle._rotary)
                for (var i = 0; i < _this._shuffle._rotary.length; i++) {
                    // _this.space.removeConstraint(_this._shuffle._rotary[i].constraint); 
                    _this._shuffle._rotary[i].constraint.rate = _this._shuffle._startForce;
                    cc.log("Hu", _this._shuffle._startForce)
                };
            };
        }
        if (this._shuffle._timesShuffle > this._shuffle._timesShuffleMax) {
            for (var i = 0; i < _this._shuffle._rotary.length; i++) {
                _this.space.removeConstraint(_this._shuffle._rotary[i]["constraint"]);
                _this._shuffle._rotary[i]["target"].constraintList = null;

            };
            _this._shuffle._firstRotate = true;
            _this._shuffle._startForce = 2;
            _this._shuffle._timesShuffle = 0;
            _this._shuffle._rotary = [];

        };

        setTimeout(function() {
            for (var i = 0; i < _this._shuffle._rotary.length; i++) {
                _this.space.removeConstraint(_this._shuffle._rotary[i]["constraint"]);
                _this._shuffle._rotary[i]["target"].constraintList = null;
            };
            _this._shuffle._firstRotate = true;
            _this._shuffle._startForce = 2;
            _this._shuffle._timesShuffle = 0;
            _this._shuffle._rotary = [];

        }, 3000);
    },
    showPhysicWorld: function(visiable) {
        //add debug for node
        this._debugNode = cc.PhysicsDebugNode.create(space);
        this._debugNode.visible = visiable;
        this.addChild(this._debugNode, gameConfig.INDEX.DEBBUGLAYER_INDEX);
    },
    createStaticEntity: function(object) {
        //1. create a sprite
        var sprite = new cc.Sprite(object.image);
        sprite.setPosition(object.position)
        sprite.scale = object.scale;
        sprite.collision_type = object.type;
        this.addChild(sprite, gameConfig.INDEX.EFFECTNODE_INDEX);

        //2. create a body
        var body = new cp.Body(Infinity, Infinity);
        body.setPos(sprite.getPosition());

        //3. create body with json file, first need load all vertices
        var _this = this;
        this.loadAllVerticesFromJson(object.json).then(function(data) {
            //when finish load json start convert vertices to points

            var PBE_scaleCoordinate = sprite.getBoundingBox().width;
            var PBE_offsetX = ((-sprite.anchorX) * (sprite.getBoundingBox().width)) + data["rigidBodies"][0]["origin"]["x"];
            var PBE_offsetY = ((-sprite.anchorY) * (sprite.getBoundingBox().height)) + data["rigidBodies"][0]["origin"]["y"];
            var PBE_vertices = data["rigidBodies"][0]["shapes"][0]["vertices"];
            var PBE_polygons = data["rigidBodies"][0]["polygons"];

            //load all shape
            //shape group
            var shapeGroup = [];
            for (var i = 0; i < PBE_polygons.length; i++) {
                shapeGroup[i] = [];
                var vertices = [];
                for (var j = PBE_polygons[i].length - 1; j >= 0; j--) {
                    vertices.push(PBE_offsetX + PBE_scaleCoordinate * PBE_polygons[i][j].x, PBE_offsetY + PBE_scaleCoordinate * PBE_polygons[i][j].y)
                }
                var polyShapeChip = new cp.PolyShape(body, vertices, cp.vzero);
                polyShapeChip.setElasticity(0.1);
                polyShapeChip.setFriction(10);
                polyShapeChip.surface_v = cp.vzero;
                polyShapeChip.setCollisionType(object.type);
                polyShapeChip.group = object.type;
                _this.space.addStaticShape(polyShapeChip);
                shapeGroup[i].push(polyShapeChip);
            }
            return {
                sprite: sprite,
                shape: shapeGroup,
                body: body
            }


        }).catch(function(error) {

            cc.log("An critical error happened ... ", error);

        });
    },
    createPhysicEntity: function(object) {
        //1. create a sprite
        var sprite = new PetSprite(object.image);
        sprite.scale = object.scale;
        sprite.colorType = object.colorType;
        sprite.isVisited = false;
        sprite.collision_type = object.type;
        // sprite.setTypeLabel(object.colorType);
        sprite.gameGroup = gameConfig.GAMEGROUP.PET;
        //2. create a body
        var body = new cp.Body(object.mass, cp.momentForBox(object.mass, sprite.getBoundingBox().width, sprite.getBoundingBox().height));
        body.setPos(object.position);
        body.v_limit = 500;
        this.space.addBody(body);
        sprite.setBody(body);
        this.addChild(sprite, gameConfig.INDEX.GAMELAYER_INDEX);
        var shapeGroup = [];

        //3. create body with json file, first need load all vertices
        var _this = this;
        this.loadAllVerticesFromJson(object.json).then(function(data) {
            //when finish load json start convert vertices to points
            var PBE_scaleCoordinate = sprite.getBoundingBox().width;
            var PBE_offsetX = ((-sprite.anchorX) * (sprite.getBoundingBox().width)) + data["rigidBodies"][0]["origin"]["x"];
            var PBE_offsetY = ((-sprite.anchorY) * (sprite.getBoundingBox().height)) + data["rigidBodies"][0]["origin"]["y"];
            var PBE_vertices = data["rigidBodies"][0]["shapes"][0]["vertices"];
            var PBE_polygons = data["rigidBodies"][0]["polygons"];

            //load all shape
            //shape group
            for (var i = 0; i < PBE_polygons.length; i++) {
                shapeGroup[i] = [];
                var vertices = [];
                for (var j = PBE_polygons[i].length - 1; j >= 0; j--) {
                    vertices.push(PBE_offsetX + PBE_scaleCoordinate * PBE_polygons[i][j].x, PBE_offsetY + PBE_scaleCoordinate * PBE_polygons[i][j].y)
                }
                var polyShapeChip = new cp.PolyShape(body, vertices, cp.vzero);
                polyShapeChip.setElasticity(0);
                polyShapeChip.setFriction(10);
                polyShapeChip.surface_v = cp.vzero;
                polyShapeChip.surface_vr = cp.vzero;
                polyShapeChip.setCollisionType(object.type);
                polyShapeChip.group = object.type;

                _this.space.addShape(polyShapeChip);
                shapeGroup[i].push(polyShapeChip);
            }

        }).catch(function(error) {

            cc.log("An critical error happened ... ", error);

        });
        this._allOfPets.push({
            sprite: sprite,
            shape: shapeGroup,
            body: body
        });
    },
    loadAllVerticesFromJson: function(json) {
        return new Promise(function(resolve, reject) {
            cc.loader.loadJson(json, function(error, data) {
                if (!error) {
                    // cc.log(JSON.stringify(data));
                    resolve(data);
                } else {
                    reject("Can not load json file ...");
                }
            })
        })
    },

    update: function(dt) {
        this.space.step(dt);
    }
});
var GameScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

//Create a "one by one" touch event listener (processes one touch at a time)
var petListener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function(touch, event) {
        var gameLayer = event.getCurrentTarget();
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
                        cc.log(beforeJoiner);
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
            gameLayer._effectNode.dropPetAnimation(gameLayer._effectNode.petEffected);
        }
        for (var i = 0; i < gameLayer._effectNode.petEffected.length; i++) {
            gameLayer._effectNode.petEffected[i]['target'].isVisited = false;
            gameLayer._effectNode.petEffected[i]['target'].tmpBlocked = false;
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
GameLayer.prototype.findPetHaveAlreadyJoin = function(gameLayer, touchPosition, arrayVisitedPet) {
    var lastTarget = arrayVisitedPet[arrayVisitedPet.length - 1]["target"];
    var previousTargetPos = arrayVisitedPet[arrayVisitedPet.length - 2]["target"].getPosition();
    var distanceLastPrePet = cc.pDistance(touchPosition, previousTargetPos);
    //remove this joiner
    if (distanceLastPrePet < joinerConfig.permitedJoinerDistance) {
        gameLayer._effectNode.removeChild(arrayVisitedPet[arrayVisitedPet.length - 1]["joiner"], true);
        gameLayer._effectNode.removeChild(arrayVisitedPet[arrayVisitedPet.length - 1]["fireAnimation"], true);
        gameLayer._effectNode._counterSegment = gameLayer._effectNode._counterSegment - 1;
        //reset lastTarget
        lastTarget.isVisited = false;
        gameLayer._effectNode.petEffected.splice(arrayVisitedPet.length - 1, 1);
    };
};
GameLayer.prototype.createPetObject = function(rows, cols, typepet, originalVertical, originalHorizontal, pos) {

    var size = cc.director.getWinSize();
    var originalVertical = originalVertical;
    var originalHorizontal = originalHorizontal;


    var x = originalHorizontal + pettile * cols;
    var y = originalVertical + pettile * rows;

    var position = pos != null ? pos : cc.p(x, y);
    //Math.floor(Math.random() * (max - min + 1)) + min;
    // var resourcePet = typeOfPet[Math.floor(Math.random() * ((typeOfPet.length - 1) - 0 + 1)) + 0];
    var resourcePet = typeTestOfPet[Math.floor(Math.random() * ((typeTestOfPet.length - 1) - 0 + 1)) + 0];

    var image = `${resourcePet}.png`;
    var json = `res/tsum/${resourcePet}.json`;
    var type = typepet == null ? this._commontype++ : typepet;

    var mass = massOfPets[cols];
    var scale = 1.2;
    var colorType = resourcePet;
    var style = "dinamic";
    return {
        position: position,
        image: image,
        json: json,
        type: type,
        mass: mass,
        scale: scale,
        style: style,
        colorType: colorType

    };
};