var GameLayer = cc.Layer.extend({
    world: null, //contain all physic
    _debugNode: null, //show element physics
    _showDebugger: true,
    _effectNode: null,
    _allOfPets: [],
    _colorTypeArray: [],
    _testMode: false,
    _commontype: startWithType,
    _shuffle: shuffleObj,
    _hintedColor: [],
    _allowedHint: true,
    _timeAddHint: 3, //5 second
    _timeLastedHint: 0,
    ctor: function() {
        this._super();
        this.init();
        var size = cc.director.getWinSize();
        //setup for draw test
        this._effectNode = new EffectLayer();
        this._effectNode.setTag(gameConfig.TAG.TEMP_ANI_TAG);
        this.addChild(this._effectNode, gameConfig.INDEX.EFFECTNODE_INDEX);

        //define physic world
        this.initPhysicsWorld();
        //turn on or off debug node physic
        this.showPhysicWorld(this._showDebugger);
        // //create an object physic sprite
        var pos1 = cc.p(size.width / 2, size.height / 2 + 200);
        var pos2 = cc.p(size.width / 2, size.height / 2);
        //
        //create polygonshape for multifixture
        // var posGround = cc.p(size.width / 2, 0);
        // var scaleGround = 1.0;
        // var massGround = 10;
        // var jsonPathGround = res.gameBackground_JSON;
        // var styleGround = 'ground';

        // var objectGround = this.createPetObject(posGround, scaleGround, massGround, jsonPathGround, styleGround);
        // this.createGround(objectGround);

        //create polygonshape for multifixture

        var rows = 7;
        var cols = 5;

        var PetProperties = [];
        for (var i = 0; i < rows; i++) {
            PetProperties[i] = [];
            for (var j = 0; j < cols; j++) {
                // var scale = Math.floor(Math.random() * (1.2 - 0.5 + 1)) + 0.5;
                var scale = 1.0;
                var mass = massOfPets[Math.floor(Math.random() * (massOfPets.length - 1 - 0 + 1)) + 0];
                var json = 'random';
                var style = 'dynamic';
                var property = this.createPetObject(mass, scale, json, style);
                PetProperties[i].push(property);
            }
        };
        //

        var startX = 100;
        var startY = size.height / 2 - 220;
        var loadedPet = [];

        for (var i = 0; i < PetProperties.length; i++) {

            loadedPet[i] = [];

            for (var j = 0; j < PetProperties[i].length; j++) {

                var pet = PetProperties[i][j].sprite;
                var s = pet.getContentSize();
                var posArray = this.createDataPosition(s, startX, startY);
                var index = Math.floor(Math.random() * (posArray[i].length - 1 - 0 + 1)) + 0;

                if (loadedPet[i].includes(index)) {
                    index = findOtherPosition(index, posArray[i], loadedPet[i]);
                };
                var pos = posArray[i][index];

                loadedPet[i].push(index);
                this.createMultiPolygonEntity(PetProperties[i][j], pos);
            }
        };

        //listen mouse event click on gameLayer
        cc.eventManager.addListener(PetMouseListener, this);
        //update for hint color same type random pet, after 3 seconds program will auto find random color to hint
        //this hint will diable when user click, wait if user don't click after 3s then hint

        //need update for physics requirement
        this.scheduleUpdate();
    },
    init: function() {
        this._super();
        var size = cc.director.getWinSize();
        //background image
        var size = cc.director.getWinSize();
        // var GameBackground = cc.Sprite.create(res.gameBackground);
        // GameBackground.setPosition(cc.p(size.width / 2, size.height / 2));
        // this.addChild(GameBackground, gameConfig.INDEX.ANIMATIONPET_INDEX);
        // end test

        //add shuffle button
        //2.create a menu and assign onPlay event callback to it
        var norShuffle = cc.Sprite.create(res.Shuffle_Button_Nor);
        var selShuffle = cc.Sprite.create(res.Shuffle_Button_Sel);
        // //test mode
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

    },
    initPhysicsWorld: function() {
        var screenSize = cc.director.getWinSize();

        var gravity = new b2Vec2(0, -9.8);
        this.world = new b2World(gravity, true); //true allow sleep
        this.world.SetContinuousPhysics(true); //
        //
        var lstPetCollision = new Box2D.Dynamics.b2ContactListener;
        lstPetCollision.BeginContact = this.BeginContactLst.bind(this);
        lstPetCollision.EndContact = this.EndContactLst.bind(this);
        lstPetCollision.PreSolve = this.PreSolveLst.bind(this);
        lstPetCollision.PostSolve = this.PostSolveLst.bind(this);
        this.world.SetContactListener(lstPetCollision);
        //official
        var fixDef = new b2FixtureDef;
        fixDef.userData = null;
        fixDef.isSensor = false;
        fixDef.density = 500.0;
        fixDef.friction = 0.1;
        fixDef.restitution = 0.0;

        var bodyDef = new b2BodyDef;
        bodyDef.angularDamping = 0;
        bodyDef.linearDamping = 0;
        bodyDef.fixedRotation = true;
        //create ground
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(screenSize.width / PTM_RATIO, 2);
        // upper
        bodyDef.position.Set(0, screenSize.height / PTM_RATIO);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        // bottom
        bodyDef.position.Set(0, 0);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        fixDef.shape.SetAsBox(2, screenSize.height / PTM_RATIO);
        // left
        bodyDef.position.Set(0, 0);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        // right
        bodyDef.position.Set(screenSize.width / PTM_RATIO, 0);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        //end official

    },
    shuffleAllPhysics: function() {
        //We need limit speed or velocity limit
        //A torque equal to T = IV/t I: rotational inertia(quan tinh quay), V: velocity, t is the time we will apply the torque,
        //refer to http://www.iforce2d.net/b2dtut/rotate-to-angle
        //>> Rotate all body physic avaiable // maybe activated when hintbody == 0 <<//
        var timeApplyTorque = 1.0;
        var desiredAngle = 300 * 360 * Math.PI / 180; //how many turn do you want(300 times with 360 degress rotation =))
        //find all parameter relatively with above formulas
        for (var i = 0; i < this._allOfPets.length; i++) {
            var body = this._allOfPets[i].body;

            var inertia = body.GetInertia();
            var AV = body.GetAngularVelocity();
            var totalRotation = desiredAngle - AV;
            if (totalRotation > 180 * Math.PI / 180) {
                totalRotation -= 360 * Math.PI / 180;
            };
            if (totalRotation < -180 * Math.PI / 180) {
                totalRotation += 360 * Math.PI / 180;
            };
            var T = inertia * (totalRotation) / timeApplyTorque;
            //do it now
            body.ApplyTorque(T);
        };

    },
    showPhysicWorld: function(visiable) {
        //add debug for node
        if (visiable) {

            var oldDebugDrawCanvas = document.getElementById("debugDrawCanvas");
            if (oldDebugDrawCanvas) {
                document.getElementById("Cocos2dGameContainer").removeChild(oldDebugDrawCanvas);
            };
            var scale = PTM_RATIO * cc.EGLView._getInstance().getViewPortRect().width / cc.EGLView._getInstance().getDesignResolutionSize().width;
            var gameCanvas = document.getElementById("gameCanvas");
            var gameContainer = document.getElementById("Cocos2dGameContainer");
            //
            var debugCanvas = document.createElement("canvas");
            debugCanvas.id = "debugDrawCanvas";
            debugCanvas.height = gameCanvas.height;
            debugCanvas.width = gameCanvas.width;
            debugCanvas.style.height = gameCanvas.style.height;
            debugCanvas.style.width = gameCanvas.style.width;
            debugCanvas.style.position = "absolute";
            debugCanvas.style.outline = "none";
            debugCanvas.style.left = "0px";
            debugCanvas.style.top = gameContainer.style.paddingTop;
            debugCanvas.style["-webkit-transform"] = "rotate(180deg) scale(-1,1)";
            debugCanvas.style["pointer-events"] = "none";
            gameContainer.appendChild(debugCanvas);
            //
            this.debugDraw = new Box2D.Dynamics.b2DebugDraw();
            this.debugDraw.SetSprite(debugCanvas.getContext("2d"));
            this.debugDraw.SetDrawScale(scale);
            this.debugDraw.SetFillAlpha(0.3);
            this.debugDraw.SetLineThickness(1.0);
            //
            var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
            this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_edgeShape);
            this.world.SetDebugDraw(this.debugDraw);
        };
    },
    update: function(dt) {
        var velocityIterations = 10;
        var positionIterations = 30;
        var fps = 60;
        var timeStep = 1.0 / (fps * 0.8);
        this.world.Step(timeStep, velocityIterations, positionIterations);
        for (var b = this.world.GetBodyList(); b; b = b.GetNext()) {
            if (b.GetUserData() != null) {
                //Synchronize the AtlasSprites position and rotation with the corresponding body
                var bodies = b.GetUserData();
                bodies.x = b.GetPosition().x * PTM_RATIO;
                bodies.y = b.GetPosition().y * PTM_RATIO;
                bodies.rotation = -1 * cc.radiansToDegrees(b.GetAngle());
            };
        };
        this.world.DrawDebugData();
        this.world.ClearForces();
        //update
        this._timeLastedHint += dt;
        if (this._timeLastedHint > this._timeAddHint) {

            if (this._allowedHint) {
                this.hintSameColor();
                this._timeLastedHint = 0;
            } else {
                this._timeLastedHint = 0;
            };
        }; //end hint
    }
});
var GameScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});


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

