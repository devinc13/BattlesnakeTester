#! /usr/bin/env node
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
const requestBodyBuilder = require('./request_body_builder');
const testHelper = require('./test_helper');

var url = testHelper.getUrl();


// There is a path to get back out after eating the food. Some snakes decide there isn't, and don't eat the food.
it('should eat dangerous food to not die at 2hp', function(done) {
	var requestBody = requestBodyBuilder.getEmptyRequestBody(20, 20);
	requestBodyBuilder.addFood(requestBody, 1, 6);
	requestBodyBuilder.addFood(requestBody, 2, 14);
	requestBodyBuilder.addFood(requestBody, 4, 19);
	requestBodyBuilder.addFood(requestBody, 5, 8);
	requestBodyBuilder.addSnake(requestBody, [{"x": 0, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 2}]);
	requestBodyBuilder.addYou(requestBody, [{"x": 4, "y": 8}, {"x": 4, "y": 9}, {"x": 5, "y": 9}, {"x": 6, "y": 9}, {"x": 6, "y": 8}, {"x": 7, "y": 8}, {"x": 7, "y": 7}, {"x": 7, "y": 6}, {"x": 7, "y": 5}, {"x": 7, "y": 4}, {"x": 7, "y": 3}, {"x": 7, "y": 2}, {"x": 6, "y": 2}, {"x": 6, "y": 3}, {"x": 5, "y": 3}, {"x": 4, "y": 3}, {"x": 4, "y": 4}, {"x": 5, "y": 4}, {"x": 5, "y": 5}, {"x": 4, "y": 5}, {"x": 4, "y": 6}, {"x": 4, "y": 7}, {"x": 3, "y": 7}], 2);
	requestBodyBuilder.printBoard(requestBody);

	var responseHandler = function (err, res) {
		testHelper.checkForGoodResponse(err, res);
		expect(res.body).to.have.property('move').with.equal('right');
		done();
	};

	testHelper.sendMoveRequest(url, requestBody, responseHandler);
});

// This is questionable, since there IS a chance of getting the food and living, but I'd argue that most likely if you grab this food you'll die.
// Also if you have higher health and neither of you grab the food, you should outlive the other snake.
it('should avoid very dangerous food if at full health', function(done) {
	var requestBody = requestBodyBuilder.getEmptyRequestBody(20, 20);
	requestBodyBuilder.addFood(requestBody, 0, 19);
	requestBodyBuilder.addSnake(requestBody, [{"x": 2, "y": 19}, {"x": 3, "y": 19}, {"x": 4, "y": 19}, {"x": 5, "y": 19}], 50);
	requestBodyBuilder.addYou(requestBody, [{"x": 0, "y": 18}, {"x": 0, "y": 17}, {"x": 1, "y": 17}, {"x": 1, "y": 16}, {"x": 1, "y": 15}, {"x": 1, "y": 14}]);
	requestBodyBuilder.printBoard(requestBody);

	var responseHandler = function (err, res) {
		testHelper.checkForGoodResponse(err, res);
		expect(res.body).to.have.property('move').with.equal('right');
		done();
	};

	testHelper.sendMoveRequest(url, requestBody, responseHandler);
});