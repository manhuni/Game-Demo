/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

//resource for game
var res = {
	//helloworld block test;
	helloworld_PNG: "res/HelloWorld.png",
	helloworld_JSON: "res/HelloWorld.json",

	gameGroundTop: "res/GameLayerTop.png",
	gameGroundBot: "res/GameLayerBot.png",
	gameStaticGround: "res/static_ground.png",
	gameBackground_JSON: "res/background_game.json",
	//pets group
	//pets
    PETS_PLIST: "res/pets/pets.plist",
    TSUM_PLIST: "res/tsum/tsum.plist",
    PETS_PNG: "res/pets/pets.png",
    TSUM_PNG: "res/tsum/tsum.png",
    
	TSUM0_JSON : "res/tsum/tsum0/tsum0.json", 
	TSUM0_PLIST : "res/tsum/tsum0/tsum0.plist", 
	TSUM0_PSHEET : "res/tsum/tsum0/tsum0.png",

	TSUM1_JSON : "res/tsum/tsum1/tsum1.json", 
	TSUM1_PLIST : "res/tsum/tsum1/tsum1.plist", 
	TSUM1_PSHEET : "res/tsum/tsum1/tsum1.png",

	TSUM2_JSON : "res/tsum/tsum2/tsum2.json", 
	TSUM2_PLIST : "res/tsum/tsum2/tsum2.plist", 
	TSUM2_PSHEET : "res/tsum/tsum2/tsum2.png",

	TSUM3_JSON : "res/tsum/tsum3/tsum3.json", 
	TSUM3_PLIST : "res/tsum/tsum3/tsum3.plist", 
	TSUM3_PSHEET : "res/tsum/tsum3/tsum3.png",

	TSUM4_JSON : "res/tsum/tsum4/tsum4.json", 
	TSUM4_PLIST : "res/tsum/tsum4/tsum4.plist", 
	TSUM4_PSHEET : "res/tsum/tsum4/tsum4.png",

	TSUM5_JSON : "res/tsum/tsum5/tsum5.json", 
	TSUM5_PLIST : "res/tsum/tsum5/tsum5.plist", 
	TSUM5_PSHEET : "res/tsum/tsum5/tsum5.png",

	TSUM6_JSON : "res/tsum/tsum6/tsum6.json", 
	TSUM6_PLIST : "res/tsum/tsum6/tsum6.plist", 
	TSUM6_PSHEET : "res/tsum/tsum6/tsum6.png",

	TSUM7_JSON : "res/tsum/tsum7/tsum7.json", 
	TSUM7_PLIST : "res/tsum/tsum7/tsum7.plist", 
	TSUM7_PSHEET : "res/tsum/tsum7/tsum7.png",

	TSUM8_JSON : "res/tsum/tsum8/tsum8.json", 
	TSUM8_PLIST : "res/tsum/tsum8/tsum8.plist", 
	TSUM8_PSHEET : "res/tsum/tsum8/tsum8.png",

	TSUM9_JSON : "res/tsum/tsum9/tsum9.json", 
	TSUM9_PLIST : "res/tsum/tsum9/tsum9.plist", 
	TSUM9_PSHEET : "res/tsum/tsum9/tsum9.png",

	TSUM10_JSON : "res/tsum/tsum10/tsum10.json", 
	TSUM10_PLIST : "res/tsum/tsum10/tsum10.plist", 
	TSUM10_PSHEET : "res/tsum/tsum10/tsum10.png",


	//
	PET_ROBOT_JSON: "res/pets/pets_01.json",
	PET_HERO_JSON: "res/pets/pets_02.json",
	PET_RED_JSON: "res/pets/pets_03.json",
	PET_BLACK_JSON: "res/pets/pets_04.json",
	PET_BLUE_JSON: "res/pets/pets_05.json",
	PET_ELDER_JSON: "res/pets/pets_06.json",
	//other (menu, button, ..vv)
    Shuffle_Button: "res/shuffle.png",
    //joinner
   	Joiner_PNG: "res/joiner_block/joinblock.png",
   	 //fire animation
    Fire_PLIST: "res/anim/fires/fireanim.plist",
	Fire_PNG: "res/anim/fires/fireanim.png",
	//pet animation

	//lighter animation
	Lighter_PLIST: "res/anim/lighter/lighter.plist",
	Lighter_PNG: "res/anim/lighter/lighter.png",
	//test particle
	Particle_PLIST: "res/particles/SpellBall.plist",
	//Enemy
	Enemy_PLIST: "res/enemy/enemy.plist",
	Enemy_PNG: "res/enemy/enemy.png",
	GreenHealth_PNG: "res/items/greenhealth.png",
	RedHealth_PNG: "res/items/redhealth.png",
	Hitted_PLIST: "res/anim/pethitted/pet_hitted.plist",
	Hitted_PNG: "res/anim/pethitted/pet_hitted.png"
};

//load resource
var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
};
