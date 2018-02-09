// Before using this body, you need to add at least one food, and at least one snake (yourself)
function getEmptyRequestBody() {
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
	body["height"] = 20;
	body["width"] = 20;
	body["turn"] = 0;
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

module.exports = {
   getEmptyRequestBody: getEmptyRequestBody,
   addFood: addFood,
   addSnake: addSnake,
   addYou: addYou
}