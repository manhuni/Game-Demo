var GameLayer = cc.Layer.extend({
    space: null, //contain all physic
    _debugNode: null, //show element physics
    _showDebugger: false,
    _effectNode: null,
    _allOfPets: [],
    _testMode: false,
    _shuffle: {
        _stepShuffle: 6.1,
        _timesShuffle: 0,
        _rotary: []
    },
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

        var rows = 6;
        var cols = 6;
        var totalPet = rows * cols;
        var pettile = 70;
        var commontype = 4444;
        var originalVertical = size.height / 2;
        var originalHorizontal = 50;
        cc.spriteFrameCache.addSpriteFrames(res.TSUM_PLIST, res.TSUM_PNG);
        var myAllPets = [];
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var x = originalHorizontal + 50 + pettile * j;
                var y = originalVertical + 30 + pettile * i;
                var position = cc.p(x, y);
                //Math.floor(Math.random() * (max - min + 1)) + min;
                var resourcePet = typeOfPet[Math.floor(Math.random() * ((typeOfPet.length - 1) - 0 + 1)) + 0];
                var image = `${resourcePet}.png`;
                var json = `res/tsum/${resourcePet}.json`;
                var type = commontype++;
                var mass = massOfPets[i];
                var scale = 1.0;
                var colorType = resourcePet;
                var style = "dinamic";
                myAllPets.push({
                    position: position,
                    image: image,
                    json: json,
                    type: type,
                    mass: mass,
                    scale: scale,
                    style: style,
                    colorType: colorType

                })
            }
        };

        //create a entity and need return some body and shape, sprite
        //add game play bounder
        this.createStaticEntity(bounderGame);
        //add pet
        for (var i = 0; i < myAllPets.length; i++) {
            this.createPhysicEntity(myAllPets[i]);
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
        menu.setPosition(size.width - 100, 170);
        this.addChild(menu, gameConfig.INDEX.SHUFFLE_INDEX);
        //create inner background
        // var sprite = cc.Sprite.create(res.gameBackground_inner);
        // sprite.setPosition(cc.p(size.width / 2, size.height / 2));
        // this.addChild(sprite, gameConfig.INDEX.GAMELAYER_INDEX);
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
        // var _this = this;
        // var maxForce = 15.00;
        // this._shuffle._timesShuffle++;
        // if (this._shuffle._timesShuffle < 10) {

        //     for (var i = 0; i < this._children.length; i++) {
        //         if (_this._children[i].gameGroup != 0) {
        //             continue;
        //         } else {
        //             var rate = _this._children[i].body.a + _this._shuffle._stepShuffle;
        //             rate > maxForce ? rate = maxForce : rate = rate;
        //             var physicsSprite = _this._children[i];
        //             var body = physicsSprite.body;
        //             var motor = new cp.SimpleMotor(_this.space.staticBody, body, rate);

        //             _this.space.addConstraint(motor);

        //             _this._shuffle._rotary.push({
        //                 target: body,
        //                 constraint: motor,
        //             });
        //             _this._shuffle._stepShuffle++;

        //         }
        //     };
        // } else {
        //     // cc.log("Haha",_this._shuffle._rotary)
        //     // for (var i = 0; i < _this._shuffle._rotary.length; i++) {

        //     //     _this.space.removeConstraint(_this._shuffle._rotary[i].constraint); 
        //     //     cc.log("Hu",i)
        //     // }; 

        // }

        // setTimeout(function() {
        //     for (var i = 0; i < _this.space.constraints.length; i++) {
        //         _this.space.removeConstraint(_this.space.constraints[i]);
        //     };
        // }, 5000);
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
                polyShapeChip.setElasticity(0);
                polyShapeChip.setFriction(0.5);
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
                // polyShapeChip.surface_v = cp.vzero;
                // polyShapeChip.surface_vr = cp.vzero;
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
        })
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
        var target = event.getCurrentTarget();
        //08.03.2019//click
        var allChildenOfGameLayer = target._children;
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
                target._effectNode._counterSegment = target._effectNode._counterSegment + 1;

                // //Adding a fire animation at center target pet
                var fireAnimation = target._effectNode.addFireAnim(petObject[i]);
                petObject[i].isVisited = true;

                // firstPoint = petObject[i].getPosition();
                // tempWidth = petObject[i].getBoundingBox();
                // //Group all component of pet(fire, join, it'self to control(delete, point, ...))
                target._effectNode.petEffected.push({
                        target: petObject[i],
                        fireAnimation: fireAnimation,
                        joiner: null
                    })
                    // //Magnify target pet(effect ... )
                // target._effectNode.glowUpPet(target._effectNode.petEffected[target._effectNode.petEffected.length - 1]['target']);
                return true;
            }
        }
        return false
    },
    onTouchMoved: function(touch, event) {
        // We will add joiner from here
        var target = event.getCurrentTarget();
        var lastTarget = target._effectNode.petEffected[target._effectNode.petEffected.length - 1]["target"];
        // Check all position of pets to evaluate distance need join
        var allChildenOfGameLayer = target._children;
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
            if(target._effectNode.petEffected.length >= 2){
                var alreadyJoinPet = target.findPetHaveAlreadyJoin(target,touch.getLocation(),target._effectNode.petEffected);
            }
            var nearestPoint = target.findNearestPosition(lastTarget, touch.getLocation(), petNoneVisted);
            

            if (nearestPoint != -1) {
                cc.log("nearestPoint", petNoneVisted[nearestPoint].colorType);
                if (petNoneVisted[nearestPoint].colorType == lastTarget.colorType) {
                    //if same color then permit join but must check
                    //have any pet cross this path joiner
                    var radiusScan = cc.pDistance(lastTarget.getPosition(), petNoneVisted[nearestPoint].getPosition());
                    var inrangeRadiusArray = target.findInrangePet(radiusScan, lastTarget, petNoneVisted);
                    //check in this path have any pet under
                    target.findPetUnderPath(inrangeRadiusArray, lastTarget, petNoneVisted[nearestPoint]).then(function(data) {
                        var isPetUnderPathObj = data;
                        cc.log("Data ne", isPetUnderPathObj)
                        if (isPetUnderPathObj.isPetUnder != false) {
                            cc.log("Biet dau, noi di chu")
                            petNoneVisted[nearestPoint].isVisited = true;
                            // First we will blow up that sprite
                            target._effectNode._counterSegment = target._effectNode._counterSegment + 1;

                            var angle = isPetUnderPathObj.angle;
                            // define a new segment
                            var joinerSprite = cc.Sprite.create(res.Joiner_PNG);
                            joinerSprite.attr({
                                    x: lastTarget.getPosition().x,
                                    y: lastTarget.getPosition().y,
                                    anchorX: 0,
                                    anchorY: 0.5,
                                    scaleY: gameConfig.SCALE.JOINER_FIXED_SCALEY,
                                    scaleX: scaleRatioX,
                                    rotation: angle
                                })
                                // TINH KHOANG CACH TU POSA -> POSB DE DIEU CHINH SCALE PHU HOP
                            var disScaleRelative = cc.pDistance(lastTarget.getPosition(), petNoneVisted[nearestPoint].getPosition());
                            var widthOfJoiner = joinerSprite.width * gameConfig.SCALE.JOINER_FIXED_SCALEX; // pixel
                            var scaleRatioX = disScaleRelative * gameConfig.SCALE.JOINER_FIXED_SCALEX / widthOfJoiner;
                            joinerSprite.scaleX = scaleRatioX;

                            joinerSprite.setTag(gameConfig.TAG.JOIN_ANIM)
                            target._effectNode.addChild(joinerSprite, gameConfig.INDEX.EFFECTNODE_JOIN_INDEX);
                            var fireAnimation = target._effectNode.addFireAnim(petNoneVisted[nearestPoint]);

                            // add all into one
                            target._effectNode.petEffected.push({
                                target: petNoneVisted[nearestPoint],
                                fireAnimation: fireAnimation,
                                joiner: joinerSprite
                            })
                            // target._effectNode.glowDownPet(target._effectNode.petEffected[target._effectNode.petEffected.length - 2]['target']);
                            // target._effectNode.glowUpPet(target._effectNode.petEffected[target._effectNode.petEffected.length - 1]['target']);

                        }
                    }).catch(function(error) {
                        cc.log("We are meeting an error, please check carefully ...");
                        cc.log(error);
                    });

                }
            }

        }
    },
    onTouchEnded: function(touch, event) {
        // o day can kiem tra dieu kien de tinh diem va loai bo cac doi tuong
        var target = event.getCurrentTarget();
        // phai reset lai all target
        // o day can xet xem do dai cua doi tuong co dam bao lon hon 2 hay khong
        if (target._effectNode.petEffected.length > 2) {
            target._effectNode.dropPetAnimation(target._effectNode.petEffected);
        }
        for (var i = 0; i < target._effectNode.petEffected.length; i++) {
            target._effectNode.petEffected[i]['target'].isVisited = false;
            target._effectNode.petEffected[i]['target'].tmpBlocked = false;
        }
        target._effectNode.removeAllChildren();
        // target._effectNode.glowDownPet(target._effectNode.petEffected[target._effectNode.petEffected.length - 1]['target']);

        target._effectNode.petEffected = [];
        target._effectNode._counterSegment = 0;
        //un register/remove all handle listenner
        return false
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

    return new Promise(function(resolve, reject) {
        var originPos = lastTarget.getPosition();
        var destinationPos = nearestTarget.getPosition();

        var angleOrgToDest = cc.radiansToDegrees(Math.atan2(destinationPos.y - originPos.y, destinationPos.x - originPos.x));
        var petUnderPath = [];
        var isPetUnder = null;
        //
        cc.log(inrangeRadiusArray)

        for (var i = 0; i < inrangeRadiusArray.length; i++) {

            var inRadiusPetPos = inrangeRadiusArray[i].getPosition();
            var angleOrgToInradius = cc.radiansToDegrees(Math.atan2(inRadiusPetPos.y - originPos.y, inRadiusPetPos.x - originPos.x));

            if ((angleOrgToInradius > (angleOrgToDest - joinerConfig.offsetAngle)) && (angleOrgToInradius < (angleOrgToDest + joinerConfig.offsetAngle))) {
                cc.log("We don't permit you join this destination pet ...");
                cc.log("Angle org ...", angleOrgToInradius);
                cc.log("Angle ...", angleOrgToDest);
                isPetUnder = false;
                break;
            } else {
                isPetUnder = true;
            };

        };
        cc.log("We are checking, please wait a moment ...");
        resolve({
            isPetUnder: isPetUnder,
            angle: angleOrgToDest
        });
    })

};
GameLayer.prototype.findPetHaveAlreadyJoin = function(target,touchPosition,arrayVisitedPet){
    var lastTarget = arrayVisitedPet[arrayVisitedPet.length-1]["target"];
    var previousTargetPos = arrayVisitedPet[arrayVisitedPet.length-2]["target"].getPosition();
    var distanceLastPrePet = cc.pDistance(touchPosition,previousTargetPos);
    //remove this joiner
    if(distanceLastPrePet < joinerConfig.permitedJoinerDistance){
        target._effectNode.removeChild(arrayVisitedPet[arrayVisitedPet.length-1]["joiner"],true);
        target._effectNode.removeChild(arrayVisitedPet[arrayVisitedPet.length-1]["fireAnimation"],true);
        target._effectNode._counterSegment = target._effectNode._counterSegment - 1;
        //reset lastTarget
        lastTarget.isVisited = false;
        target._effectNode.petEffected.splice(arrayVisitedPet.length-1,1);
    };
}