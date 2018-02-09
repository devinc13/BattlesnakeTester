#! /usr/bin/env node
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
const requestBodyBuilder = require('./request_body_builder');
const host = process.env.npm_config_host;
const port = process.env.npm_config_port;


it('should handle start request', function(done) {
	console.log("No board");
	chai.request('http://' + host + ':' + port)
		.post('/start')
		.send({ "game_id": 1 })
		.end(function (err, res) {
			expect(err).to.be.null;
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('name');
			expect(res.body).to.have.property('head_url');
			done();
		});
});


it('should return a move (any move)', function(done) {
	var requestBody = requestBodyBuilder.getEmptyRequestBody(25, 15);
	requestBodyBuilder.addFood(requestBody, 7, 19);
	requestBodyBuilder.addSnake(requestBody, [{"x": 7, "y": 8}, {"x": 6, "y": 8}, {"x": 5, "y": 8}]);
	requestBodyBuilder.addYou(requestBody, [{"x": 11, "y": 11}, {"x": 11, "y": 12}, {"x": 11, "y": 13}]);
	console.log("\n\n");
	requestBodyBuilder.printBoard(requestBody);

	chai.request('http://' + host + ':' + port)
		.post('/move')
		.send(requestBody)
		.end(function (err, res) {
			expect(err).to.be.null;
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('move');
			done();
		});
});


it('should handle small spaces (flood fill)', function(done) {
	var requestBody = requestBodyBuilder.getEmptyRequestBody(20, 20);
	requestBodyBuilder.addFood(requestBody, 7, 19);
	requestBodyBuilder.addSnake(requestBody, [{"x": 10, "y": 18}, {"x": 9, "y": 18}, {"x": 8, "y": 18}, {"x": 7, "y": 18}, {"x": 6, "y": 18}, {"x": 5, "y": 18}, {"x": 4, "y": 18}, {"x": 3, "y": 18}, {"x": 2, "y": 18}, {"x": 1, "y": 18}, {"x": 0, "y": 18}, {"x": 0, "y": 17}, {"x": 0, "y": 16}, {"x": 0, "y": 15}, {"x": 0, "y": 14}, {"x": 0, "y": 13}, {"x": 0, "y": 12}, {"x": 0, "y": 11}]);
	requestBodyBuilder.addYou(requestBody, [{"x": 11, "y": 19}, {"x": 11, "y": 18}, {"x": 11, "y": 17}]);
	console.log("\n\n");
	requestBodyBuilder.printBoard(requestBody);

	chai.request('http://' + host + ':' + port)
		.post('/move')
		.send(requestBody)
		.end(function (err, res) {
			expect(err).to.be.null;
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('move').with.equal('right');
			done();
		});
});

it('should handle small spaces V2 (flood fill)', function(done) {
	var requestBody = requestBodyBuilder.getEmptyRequestBody(10, 10);
	requestBodyBuilder.addFood(requestBody, 9, 0);
	requestBodyBuilder.addSnake(requestBody, [{"x": 2, "y": 6}, {"x": 1, "y": 6}, {"x": 0, "y": 6}]);
	requestBodyBuilder.addYou(requestBody, [{"x": 8, "y": 0}, {"x": 8, "y": 1}, {"x": 8, "y": 2}, {"x": 8, "y": 3}, {"x": 8, "y": 4}, {"x": 8, "y": 5}, {"x": 8, "y": 6}, {"x": 8, "y": 7}, {"x": 8, "y": 8}, {"x": 8, "y": 9}, {"x": 7, "y": 9}, {"x": 6, "y": 9}, {"x": 5, "y": 9}, {"x": 4, "y": 9}, {"x": 3, "y": 9}, {"x": 2, "y": 9}, {"x": 1, "y": 9}, {"x": 0, "y": 9}]);
	console.log("\n\n");
	requestBodyBuilder.printBoard(requestBody);

	chai.request('http://' + host + ':' + port)
		.post('/move')
		.send(requestBody)
		.end(function (err, res) {
			expect(err).to.be.null;
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('move').with.equal('left');
			done();
		});
});