GameLayer.prototype.createDataPosition = function(s, startX, startY) {
    var pos = [];
    for (var i = 0; i < maxRows; i++) {
        pos[i] = [];
        for (var j = 0; j < maxCols; j++) {
            var x = startX + offSetPetX + j * s.width;
            var y = startY + offSetPetY + i * s.height;
            pos[i].push(cc.p(x, y));
        }
    };
    return pos;
};
GameLayer.prototype.createPetObject = function(mass, scale, jsonPath, style) {

    var size = cc.director.getWinSize();
    //Math.floor(Math.random() * (max - min + 1)) + min;
    // var resourcePet = typeOfPet[Math.floor(Math.random() * ((typeOfPet.length - 1) - 0 + 1)) + 0];
    var resourcePet = typeTestOfPet[Math.floor(Math.random() * ((typeTestOfPet.length - 1) - 0 + 1)) + 0];
    var json = null;
    var image = null;
    var colorType = null;
    if (jsonPath != 'random') {
        json = jsonPath;
    } else {
        json = `res/tsum/${resourcePet}.json`;
        image = `${resourcePet}.png`;
    };
    var sprite = new PetSprite(image);
    sprite.scale = scale;

    return {
        json: json,
        image: image,
        mass: mass,
        style: style,
        sprite: sprite
    };
};
GameLayer.prototype.createMultiPolygonEntity = function(object, pos) {

    var size = cc.director.getWinSize();
    var jsonPath = object.json;
    var _this = this;

    this.loadAllVerticesFromJson(jsonPath).then(function(data) {

        var rigidBodies = data.rigidBodies[0];
        var colorType = rigidBodies.name;
        var polygons = rigidBodies.polygons;

        var sprite = object.sprite;
        sprite.setPosition(pos);
        _this.addChild(sprite, gameConfig.INDEX.GAMELAYER_INDEX);
        var s = sprite.getContentSize();

        //
        var eachPolygon = [];
        for (var i = 0; i < polygons.length; i++) {
            eachPolygon[i] = [];
            for (var j = 0; j < polygons[i].length; j++) {
                var x = ((polygons[i][j].x) - 0.5) * s.width / PTM_RATIO;
                var y = ((polygons[i][j].y) - 0.5) * s.height / PTM_RATIO;
                eachPolygon[i].push({
                    x,
                    y
                });
            }
        };
        //
        cc.log(">>ONE<<")
        cc.log(eachPolygon);
        // define a body def
        var bodyDef = new b2BodyDef;
        if (object.style != 'static') {
            bodyDef.type = b2Body.b2_dynamicBody;
            sprite.colorType = colorType;
            sprite.isVisited = false;
            sprite.hinted = false;
        } else {
            bodyDef.type = b2Body.b2_staticBody;
        }
        bodyDef.position.Set(pos.x / PTM_RATIO, pos.y / PTM_RATIO);
        bodyDef.userData = sprite;
        var body = _this.world.CreateBody(bodyDef);
        body.SetAngularDamping(0);
        var fixture = [];
        // define a fixture def
        var dataArea = [];
        cc.log(eachPolygon);
        for (var i = 0; i < eachPolygon.length; i++) {
            var fixDef = new b2FixtureDef;
            fixDef.density = Math.floor(object.mass / eachPolygon.length);
            fixDef.friction = 0.1;
            fixDef.restitution = 0.0;
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsArray(eachPolygon[i], eachPolygon[i].length);
            var fixt = body.CreateFixture(fixDef);
            fixture.push(fixt);
        };
        // body.SetMassData(object.mass);
        // cc.log("MassData",body.GetMassData());
        // body.GetFixtureList().SetDensity(object.mass);
        var finalObj = {
            body: body,
            fixture: fixture,
            sprite: sprite
        };
        _this._allOfPets.push(finalObj);

    }).catch(function(error) {
        cc.log("We can't load json file, please check again ...");
        cc.log(error);
    })
};
GameLayer.prototype.loadAllVerticesFromJson = function(json) {
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
};

