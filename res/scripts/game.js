let TPS = 20;
let updateSpeed = 1000/TPS;
let currentUpdateSpeed = 1000/TPS;
let drawSpeed = 1000/TPS;
let currentDrawSpeed = 1000/TPS;

let DIVtreeDisplay;
let DIVtreeShop;
let DIVtreesDifference;
let DIVanimalsDisplay;
let DIVanimalsDifference;
let DIVtShopConstTreeMult;
let DIVtShopLowerBurnChance;
let DIVtShopLowerBurnPercentage;
let DIVtShopLowerPrices;
let DIVtShopIncreaseAnimalChance;
let DIVtShopIncreaseAnimalMax;

function onLoad() {
	DIVtreeDisplay = document.getElementById("trees");
	DIVtreeShop = document.getElementById("treeShop");
	DIVtreesDifference = document.getElementById("treesDifference");
	DIVanimalsDisplay = document.getElementById("animals");
	DIVanimalsDifference = document.getElementById("animalsDifference");
	DIVtShopConstTreeMult = document.getElementById("constantTreeMult");
	DIVtShopLowerBurnChance = document.getElementById("lowerBurnChance");
	DIVtShopLowerBurnPercentage = document.getElementById("lowerBurnPercentage");
	DIVtShopLowerPrices = document.getElementById("lowerPrices");
	DIVtShopIncreaseAnimalChance = document.getElementById("increaseAnimalChance");
	DIVtShopIncreaseAnimalMax = document.getElementById("increaseAnimalMax");
}


let game = {
	debug:false,

	trees:1,
	treeGrowthBase:1024,
	newTreeGrowthBase:1024,
	constantTreeMult:1,

	animals:0,
	animalChance:0.00,
	constantAnimalMaxMult:1,

	burnChance:1,
	burnPercentage:0.1,

	treeShopCosts: {
		constantTreeMult:7,
		lowerBurnChance:10,
		lowerBurnPercentage:10,
		lowerPrices:100,
		increaseAnimalChance:200,
		constantAnimalMaxMult:200
	}
}

let currentBaseDivisor = Math.log(game.treeGrowthBase);
function getOptimisedTreeBaseLog(x) {
	if(game.newTreeGrowthBase != game.treeGrowthBase) {
		game.treeGrowthBase = game.newTreeGrowthBase;
    	currentBaseDivisor = Math.log(game.treeGrowthBase);
    }
    return Math.log(x) / currentBaseDivisor;
}

function gameLoop() {
	if(game.currentUpdateSpeed!=game.updateSpeed) {
		clearInterval(gameLoopInterval);
		game.currentUpdateSpeed = game.updateSpeed;
		gameLoopInterval = setInterval(gameLoop, game.updateSpeed);
	}
	
	game.trees += getTreesThisTick();
	if(isNaN(game.trees) || game.trees < 1)
		game.trees = 1;
	game.animals += getAnimalsThisTick();
}

function getTreeGainThisTick() {
	return (getOptimisedTreeBaseLog(game.trees, game.treeGrowthBase)+0.5) * game.constantTreeMult + (game.animals+1);
}

function getTreesThisTick() {
	return getTreeGainThisTick() - game.burnChance * game.burnPercentage * game.trees;	
}

function getAnimalsThisTick() {
	if(game.animalChance >= Math.random()) {
		return 0.01 * (Math.log10(game.trees)*game.constantAnimalMaxMult-game.animals);
	} else {
		return 0;
	}
}

function draw() {
	if(game.currentDrawSpeed!=game.drawSpeed) {
		clearInterval(drawInterval);
		game.currentDrawSpeed = game.drawSpeed;
		drawInterval = setInterval(draw, game.drawSpeed);
	}
	DIVtreeDisplay.innerHTML = "Trees: " + Math.floor(game.trees);
	DIVtreesDifference.innerHTML = "Trees per tick: " + Math.floor(getTreesThisTick()*100)/100;

	DIVanimalsDisplay.innerHTML = "Animals: " + Math.floor(game.animals) + " of " + Math.floor(Math.log10(game.trees)*game.constantAnimalMaxMult);

	drawShop();
}