// https://rdbrck.slack.com/files/U8W0KQTUY/F95N8SM4Y/screen_shot_2018-02-08_at_3.59.16_pm.png
// Your snake has 2hp
it('should eat dangerous food to not die at 2hp (THIS IS HARD)', function(done) {
	var requestBody = requestBodyBuilder.getEmptyRequestBody(20, 20);
	requestBodyBuilder.addFood(requestBody, 1, 6);
	requestBodyBuilder.addFood(requestBody, 2, 14);
	requestBodyBuilder.addFood(requestBody, 4, 19);
	requestBodyBuilder.addFood(requestBody, 5, 8);
	requestBodyBuilder.addSnake(requestBody, [{"x": 0, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 2}]);
	requestBodyBuilder.addYou(requestBody, [{"x": 4, "y": 8}, {"x": 4, "y": 9}, {"x": 5, "y": 9}, {"x": 6, "y": 9}, {"x": 6, "y": 8}, {"x": 7, "y": 8}, {"x": 7, "y": 7}, {"x": 7, "y": 6}, {"x": 7, "y": 5}, {"x": 7, "y": 4}, {"x": 7, "y": 3}, {"x": 7, "y": 2}, {"x": 6, "y": 2}, {"x": 6, "y": 3}, {"x": 5, "y": 3}, {"x": 4, "y": 3}, {"x": 4, "y": 4}, {"x": 5, "y": 4}, {"x": 5, "y": 5}, {"x": 4, "y": 5}, {"x": 4, "y": 6}, {"x": 4, "y": 7}, {"x": 3, "y": 7}], 2);
	console.log("\n\n");
	requestBodyBuilder.printBoard(requestBody);

	chai.request('http://' + host + ':' + port)
		.post('/move')
		.send(requestBody)
		.end(function (err, res) {
			expect(err).to.be.null;
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('move').with.equal('right');
			done();
		});
});

// Your snake has 1hp, food right beside it (test for slither dying in a weird way)
it('should eat food beside you at 1hp', function(done) {
	var requestBody = requestBodyBuilder.getEmptyRequestBody(20, 20);
	requestBodyBuilder.addFood(requestBody, 1, 0);
	requestBodyBuilder.addFood(requestBody, 1, 3);
	requestBodyBuilder.addFood(requestBody, 0, 5);
	requestBodyBuilder.addFood(requestBody, 1, 6);
	requestBodyBuilder.addSnake(requestBody, [{"x": 15, "y": 0}, {"x": 15, "y": 1}, {"x": 15, "y": 2}]);
	requestBodyBuilder.addYou(requestBody, [{"x": 2, "y": 3}, {"x": 2, "y": 4}, {"x": 2, "y": 5}, {"x": 2, "y": 6}, {"x": 2, "y": 7}, {"x": 2, "y": 8}, {"x": 2, "y": 9}, {"x": 2, "y": 10}, {"x": 2, "y": 11}, {"x": 2, "y": 12}, {"x": 2, "y": 13}, {"x": 2, "y": 14}, {"x": 2, "y": 15}, {"x": 2, "y": 16}, {"x": 2, "y": 17}, {"x": 2, "y": 18}, {"x": 2, "y": 19}, {"x": 3, "y": 19}, {"x": 3, "y": 18}, {"x": 3, "y": 17}, {"x": 3, "y": 16}, {"x": 3, "y": 15}, {"x": 3, "y": 14}, {"x": 3, "y": 13}, {"x": 3, "y": 12}, {"x": 3, "y": 11}, {"x": 3, "y": 10}, {"x": 3, "y": 9}, {"x": 3, "y": 8}, {"x": 3, "y": 7}, {"x": 3, "y": 6}, {"x": 3, "y": 5}, {"x": 3, "y": 4}, {"x": 3, "y": 3}, {"x": 3, "y": 2}, {"x": 3, "y": 1}, {"x": 3, "y": 0}, {"x": 2, "y": 0}, {"x": 2, "y": 1}], 1);
	console.log("\n\n");
	requestBodyBuilder.printBoard(requestBody);

	chai.request('http://' + host + ':' + port)
		.post('/move')
		.send(requestBody)
		.end(function (err, res) {
			expect(err).to.be.null;
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('move').with.equal('left');
			done();
		});
});