GameLayer.prototype.createGround = function(object) {
    var size = cc.director.getWinSize();

    var jsonPath = object.json;
    var _this = this;
    this.loadAllVerticesFromJson(jsonPath).then(function(data) {
        var rigidBodies = data.rigidBodies[0];
        var colorType = rigidBodies.name;
        var imagePath = object.imagePath;
        var polygons = rigidBodies.polygons;

        var sprite = new cc.Sprite.create(imagePath);
        sprite.setPosition(object.position);
        sprite.scale = object.scale;
        var s = sprite.getContentSize();

        //
        var eachPolygon = [];
        for (var i = 0; i < polygons.length; i++) {
            eachPolygon[i] = [];
            for (var j = 0; j < polygons[i].length; j++) {
                var x = ((polygons[i][j].x) - 0.5) * s.width / PTM_RATIO;
                var y = ((polygons[i][j].y)) * s.height / PTM_RATIO;
                eachPolygon[i].push({
                    x,
                    y
                });
            };
        };
        // define a body def
        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.Set(object.position.x / PTM_RATIO, object.position.y / PTM_RATIO);
        bodyDef.userData = null;
        _this.removeChild(sprite, true);

        var body = _this.world.CreateBody(bodyDef);
        // define a fixture def
        for (var i = 0; i < eachPolygon.length; i++) {
            var fixDef = new b2FixtureDef;
            fixDef.density = object.mass;
            fixDef.friction = 0.1;
            fixDef.restitution = 0.0;
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsArray(eachPolygon[i], eachPolygon[i].length);
            body.CreateFixture(fixDef);
        }; //

    }).catch(function(error) {
        cc.log("We can't load json file, please check again ...");
        cc.log(error);
    })
};
GameLayer.prototype.hintSameColor = function() {
    //reset all status
    if (this._allowedHint == false) return;
    for (var i = 0; i < this._allOfPets.length; i++) {

        this._allOfPets[i].sprite.hinted = false;
        this._allOfPets[i].sprite.setTypeLabel("");

    };

    //de dam bao rang moi luc hint ty le trung 100% thi bat buoc object nay phai dang colision
    //bay gio phai check tat ca cac doi tuong dang colision voi nhau ma cung mau
    var firstObj = null;
    var randomPet = [];
    var index = 0;
    for (var i = 0; i < this._allOfPets.length; i++) {

        var childrens = this.getColorArrayRandom(this._allOfPets[i].sprite);

        if (childrens.length > 0) {
            randomPet[index] = [];
            randomPet[index].push(this._allOfPets[i].sprite);
            for (var j = 0; j < childrens.length; j++) {
                randomPet[index].push(childrens[j]);
            }
            index++;
        };
    };
    //random array pet
    if (this._allOfPets && randomPet.length > 0) {
        for (var i = 0; i < randomPet.length; i++) {
            for (var j = 0; j < randomPet[i].length; j++) {
                var pet = randomPet[i][j];
                if (!this._colorTypeArray.includes(pet.colorType)) {
                    this._colorTypeArray.push(pet.colorType);
                };
            }
        };
    };
    //permit hint same color
    if (randomPet.length > 0) {
        //root path
        firstObj = this.createAHintedColor(randomPet);
        firstObj.setName("Root");
        var pathToLeaf = [];
        //loop all pet, stucking here but must done
        this.findNeighbour(firstObj, pathToLeaf);
    };
    //require an action for shuffle pet
    if (randomPet.length == 0) {
        cc.log("Please shuffle, we don't find any match same color in this turn ...");
    };
};
GameLayer.prototype.createAHintedColor = function(array) {

    var index = 0;
    var color = 0;
    var count = 0;
    do {
        index = Math.floor(Math.random() * (array.length - 1 - 0 + 1)) + 0;
        target = array[index][0];
        color = target.colorType;
        count++;
    }
    while (this._hintedColor.includes(color) && count < 3); //only permit try to find pet not to over 3 times

    this._hintedColor.push(color);
    if (this._hintedColor.length == this._colorTypeArray.length) {

        cc.log("Reseting!\nReach to max color clickable ... ");
        this._hintedColor.splice(0, this._hintedColor.length);
    };
    return target;
};

