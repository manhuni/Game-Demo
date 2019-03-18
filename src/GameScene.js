var GameLayer = cc.Layer.extend({
    world: null, //contain all physic
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
        var cols = 7;

        var PetProperties = [];
        for(var i = 0; i<rows; i++){
            PetProperties[i] = [];
            for(var j = 0; j<cols; j++){
                // var scale = Math.floor(Math.random() * (1.2 - 0.5 + 1)) + 0.5;
                var scale = 1.0;
                var mass = Math.floor(Math.random() * (massOfPets.length-1 - 0 + 1)) + 0;
                var json = 'random';
                var style = 'dynamic';
                var property = this.createPetObject(mass,scale,json,style);
                PetProperties[i].push(property);
            }
        };
        //

        var startX = 50; var startY = size.height/2-220;
        var loadedPet = [];

        for(var i = 0; i<PetProperties.length; i++){

            loadedPet[i] = [];

            for(var j = 0; j<PetProperties[i].length;j++){

                var pet = PetProperties[i][j].sprite;
                var s = pet.getBoundingBox();
                var posArray = this.createDataPosition(s,startX,startY);
                var index = Math.floor(Math.random() * (posArray[i].length-1 - 0 + 1)) + 0;

                if(loadedPet[i].includes(index)){
                    index = findOtherPosition(index,posArray[i],loadedPet[i]);
                };
                var pos = posArray[i][index];

                loadedPet[i].push(index);
                this.createMultiPolygonEntity(PetProperties[i][j],pos);
            }
        };

        //listen mouse event click on gameLayer
        cc.eventManager.addListener(PetMouseListener, this);
        //need update for physics requirement
        this.scheduleUpdate();
    },
    init: function() {
        this._super();
        var size = cc.director.getWinSize();
        //background image
        var size = cc.director.getWinSize();
        var GameBackground = cc.Sprite.create(res.gameBackground);
        GameBackground.setPosition(cc.p(size.width/2, size.height / 2));
        this.addChild(GameBackground, gameConfig.INDEX.ANIMATIONPET_INDEX);
        // end test

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
        
    },
    initPhysicsWorld: function() {
        var screenSize = cc.director.getWinSize();
        var b2Vec2 = Box2D.Common.Math.b2Vec2,
            b2BodyDef = Box2D.Dynamics.b2BodyDef,
            b2Body = Box2D.Dynamics.b2Body,
            b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
            b2Fixture = Box2D.Dynamics.b2Fixture,
            b2World = Box2D.Dynamics.b2World,
            b2MassData = Box2D.Collision.Shapes.b2MassData,
            b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
            b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
            b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
        var gravity = new b2Vec2(0, -9.8);
        this.world = new b2World(gravity, true); //true allow sleep
        this.world.SetContinuousPhysics(true);
        //official
        var fixDef = new b2FixtureDef;
        fixDef.userData = null;
        fixDef.isSensor = false;
        fixDef.density = 100.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;

        var bodyDef = new b2BodyDef;
        bodyDef.angularDamping = 0;
        bodyDef.linearDamping = 0;
        // bodyDef.fixedRotation = true;
        //create ground
        bodyDef.type = b2Body.b2_staticBody;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(screenSize.width / PTM_RATIO, 0.1);
        // upper
        bodyDef.position.Set(0, screenSize.height / PTM_RATIO);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        // bottom
        bodyDef.position.Set(0, 0 + 2);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);

        fixDef.shape.SetAsBox(0.1, screenSize.height / PTM_RATIO);
        // left
        bodyDef.position.Set(0, 0);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        // right
        bodyDef.position.Set(screenSize.width / PTM_RATIO, 0);
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
        //end official

        return {
            name: 'BounderGame'
                // bodyDef: bodyDef,
                // fixDef: fixDef
        }
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
            console.log(this.debugDraw);

            var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
            this.debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit | b2DebugDraw.e_edgeShape);
            this.world.SetDebugDraw(this.debugDraw);

            console.log(scale);
        }
    },
    update: function(dt) {
        var velocityIterations = 8;
        var positionIterations = 1;

        // Instruct the world to perform a single step of simulation. It is
        // generally best to keep the time step and iterations fixed.
        this.world.Step(dt, velocityIterations, positionIterations);

        //Iterate over the bodies in the physics world
        for (var b = this.world.GetBodyList(); b; b = b.GetNext()) {
            if (b.GetUserData() != null) {
                //Synchronize the AtlasSprites position and rotation with the corresponding body
                var bodies = b.GetUserData();
                bodies.x = b.GetPosition().x * PTM_RATIO;
                bodies.y = b.GetPosition().y * PTM_RATIO;
                bodies.rotation = -1 * cc.radiansToDegrees(b.GetAngle());
            }
        } //
        this.world.DrawDebugData();
        this.world.ClearForces();
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

GameLayer.prototype.createDataPosition = function(s,startX,startY) {
    var pos = [];
    for(var i = 0; i<maxRows; i++){
        pos[i] = [];
        for(var j = 0; j<maxCols; j++){
            var x = startX + offSetPetX + j*s.width;
            var y = startY + offSetPetY + i*s.height;
            pos[i].push(cc.p(x,y));
        }
    };
    return pos;
};
GameLayer.prototype.createPetObject = function(mass,scale,jsonPath, style) {

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
        image:image,
        mass: mass,
        style: style,
        sprite: sprite
    };
};
GameLayer.prototype.createMultiPolygonEntity = function(object,pos) {

    var size = cc.director.getWinSize();
    var b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2Fixture = Box2D.Dynamics.b2Fixture,
        b2World = Box2D.Dynamics.b2World,
        b2MassData = Box2D.Collision.Shapes.b2MassData,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

    var jsonPath = object.json;
    var _this = this;

    this.loadAllVerticesFromJson(jsonPath).then(function(data) {

        var rigidBodies = data.rigidBodies[0];
        var colorType = rigidBodies.name;
        var polygons = rigidBodies.polygons;


        var sprite = object.sprite;
        sprite.setPosition(pos);
        _this.addChild(sprite, gameConfig.INDEX.GAMELAYER_INDEX);
        var s = sprite.getBoundingBox();

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
        // define a body def
        var bodyDef = new b2BodyDef;
        if (object.style != 'static') {
            bodyDef.type = b2Body.b2_dynamicBody;
            sprite.colorType = colorType;
            sprite.isVisited = false;
        } else {
            bodyDef.type = b2Body.b2_staticBody;
        }
        bodyDef.position.Set(pos.x / PTM_RATIO, pos.y / PTM_RATIO);
        bodyDef.userData = sprite;
        var body = _this.world.CreateBody(bodyDef);

        // define a fixture def
        for (var i = 0; i < eachPolygon.length; i++) {
            var fixDef = new b2FixtureDef;
            fixDef.density = object.mass;
            fixDef.friction = 10.1;
            fixDef.restitution = 0.01;
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsArray(eachPolygon[i], eachPolygon[i].length);
            body.CreateFixture(fixDef);

        };
        var finalObj = {
            body: body,
            sprite: sprite
        };
        _this._allOfPets.push(finalObj);

    }).catch(function(error) {
        cc.log("We can't load json file, please check again ...");
        cc.log(error);
    })
};
// GameLayer.prototype.createDataPos = function(object){
//     cc.log(object);
//     for(var i = 0; i<maxRows; i++){
//      for(var j = 0; j<maxCols; j++){