// Your snake has 1hp, food right beside it, and an enemy snake (test for slither dying in a weird way)
it('should eat food beside you at 1hp with enemy snake around', function(done) {
	var requestBody = requestBodyBuilder.getEmptyRequestBody(20, 20);
	requestBodyBuilder.addFood(requestBody, 1, 0);
	requestBodyBuilder.addFood(requestBody, 1, 3);
	requestBodyBuilder.addFood(requestBody, 0, 5);
	requestBodyBuilder.addFood(requestBody, 1, 6);
	requestBodyBuilder.addSnake(requestBody, [{"x": 5, "y": 4}, {"x": 5, "y": 5}, {"x": 5, "y": 6}, {"x": 5, "y": 7}, {"x": 5, "y": 8}, {"x": 5, "y": 9}, {"x": 5, "y": 10}, {"x": 5, "y": 11}, {"x": 5, "y": 12}, {"x": 5, "y": 13}, {"x": 5, "y": 14}, {"x": 5, "y": 15}, {"x": 5, "y": 16}, {"x": 5, "y": 17}, {"x": 5, "y": 18}, {"x": 5, "y": 19}, {"x": 6, "y": 19}, {"x": 6, "y": 18}]);
	requestBodyBuilder.addYou(requestBody, [{"x": 2, "y": 3}, {"x": 2, "y": 4}, {"x": 2, "y": 5}, {"x": 2, "y": 6}, {"x": 2, "y": 7}, {"x": 2, "y": 8}, {"x": 2, "y": 9}, {"x": 2, "y": 10}, {"x": 2, "y": 11}, {"x": 2, "y": 12}, {"x": 2, "y": 13}, {"x": 2, "y": 14}, {"x": 2, "y": 15}, {"x": 2, "y": 16}, {"x": 2, "y": 17}, {"x": 2, "y": 18}, {"x": 2, "y": 19}, {"x": 3, "y": 19}, {"x": 3, "y": 18}, {"x": 3, "y": 17}, {"x": 3, "y": 16}, {"x": 3, "y": 15}, {"x": 3, "y": 14}, {"x": 3, "y": 13}, {"x": 3, "y": 12}, {"x": 3, "y": 11}, {"x": 3, "y": 10}, {"x": 3, "y": 9}, {"x": 3, "y": 8}, {"x": 3, "y": 7}, {"x": 3, "y": 6}, {"x": 3, "y": 5}, {"x": 3, "y": 4}, {"x": 3, "y": 3}, {"x": 3, "y": 2}, {"x": 3, "y": 1}, {"x": 3, "y": 0}, {"x": 2, "y": 0}, {"x": 2, "y": 1}], 1);
	console.log("\n\n");
	requestBodyBuilder.printBoard(requestBody);

	chai.request('http://' + host + ':' + port)
		.post('/move')
		.send(requestBody)
		.end(function (err, res) {
			expect(err).to.be.null;
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('move').with.equal('left');
			done();
		});
});

// Test for chasing tail after eating food
it('should not move into a space behind a tail that is about to grow', function(done) {
	var requestBody = requestBodyBuilder.getEmptyRequestBody(20, 20);
	requestBodyBuilder.addFood(requestBody, 7, 19);
	requestBodyBuilder.addSnake(requestBody, [{"x": 0, "y": 0}, {"x": 0, "y": 1}, {"x": 0, "y": 2}]);
	requestBodyBuilder.addYou(requestBody, [{"x": 11, "y": 11}, {"x": 11, "y": 12}, {"x": 12, "y": 12}, {"x": 12, "y": 11}, {"x": 12, "y": 10}, {"x": 12, "y": 9}, {"x": 11, "y": 9}, {"x": 11, "y": 10}, {"x": 11, "y": 10}]);
	console.log("\n\n");
	requestBodyBuilder.printBoard(requestBody);

	chai.request('http://' + host + ':' + port)
		.post('/move')
		.send(requestBody)
		.end(function (err, res) {
			expect(err).to.be.null;
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('move').with.not.equal('up');
			done();
		});
});


it('should not kill itself when scared of another shorter snake', function(done) {
	var requestBody = requestBodyBuilder.getEmptyRequestBody(20, 20);
	requestBodyBuilder.addFood(requestBody, 12, 5);
	requestBodyBuilder.addSnake(requestBody, [{"x": 14, "y": 4}, {"x": 15, "y": 4}, {"x": 15, "y": 5}, {"x": 15, "y": 6}, {"x": 15, "y": 7}, {"x": 15, "y": 8}, {"x": 16, "y": 8}, {"x": 17, "y": 8}, {"x": 17, "y": 7}]);
	requestBodyBuilder.addYou(requestBody, [{"x": 13, "y": 3}, {"x": 12, "y": 3}, {"x": 12, "y": 2}, {"x": 13, "y": 2}, {"x": 14, "y": 2}, {"x": 15, "y": 2}, {"x": 16, "y": 2}, {"x": 17, "y": 2}, {"x": 17, "y": 3}, {"x": 18, "y": 3}, {"x": 19, "y": 3}]);
	console.log("\n\n");
	requestBodyBuilder.printBoard(requestBody);

	chai.request('http://' + host + ':' + port)
		.post('/move')
		.send(requestBody)
		.end(function (err, res) {
			expect(err).to.be.null;
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('move').with.not.equal('up');
			expect(res.body).to.have.property('move').with.not.equal('left');
			done();
		});
});

