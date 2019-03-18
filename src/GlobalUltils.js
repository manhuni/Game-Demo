findOtherPosition = function(index, posArray, petLoadedArray) {
    var minLimit = 0;
    var maxLimit = posArray.length - 1;
    var randomIndex = 0;
    var avaiableIndex = false;

    do {
        randomIndex = Math.floor(Math.random() * (maxLimit - minLimit + 1)) + minLimit;
        avaiableIndex = petLoadedArray.includes(randomIndex);
    }
    while (randomIndex == index || avaiableIndex);
    return randomIndex;
}