//          var x = startX + offSetPetX + sizeOfPetX;
//          var y = startY + offSetPetY + sizeOfPetY;
        
//      }
//     }
// };
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
GameLayer.prototype.createGround = function(object){
    var size = cc.director.getWinSize();
    var b2Vec2 = Box2D.Common.Math.b2Vec2,
        b2BodyDef = Box2D.Dynamics.b2BodyDef,
        b2Body = Box2D.Dynamics.b2Body,
        b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
        b2Fixture = Box2D.Dynamics.b2Fixture,
        b2World = Box2D.Dynamics.b2World,
        b2MassData = Box2D.Collision.Shapes.b2MassData,
        b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
        b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
        b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

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
        var s = sprite.getBoundingBox();

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
            }
        };
        // define a body def
        var bodyDef = new b2BodyDef;
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.Set(object.position.x / PTM_RATIO, object.position.y / PTM_RATIO);
        bodyDef.userData = null;
        _this.removeChild(sprite,true);

        var body = _this.world.CreateBody(bodyDef);
        // define a fixture def
        for (var i = 0; i < eachPolygon.length; i++) {
            var fixDef = new b2FixtureDef;
            fixDef.density = object.mass;
            fixDef.friction = 10.1;
            fixDef.restitution = 0.1;
            fixDef.shape = new b2PolygonShape;
            fixDef.shape.SetAsArray(eachPolygon[i], eachPolygon[i].length);
            body.CreateFixture(fixDef);
        }//

    }).catch(function(error) {
        cc.log("We can't load json file, please check again ...");
        cc.log(error);
    })
};