it('should not kill itself when scared of another longer snake', function(done) {
	var requestBody = requestBodyBuilder.getEmptyRequestBody(20, 20);
	requestBodyBuilder.addFood(requestBody, 12, 5);
	requestBodyBuilder.addSnake(requestBody, [{"x": 14, "y": 4}, {"x": 15, "y": 4}, {"x": 15, "y": 5}, {"x": 15, "y": 6}, {"x": 15, "y": 7}, {"x": 15, "y": 8}, {"x": 16, "y": 8}, {"x": 17, "y": 8}, {"x": 17, "y": 9}, {"x": 17, "y": 10}, {"x": 17, "y": 11}, {"x": 17, "y": 12}, {"x": 17, "y": 13}, {"x": 17, "y": 14}, {"x": 17, "y": 15}]);
	requestBodyBuilder.addYou(requestBody, [{"x": 13, "y": 3}, {"x": 12, "y": 3}, {"x": 12, "y": 2}, {"x": 13, "y": 2}, {"x": 14, "y": 2}, {"x": 15, "y": 2}, {"x": 16, "y": 2}, {"x": 17, "y": 2}, {"x": 17, "y": 3}, {"x": 18, "y": 3}, {"x": 19, "y": 3}]);
	console.log("\n\n");
	requestBodyBuilder.printBoard(requestBody);

	chai.request('http://' + host + ':' + port)
		.post('/move')
		.send(requestBody)
		.end(function (err, res) {
			expect(err).to.be.null;
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('move').with.not.equal('up');
			expect(res.body).to.have.property('move').with.not.equal('left');
			done();
		});
});

it('should avoid the head of another longer snake', function(done) {
	var requestBody = requestBodyBuilder.getEmptyRequestBody(20, 20);
	requestBodyBuilder.addFood(requestBody, 12, 5);
	requestBodyBuilder.addSnake(requestBody, [{"x": 14, "y": 4}, {"x": 15, "y": 4}, {"x": 15, "y": 5}, {"x": 15, "y": 6}, {"x": 15, "y": 7}, {"x": 15, "y": 8}, {"x": 16, "y": 8}, {"x": 17, "y": 8}, {"x": 17, "y": 9}, {"x": 17, "y": 10}, {"x": 17, "y": 11}, {"x": 17, "y": 12}, {"x": 17, "y": 13}, {"x": 17, "y": 14}, {"x": 17, "y": 15}]);
	requestBodyBuilder.addYou(requestBody, [{"x": 13, "y": 3}, {"x": 13, "y": 2}, {"x": 14, "y": 2}, {"x": 15, "y": 2}, {"x": 16, "y": 2}, {"x": 17, "y": 2}, {"x": 17, "y": 3}, {"x": 18, "y": 3}, {"x": 19, "y": 3}]);
	console.log("\n\n");
	requestBodyBuilder.printBoard(requestBody);

	chai.request('http://' + host + ':' + port)
		.post('/move')
		.send(requestBody)
		.end(function (err, res) {
			expect(err).to.be.null;
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('move').with.equal('left');
			done();
		});
});

// Test one of Shiffany's deaths
it('should avoid dead end food', function(done) {
	var requestBody = requestBodyBuilder.getEmptyRequestBody(20, 20);
	requestBodyBuilder.addFood(requestBody, 10, 5);
	requestBodyBuilder.addFood(requestBody, 13, 3);
	requestBodyBuilder.addSnake(requestBody, [{"x": 10, "y": 2}, {"x": 9, "y": 2}, {"x": 9, "y": 3}, {"x": 9, "y": 4}, {"x": 9, "y": 5}, {"x": 9, "y": 6}, {"x": 9, "y": 7}, {"x": 10, "y": 7}, {"x": 10, "y": 8}, {"x": 11, "y": 8}, {"x": 12, "y": 8}, {"x": 13, "y": 8}, {"x": 14, "y": 8}, {"x": 15, "y": 8}], 30);
	requestBodyBuilder.addYou(requestBody, [{"x": 10, "y": 4}, {"x": 11, "y": 4}, {"x": 11, "y": 5}, {"x": 11, "y": 6}, {"x": 12, "y": 6}, {"x": 12, "y": 5}, {"x": 12, "y": 4}, {"x": 12, "y": 3}]);
	console.log("\n\n");
	requestBodyBuilder.printBoard(requestBody);

	chai.request('http://' + host + ':' + port)
		.post('/move')
		.send(requestBody)
		.end(function (err, res) {
			expect(err).to.be.null;
			expect(res).to.have.status(200);
			expect(res.body).to.have.property('move').with.equal('up');
			done();
		});
});