GameLayer.prototype.getColorArrayRandom = function(node) {
    var childrens = [];
    for (var i = 0; i < this._allOfPets.length; i++) {
        var startObj = node;
        var s = startObj.getContentSize();
        var originRange = s.width / 2;
        var bonusLength = s.width / 2;
        var totalRange = originRange + bonusLength;
        var dist = cc.pDistance(startObj.getPosition(), this._allOfPets[i].sprite.getPosition());
        if (dist > originRange && dist < totalRange) {
            if (this._allOfPets[i].sprite.colorType === node.colorType) {
                childrens.push(this._allOfPets[i].sprite);
            };
        };
    };
    return childrens;
};

GameLayer.prototype.findNeighbour = function(branch, path) {
    if (!path.includes(branch)) {
        path.push(branch);
    };
    var childrens = [];
    var s = branch.getContentSize();
    var originRange = s.width / 2;
    var bonusLength = s.width + s.width / 2;
    var totalRange = originRange + bonusLength;

    for (var i = 0; i < this._allOfPets.length; i++) {
        var dist = cc.pDistance(branch.getPosition(), this._allOfPets[i].sprite.getPosition());
        if (dist > originRange && dist < totalRange) {

            if (this._allOfPets[i].sprite.colorType === branch.colorType && branch != this._allOfPets[i].sprite && this._allOfPets[i].sprite.hinted != true) {
                this._allOfPets[i].sprite.hinted = true;
                var goodToAdd = this.checkOnStraightLine(branch, this._allOfPets[i].sprite);
                if (goodToAdd != false) {
                    childrens.push(this._allOfPets[i].sprite);
                };
            };

        };
    };
    // debugger
    //
    if (childrens.length > 0) {
        for (var i = 0; i < childrens.length; i++) {
            if (!path.includes(childrens[i])) {
                path.push(childrens[i]);
            };
        };
        for (var i = 0; i < childrens.length; i++) {
            this.findNeighbour(childrens[i], path);
        };
    };
    if (childrens.length == 0) {
        //here should be run action for same color pet
        for (var i = 0; i < path.length; i++) {

            // path[i].setTypeLabel(`${i}`);
            this.runHintEffect(path[i]);


        };
    };

};
GameLayer.prototype.checkOnStraightLine = function(root, distination) {
    var rootPos = root.getPosition();
    var distPos = distination.getPosition();

    var radiusScan = cc.pDistance(rootPos, distPos);
    var angleRootToDest = cc.radiansToDegrees(Math.atan2(distPos.y - rootPos.y, distPos.x - rootPos.x));

    for (var i = 0; i < this._allOfPets.length; i++) {

        var currentPet = this._allOfPets[i].sprite;

        var currentPos = currentPet.getPosition();
        var dist = cc.pDistance(rootPos, currentPos);

        var angleRootToInradius = cc.radiansToDegrees(Math.atan2(currentPos.y - rootPos.y, currentPos.x - rootPos.x));

        if (dist > root.getContentSize().width / 2 && dist < radiusScan && currentPet.colorType != root.colorType) {
            //check angle
            if ((angleRootToInradius < (angleRootToDest + joinerConfig.offsetAngle)) && (angleRootToInradius > (angleRootToDest - joinerConfig.offsetAngle))) {
                return false;
                break;
            }
        };
    };

};
GameLayer.prototype.runHintEffect = function(target) {
    var action2 = cc.tintTo(1.5, 89, 83, 83);
    var action2Back = cc.tintTo(1.5, -10, -10, -10);
    var seq = cc.sequence(action2.clone(), action2Back.clone());
    target.runAction(seq);
};
GameLayer.prototype.getChilds = function(node) {
    node.hinted = true;
    var childrens = [];

    for (var i = 0; i < this._allOfPets.length; i++) {
        var startObj = node;
        var s = startObj.getContentSize();
        var originRange = s.width / 2;
        var bonusLength = s.width / 2;
        var totalRange = originRange + bonusLength;
        var dist = cc.pDistance(startObj.getPosition(), this._allOfPets[i].sprite.getPosition());
        if (dist > originRange && dist < totalRange) {
            if (this._allOfPets[i].sprite.colorType === node.colorType && node != this._allOfPets[i].sprite && this._allOfPets[i].sprite.hinted != true) {

                this._allOfPets[i].sprite.hinted = true;
                this._allOfPets[i].sprite.setName(`childrens ${i}`);
                childrens.push(this._allOfPets[i].sprite);
            };
        };
    };

    return childrens;
};
GameLayer.prototype.BeginContactLst = function(contact) {
    //
};
GameLayer.prototype.EndContactLst = function(contact) {
    //
};
GameLayer.prototype.PreSolveLst = function(contact, oldManifold) {
    //
};
GameLayer.prototype.PostSolveLst = function(contact, impulse) {
    var fixtureA = contact.GetFixtureA();
    var fixtureB = contact.GetFixtureB();
    var bodyA = fixtureA.GetBody();
    var bodyB = fixtureB.GetBody();
    var userDataBodyA = bodyA.GetUserData();
    var userDataBodyB = bodyB.GetUserData();
    if ((userDataBodyA && userDataBodyB) != null) {
        var maxSpeed = 2.0;
        var velA = bodyA.GetLinearVelocity();
        var velB = bodyB.GetLinearVelocity();

        var speedA = velA.Length();
        var speedB = velB.Length();
        var world = bodyA.GetWorld();
        if ((speedA || speedB) > maxSpeed) {
            
            bodyA.SetLinearVelocity(new b2Vec2(bodyA.GetLinearVelocity().x, bodyA.GetLinearVelocity().y));
            bodyB.SetLinearVelocity(new b2Vec2(bodyB.GetLinearVelocity().x, bodyB.GetLinearVelocity().y));
        }

    };
};