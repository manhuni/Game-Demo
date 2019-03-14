//config for game
var gameConfig = {
    INDEX: {
        HOMELAYER_INDEX: 0,
        GAMELAYER_INDEX: 1,
        MENULAYER_INDEX: 3,
        JOINER_INDEX: 4,
        DEBBUGLAYER_INDEX: 5,
        ANIMATION_INDEX: 6,
        EFFECTNODE_INDEX: 7,
        EFFECTNODE_JOIN_INDEX: 8,
        EFFECTNODE_FIRE_INDEX: 9,
        SEGMENT_LABEL_INDEX: 10,
        SHUFFLE_INDEX: 11
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
        JOINER_FIXED_SCALEX: 0.3,
        JOINER_FIXED_SCALEY: 0.5,
        FIREANIM_SCALEX: 1,
        FIREANIM_SCALEY: 1.02
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
    'tsum2',
    'tsum3',
    'tsum3',
    'tsum4',
    'tsum5',
    'tsum5',
    'tsum6',
    'tsum7',
    'tsum8',
    'tsum8',
    'tsum9',
    'tsum10',
    'tsum10'
];
var massOfPets = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100];
var joinerConfig = {
    permitedJoinerDistance: 128 / 2 / 2,
    radiusCanClickedFromCenterPet: 50,
    offsetAngle: 10 //5 degress from path
}