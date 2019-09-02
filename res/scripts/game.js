let TPS = 20;
let updateSpeed = 1000/TPS;
let currentUpdateSpeed = 1000/TPS;
let drawSpeed = 1000/TPS;
let currentDrawSpeed = 1000/TPS;

let DIVtreeDisplay;
let DIVtreesGainerPerSecond;
let DIVtreesLostPerSecond;
let DIVtreeShop;
let DIVtreesDifference;

function onLoad() {
	DIVtreeDisplay = document.getElementById("treeDisplay");
	DIVtreesGainerPerSecond = document.getElementById("treesGainedPerSecond");
	DIVtreesLostPerSecond = document.getElementById("treesLostPerSecond");
	DIVtreeShop = document.getElementById("treeShop");
	DIVtreesDifference = document.getElementById("treesDifference");
}


let game = {
	debug:false,

	trees:1,
	treeGrowthBase:1024,
	newTreeGrowthBase:1024,
	constantTreeMult:1,

	burnChance:1,
	burnPercentage:0.1,

	shopCosts: {
		constantTreeMult:7,
		lowerTreeLogBase:7,
		lowerBurnChance:10,
		lowerBurnPercentage:10
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
	
	game.trees += gainTrees();
	game.trees -= loseTrees();
	if(isNaN(game.trees) || game.trees < 1)
		game.trees = 1;
}

function gainTrees() {
	var ret = (getOptimisedTreeBaseLog(game.trees, game.treeGrowthBase)+0.5) * game.constantTreeMult;
	return ret;
}

function loseTrees() {
	var ret = 0;
	if(game.burnChance>Math.random())
		ret = game.trees*game.burnPercentage;
	return ret;
}

function averageTreeLoss() {
	return game.burnChance * game.burnPercentage * game.trees;	
}

function draw() {
	if(game.currentDrawSpeed!=game.drawSpeed) {
		clearInterval(drawInterval);
		game.currentDrawSpeed = game.drawSpeed;
		drawInterval = setInterval(draw, game.drawSpeed);
	}
	let gain = Math.round(gainTrees()*100*TPS)/100;
	let loss = Math.round(averageTreeLoss()*100*TPS)/100;
	DIVtreeDisplay.innerHTML = "Trees: " + Math.round(game.trees);
	DIVtreesGainerPerSecond.innerHTML = "Trees gained per second: " + gain;
	DIVtreesLostPerSecond.innerHTML = "Trees lost per second: " + loss;
	DIVtreesDifference.innerHTML = "Gain/Loss difference: " + Math.round(gain-loss);

	drawShop();
}

function drawShop() {
	document.getElementById("constantTreeMult").innerHTML="Increase tree gain by x2" +"<br>"+ "Cost: " + game.shopCosts.constantTreeMult;
	document.getElementById("lowerTreeLogBase").innerHTML="Decrease log base for tree gain by 10%" +"<br>"+ "Cost: " + game.shopCosts.lowerTreeLogBase;;
	document.getElementById("lowerBurnChance").innerHTML="Decrease burn chance by 10%" +"<br>"+ "Cost: " + game.shopCosts.lowerBurnChance;;
	document.getElementById("lowerBurnPercentage").innerHTML="Decrease burn damage by 10%" +"<br>"+ "Cost: " + game.shopCosts.lowerBurnPercentage;;
}

function upgrade(id) {
	switch(id) {
		case 0:
			if(game.shopCosts.constantTreeMult <= game.trees) {
				game.constantTreeMult *= 2;
				game.shopCosts.constantTreeMult *=5;
				game.trees -= game.shopCosts.constantTreeMult;
			}
			break;
		case 1:
			if(game.shopCosts.lowerTreeLogBase <= game.trees) {
				game.newTreeGrowthBase *= 0.9;
				game.shopCosts.lowerTreeLogBase *=2;
				game.trees -= game.shopCosts.lowerTreeLogBase;
			}
			break;		
		case 2:
			if(game.shopCosts.lowerBurnChance <= game.trees) {
				game.burnChance *= 0.9;
				game.shopCosts.lowerBurnChance *=1.5;
				game.trees -= game.shopCosts.lowerBurnChance;
			}
			break;
		case 3:
			if(game.shopCosts.lowerBurnPercentage <= game.trees) {
				game.burnPercentage *= 0.9;
				game.shopCosts.lowerBurnPercentage *= 2;
				game.trees -= game.shopCosts.lowerBurnPercentage;
			}
			break;
		default:
			console.log("Error. There is no upgrade with the id: " + id);
	}
}

let gameLoopInterval = setInterval(gameLoop, updateSpeed);
let drawInterval = setInterval(draw, drawSpeed);