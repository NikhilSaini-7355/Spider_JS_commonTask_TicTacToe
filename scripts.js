
var turn = 'X';
var game_type = 3;
var total_turns = 0;
var finished = false;

var selections = new Array(); 
	selections['X'] = new Array();
	selections['Y'] = new Array();

var scores = new Array(); 
	scores['X'] = 0;
	scores['Y'] = 0;

// Resetting parameters on reseting game
function resetParams() {
	turn = 'X';
	game_type = 3;
	total_turns = 0;
	finished = false;

	selections['X'] = new Array();
	selections['Y'] = new Array();
}


// Change turn after another
function changeTurn(){
	if (turn == 'X') turn = 'Y';
	else turn = 'X';
}


// Winner patterns, match selected patterns on every turn for every player
function winnerPatterns() {
	var wins = Array();

	// 3 x 3 winning patterns;
	if (game_type==3) wins = [ 
								[11,12,13], [21,22,23], [31,32,33],
						 		[11,21,31], [12,22,32], [13,23,33], 
						 		[11,22,33], [13,22,31]
						 	];


	// 4 x 4 winning patterns;
	if (game_type==4) wins = [ 
								[11,12,13,14], [21,22,23,24], [31,32,33,34], [41,42,43,44],
						 		[11,21,31,41], [12,22,32,42], [13,23,33,43], [14,24,34,44],
						 		[14,23,32,41], [11,22,33,44]
						 	];


	// 5 x 5 winning patterns;
	if (game_type==5) wins = [ 
								[11,12,13,14,15], [21,22,23,24,25], [31,32,33,34,35], [41,42,43,44,45], [51,52,53,54,55],
						 		[11,21,31,41,51], [12,22,32,42,52], [13,23,33,43,53], [14,24,34,44,54], [15,25,35,45,55],
						 		[11,22,33,44,55], [15,24,33,42,51]
						 	];

	return wins
}

// Checking winner of selected type on selection
function checkWinner() {

	var selected = selections[turn].sort();
	var win_patterns = winnerPatterns();

	finished = false;
	for (var x=0; x < win_patterns.length; x++) {
		
		if (finished != true) { 
			finished = isWinner(win_patterns[x], selections[turn]);

			if ( finished === true ) {
				
				// Updating score card
				scoreUpdate(turn);

				// On winning disabled all boxes
				disableAllBoxes();

				alert('Player '+turn+' Won !!');
				
				break;
			} 
		}
	}

    // Draw Scenario 
	if ( ( total_turns == (game_type*game_type) ) && finished === false ) { 
		alert('Game Draw!');
		finished = true;
		disableAllBoxes(); 
	}
}


// Verifying each selections with winning pattern
function isWinner(win_pattern, selections){

	var match = 0;

	for (var x=0; x<win_pattern.length; x++) {
		for (var y=0; y<selections.length; y++) {
			if (win_pattern[x]==selections[y]) {
				match++;
			}
		}
	}

	if (match==win_pattern.length) return true;

	return false;
}


// Disable all boxes after winning/draw
function disableAllBoxes() {

	var elements = document.getElementsByClassName("grid-box");
	for (var i = 0; i < elements.length; i++) {
	  elements[i].disabled =true;
	}

}

// Generating a board for new game
function generateGame(){

	// Reseting all initialized params as user selected new game
	resetParams();

	// Getting Variables to update global param
	game_type = Number(document.getElementById('game_type').value);

	// Clearing board for new game
	document.getElementById('game-board').innerHTML = '';

	// Generating board
	for (var row = 1; row <= game_type; row++){
		for (var col = 1; col <= game_type; col++) {
			var unique_name = 'grid-'+row+'-'+col;
			var unique_id = row+''+col;
			var button = document.createElement("input");

			button.setAttribute("value", ' ');
			button.setAttribute("id", unique_id);
			button.setAttribute("name", unique_name);
			button.setAttribute("class", 'grid-box');
			button.setAttribute("type", 'button');
			button.setAttribute("onclick", "markCheck(this)");
			document.getElementById('game-board').appendChild(button);
		}

		var breakline = document.createElement("br");
			document.getElementById('game-board').appendChild(breakline);
	}

}


// Selecting check for desired position
function markCheck(obj){

	obj.value = turn;
	total_turns++;

	if (turn == 'X' ) {
		obj.setAttribute("class", 'green-player');
	} else {
		obj.setAttribute("class", 'red-player');
	}

	obj.setAttribute("disabled", 'disabled');
	selections[turn].push(Number(obj.id));

	checkWinner();
	changeTurn();
}

// Getting most applicable pattern for a player 
function getMostNearestPattern(turn){

	var matches = 0;

	var selected = selections[turn].sort();
	var win_patterns = winnerPatterns();

	finished = false;
	for (var x=0; x < win_patterns.length; x++) {
		var intersected = intersectionArray(selected, win_patterns[x]);

		if ( intersected.length==(win_patterns[x].length-1) ) { //return win_patterns[x];

			// if any position is found empty then return that pattern; otherwise will check another one from list
			for (var y=0; y < win_patterns[x].length; y++) {
				obj = document.getElementById(win_patterns[x][y]);
				if (obj.value == '' || obj.value == ' ') {
					// Return pattern if got an empty; otherwise will match others 
					return win_patterns[x];	
				}
			}
		}

	}
	return [];
}

function intersectionArray(x, y){

    var response = [];
    for (var i = 0; i < x.length; i++) {
        for (var z = 0; z < y.length; z++) {
            if (x[i] == y[z]) {
                response.push(x[i]);
                break;
            }
        }
    }
    return response;

}


function scoreUpdate(turn){
	scores[turn]++;
	document.getElementById('score-'+turn).innerHTML = scores[turn];
}