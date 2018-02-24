// Before using this body, you need to add at least one food, and at least one snake (yourself)
function getEmptyRequestBody(width = 20, height = 20, turn = 0) {
	var body = {};
	body["food"] = {
		"data": [],
		"object": "list"
	};

	body["snakes"] = {
		"data": [],
		"object": "list"
	};

	body["you"] = {};

	// Set default values
	body["height"] = width;
	body["width"] = height;
	body["turn"] = turn;
	body["id"] = 1;
	body["object"] = "world";
	return body;
}

function addFood(body, x, y) {
	var food = {
		"object": "point",
		"x": x,
		"y": y
	};

	body["food"]["data"].push(food);
}

// Taken from https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeRandomString() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function addSnake(body, snakeCoords, health = 100, name = makeRandomString(), id = makeRandomString()) {
	var snakeBody = {"data": [], "object": "list"};

	for (var i = 0; i < snakeCoords.length; i++) {
		var point = {
			"object": "point",
			"x": snakeCoords[i].x,
			"y": snakeCoords[i].y
		};

		snakeBody["data"].push(point);
	};

	var snake = {
		"body": snakeBody,
		"health": health,
		"name": name,
		"id": id,
		"length": snakeCoords.length,
		"object": "snake",
		"taunt": ""
	};

	body["snakes"]["data"].push(snake);
}

function addYou(body, snakeCoords, health = 100, name = makeRandomString(), id = makeRandomString()) {
	// You need to be in the snakes array also
	addSnake(body, snakeCoords, health, name, id);

	var yourBody = {"data": [], "object": "list"};
	for (var i = 0; i < snakeCoords.length; i++) {
		var point = {
			"object": "point",
			"x": snakeCoords[i].x,
			"y": snakeCoords[i].y
		};

		yourBody["data"].push(point);
	};

	var yourSnake = {
		"body": yourBody,
		"health": health,
		"name": name,
		"id": id,
		"length": snakeCoords.length,
		"object": "snake",
		"taunt": ""
	};

	body["you"] = yourSnake;
}

function printBoard(body) {
	// Create board
	var board = [];
	for (var i = 0; i < body.height; i++) {
		var row = [];
		for (var j = 0; j < body.width; j++) {
			row.push('-');
		}
		board.push(row);
	}

	// Add food
	for (var i = 0; i < body.food.data.length; i++) {
		var food = body.food.data[i];
		board[food.x][food.y] = 'F';
	}

	// Find your snake id
	var yourId = body.you.id;

	// Add snakes
	for (var i = 0; i < body.snakes.data.length; i++) {
		var snake = body.snakes.data[i];
		for(var j = 0; j < snake.length; j++) {
			var coord = snake.body.data[j];
			// Print your snake differently
			if (j == 0) {
				if (snake.id == yourId) {
					board[coord.x][coord.y] = 'y';
				} else {
					board[coord.x][coord.y] = 'e';
				}
			} else {
				if (snake.id == yourId) {
					board[coord.x][coord.y] = '*';
				} else {
					board[coord.x][coord.y] = '#';
				}
			}
		}
	}

	// Print how much health you have
	console.log("\n\nYou have " + body["you"]["health"] + " health.");

	// Print board
	for (var i = 0; i < body.width; i++) {
		for (var j = 0; j < body.height; j++) {
			// Don't put a newline
			process.stdout.write(board[j][i] + ' ');
		}

		// Just a newline
		console.log('');
	}
}

module.exports = {
   getEmptyRequestBody: getEmptyRequestBody,
   addFood: addFood,
   addSnake: addSnake,
   addYou: addYou,
   printBoard: printBoard
}
