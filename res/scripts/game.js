let game = {
	updateSpeed:1000,
	currentUpdateSpeed:1000,
	drawSpeed:50,
	currentDrawSpeed:50,
	debug:true,

	trees:1,
	replicateChance:0.04,
	baseFireChance:0.1,
	fireDamagePercent:0.1
}

function randNormalDistribution() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    num = num / 10.0 + 0.5; // Translate to 0 -> 1
    if (num > 1 || num < 0) return randn_bm(); // resample between 0 and 1
    return num;
}

function gameLoop() {
	if(game.currentUpdateSpeed!=game.updateSpeed) {
		clearInterval(gameLoopInterval);
		game.currentUpdateSpeed = game.updateSpeed;
		gameLoopInterval = setInterval(gameLoop, game.updateSpeed);
	}



	game.trees += game.trees * game.replicateChance * randNormalDistribution() * 2;
	if(Math.random() < getFireChance()) {
		game.trees -= game.trees * game.fireDamagePercent;
		if(game.trees < 1) {
			game.trees = 1;
		}
	}
}

function draw() {
	if(game.currentDrawSpeed!=game.drawSpeed) {
		clearInterval(drawInterval);
		game.currentDrawSpeed = game.drawSpeed;
		drawInterval = setInterval(draw, game.drawSpeed);
	}

	amount = Math.round(game.trees);
	document.getElementById("treeDisplay").innerHTML = "Trees: " + amount;
}

function getFireChance() {
	return Math.log10(game.trees) * game.baseFireChance;
}

let gameLoopInterval = setInterval(gameLoop, game.updateSpeed);
let drawInterval = setInterval(draw, game.drawSpeed);