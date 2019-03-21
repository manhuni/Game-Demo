//random choose a pet with same color > 2 if all of color pet

    var largestTimes = petWithColortimes[0].times;
    var largestColor = petWithColortimes[0].color;

    petWithColortimes.forEach(function(value, index) {
        if (value.times > largestTimes) {
            largestTimes = value.times;
            largestColor = value.color;
        }
    });
    cc.log(petWithColortimes);
    cc.log(largestTimes, largestColor);
    //determine find largest color and largest times appear =))
    var groupColorPet = [];
    for (var i = 0; i < this._allOfPets.length; i++) {
        var colorPet = this._allOfPets[i].sprite.colorType;
        if (colorPet === largestColor) {
            groupColorPet.push(this._allOfPets[i].sprite);
        };
    };
    //
    cc.log(groupColorPet)
        //find inherit
    var inheritGroup = [];

    for (var i = 0; i < groupColorPet.length; i++) {

        inheritGroup[i] = [];
        var pet = groupColorPet[i];
        var s = pet.getBoundingBox();
        var origin = s.width / 2;
        var bonus = s.width / 2;
        var radiusScan = origin + bonus;
        pet.hinted = true;
        var color = pet.colorType;
        //
        var childs = [];
        for (var j = 0; j < groupColorPet.length; j++) {
            var dist = cc.pDistance(pet.getPosition(), groupColorPet[j].getPosition());
            if (dist > origin && dist < radiusScan && groupColorPet[j] != pet) {
                childs.push(groupColorPet[j]);
            };
        };
        inheritGroup[i].push(pet, childs);

    };
    cc.log(inheritGroup);
    cc.log(inheritGroup[0][1]);
    //

    var blinkablePet = [];
    for (var i = 0; i < inheritGroup.length; i++) {
        var lengthOfChild = inheritGroup[i][1].length;
        if (lengthOfChild >= 2) {
            blinkablePet.push(inheritGroup[i]);
        };
    };
    cc.log(blinkablePet);
    if (blinkablePet.length > 1) {
        var randomIndex = Math.floor(Math.random() * (blinkablePet.length - 1 - 0 + 1)) + 0;
        var targetBlinking = blinkablePet[randomIndex];
        cc.log(targetBlinking);

        for (var i = 0; i < targetBlinking.length; i++) {
            var action = cc.blink(2, 3);
            targetBlinking[1][i].runAction(action);
            targetBlinking[0].runAction(action.clone());
        };
        
        if (distanceRuntime > originRange && distanceRuntime < totalRange) {

        }
    }