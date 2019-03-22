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

	gameBackground: "res/background_game.png",
	gameStaticGround: "res/static_ground.png",
	gameBackground_JSON: "res/background_game.json",
	gameBackground_inner: "res/background_inner.png",
	//pets group
	//pets
    PETS_PLIST: "res/pets/pets.plist",
    TSUM_PLIST: "res/tsum/tsum.plist",
    PETS_PNG: "res/pets/pets.png",
    TSUM_PNG: "res/tsum/tsum.png",
	//tsum0
	TSUM0_JSON : "res/tsum/tsum0.json", 
	TSUM1_JSON : "res/tsum/tsum1.json", 
	TSUM10_JSON : "res/tsum/tsum10.json", 
	TSUM2_JSON : "res/tsum/tsum2.json", 
	TSUM3_JSON : "res/tsum/tsum3.json", 
	TSUM4_JSON : "res/tsum/tsum4.json", 
	TSUM5_JSON : "res/tsum/tsum5.json", 
	TSUM6_JSON : "res/tsum/tsum6.json", 
	TSUM7_JSON : "res/tsum/tsum7.json", 
	TSUM8_JSON : "res/tsum/tsum8.json",
	TSUM9_JSON : "res/tsum/tsum9.json",
	//
	PET_ROBOT_JSON: "res/pets/pets_01.json",
	PET_HERO_JSON: "res/pets/pets_02.json",
	PET_RED_JSON: "res/pets/pets_03.json",
	PET_BLACK_JSON: "res/pets/pets_04.json",
	PET_BLUE_JSON: "res/pets/pets_05.json",
	PET_ELDER_JSON: "res/pets/pets_06.json",
	//other (menu, button, ..vv)
    Shuffle_Button_Nor: "res/shuffle_nor.png",
    Shuffle_Button_Sel: "res/shuffle_sel.png",
    //joinner
   	Joiner_PNG: "res/joinblock.png",
   	 //fire animation
    Fire_PLIST: "res/anim/fires/fireanim.plist",
	Fire_PNG: "res/anim/fires/fireanim.png",
	//pet animation
	pet0_PLIST: "res/anim/pet0/pet0.plist",
	pet0_PNG: "res/anim/pet0/pet0.png",
	//lighter animation
	Lighter_PLIST: "res/anim/lighter/lighter.plist",
	Lighter_PNG: "res/anim/lighter/lighter.png",
	//test tsum
	TSUM3_PNG: "res/tsum/tsum3.png",
	//test particle
	Particle_PLIST: "res/particles/FireBallHele.plist"

    
};

//load resource
var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
};
