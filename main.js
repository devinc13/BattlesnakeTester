#! /usr/bin/env node

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;

// Test Start
chai.request('http://localhost:9001')
	.post('/start')
  	.send({ "game_id": 1 })
	.end(function (err, res) {
		expect(err).to.be.null;
		expect(res).to.have.status(200);
		expect(res.body).to.have.property('name');
		expect(res.body).to.have.property('head_url');
	});

// Test Basic Move
chai.request('http://localhost:9001')
	.post('/move')
  	.send(require('./MoveRequestBodies/basicMoveTest.json'))
	.end(function (err, res) {
		expect(err).to.be.null;
		expect(res).to.have.status(200);
		expect(res.body).to.have.property('move');
	});

// Test Small Spaces - food is in dead end small space
chai.request('http://localhost:9001')
	.post('/move')
  	.send(require('./MoveRequestBodies/dontGoInSmallSpaces.json'))
	.end(function (err, res) {
		expect(err).to.be.null;
		expect(res).to.have.status(200);
		expect(res.body).to.have.property('move').with.equal('right');
	});