function drawShop() {
	DIVtShopConstTreeMult.innerHTML="Increase tree gain by x2 <br> Cost: " + Math.ceil(game.treeShopCosts.constantTreeMult);
	DIVtShopLowerBurnChance.innerHTML="Decrease burn chance by 10% <br> Cost: " + Math.ceil(game.treeShopCosts.lowerBurnChance);
	DIVtShopLowerBurnPercentage.innerHTML="Decrease burn damage by 10% <br> Cost: " + Math.ceil(game.treeShopCosts.lowerBurnPercentage);
	DIVtShopLowerPrices.innerHTML="Lower tree upgrade prices by 10% <br> Cost: " + Math.ceil(game.treeShopCosts.lowerPrices);
	DIVtShopIncreaseAnimalChance.innerHTML="Increase chance to gain more animals by +1% <br> Cost: " + Math.ceil(game.treeShopCosts.increaseAnimalChance);
	DIVtShopIncreaseAnimalMax.innerHTML="Increase max animals multiplier by 1 <br> Cost: " + Math.ceil(game.treeShopCosts.constantAnimalMaxMult);
}

function unlockAnimals() {
	if(game.trees >= 3480) {
		game.trees -=3480;
		game.animalChance = 0.01;
		game.animals = 1;
		DIVanimalsDisplay.style.display = "inherit";
		DIVanimalsDifference.style.display = "inherit";
		DIVtShopIncreaseAnimalChance.style.display = "inherit";
		DIVtShopIncreaseAnimalMax.style.display = "inherit";
		document.getElementById("unlockAnimals").style.display = "none"
	}
}

function upgrade(id) {
	switch(id) {
		case 0:
			if(game.treeShopCosts.constantTreeMult <= game.trees) {
				game.constantTreeMult *= 2;
				game.trees -= game.treeShopCosts.constantTreeMult;
				game.treeShopCosts.constantTreeMult *=5;
			}
			break;	
		case 1:
			if(game.treeShopCosts.lowerBurnChance <= game.trees) {
				game.burnChance *= 0.9;
				game.trees -= game.treeShopCosts.lowerBurnChance;
				game.treeShopCosts.lowerBurnChance *=1.5;
			}
			break;
		case 2:
			if(game.treeShopCosts.lowerBurnPercentage <= game.trees) {
				game.burnPercentage *= 0.9;
				game.trees -= game.treeShopCosts.lowerBurnPercentage;
				game.treeShopCosts.lowerBurnPercentage *= 2;
			}
			break;
		case 3:
			if(game.treeShopCosts.lowerPrices <= game.trees) {
				game.trees -= game.treeShopCosts.lowerPrices;
				for (var key in game.treeShopCosts) {
   		 			if (game.treeShopCosts.hasOwnProperty(key)) {
        				game.treeShopCosts[key] *= 0.9;
    				}
				}
				game.treeShopCosts.lowerPrices *= 1/0.9 * 10;
			}
			break;
		case 4:
			if(game.treeShopCosts.increaseAnimalChance <= game.trees && game.animalChance < 1) {
				game.animalChance += 0.01;
				game.trees -= game.treeShopCosts.increaseAnimalChance;
				game.treeShopCosts.increaseAnimalChance *= 2;
			}
			break;
		case 5:
			if(game.treeShopCosts.constantAnimalMaxMult <= game.trees) {
				game.constantAnimalMaxMult += 1;
				game.trees -= game.treeShopCosts.constantAnimalMaxMult;
				game.treeShopCosts.constantAnimalMaxMult *= 5;
			}
			break;
		default:
			console.log("Error. There is no upgrade with the id: " + id);
	}
}

let gameLoopInterval = setInterval(gameLoop, updateSpeed);
let drawInterval = setInterval(draw, drawSpeed);