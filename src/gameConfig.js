//config for game
var gameConfig = {
    INDEX: {
        HOMELAYER_INDEX: 5,
        GAMELAYER_INDEX: 10,
        MENULAYER_INDEX: 15,
        JOINER_INDEX: 20,
        DEBBUGLAYER_INDEX: 5555555555555,
        ANIMATION_INDEX: 30,
        EFFECTNODE_INDEX: 35,
        ANIMATIONPET_INDEX: 40,
        EFFECTNODE_JOIN_INDEX: 45,
        EFFECTNODE_FIRE_INDEX: 50,
        SEGMENT_LABEL_INDEX: 55,
        SHUFFLE_INDEX: 60
    },
    TAG: {
        FIRE_ANIM: 0,
        JOIN_ANIM: 1
    },
    GAMEGROUP: {
        PET: 0
    },
    OFFSET: {
        PETS: 20 //pixel
    },
    SCALE: {
        JOINER_FIXED_SCALEX: 0.60,
        JOINER_FIXED_SCALEY: 0.60,
        FIREANIM_SCALEX: 0.25,
        FIREANIM_SCALEY: 0.25
    }


};
//type of pets
var typeCollision = {
    PET_ROBOT: 1,
    PET_HERO: 2,
    PET_RED: 3,
    PET_BLACK: 4,
    PET_BLUE: 5,
    PET_ELDER: 6,
    GROUND_INNER: 7
};
//all types of pet
var typeOfPet = [
    'tsum0',
    'tsum1',
    'tsum2',
    'tsum3',
    'tsum4',
    'tsum5',
    'tsum6',
    'tsum7',
    'tsum8',
    'tsum9',
    'tsum10'
    
];
//all test types of pet
var typeTestOfPet = [
    'tsum10',
    'tsum10',
    'tsum10',
    'tsum10',
    'tsum10',
    'tsum10',
    'tsum10',
    'tsum10',
    'tsum10',
    'tsum10',
    'tsum10',
    'tsum10',
    'tsum10',
    'tsum10',
    'tsum7',
    'tsum8',
    'tsum9'
    
];

var massOfPets = [100, 110, 120, 130, 140, 150, 160, 170, 180, 190, 200,
    210, 220, 230, 240, 250, 260, 270, 280, 300, 310, 320, 330, 340, 350, 360, 220, 230, 240, 250, 260, 270, 280, 300, 310, 320, 330, 340, 350, 360, 220, 230, 240, 250, 260, 270, 280, 300, 310, 320, 330, 340, 350, 360, 220, 230, 240, 250, 260, 270, 280, 300, 310, 320, 330, 340, 350, 360
];
var joinerConfig = {
    permitedJoinerDistance: 128 / 2 / 2,
    radiusCanClickedFromCenterPet: 128 / 3,
    offsetAngle: 10 //5 degress from path
};
var startWithType = 5555;
var maxCols = 7;
var maxRows = 5;

var offSetPetX = 5;
var offSetPetY = 5;

var shuffleObj = {
    _stepShuffle: 6.1,
    _timesShuffle: 0,
    _timesShuffleMax: 10,
    _maxForce: 20,
    _startForce: 2,
    _firstRotate: true,
    _endRotate: false,
    _rotary: []
};
var PTM_RATIO = 32;